import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import praw
from dotenv import load_dotenv
import os
import faiss
from sentence_transformers import SentenceTransformer
import openai
import json

load_dotenv()

reddit = praw.Reddit(client_id=os.environ['REDDIT_CLIENT_ID'], 
                     client_secret=os.environ['REDDIT_CLIENT_SECRET'],
                     user_agent="crawler")

openai.api_key = os.environ["OPENAI_KEY"]

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def main():
    return "Index"

@app.route("/search", methods=["POST"])
def find_posts():

    data = request.get_json()

    query = data["query"]

    results = reddit.subreddit("all").search(query, limit=None)
    ids = []
    titles = []
    for post in results:
        titles.append(post.title)
        ids.append(post.id)

    
    title_embeddings = model.encode(titles)

    index = faiss.IndexFlatL2(title_embeddings.shape[1]) # Create L2 distance index
    
    #add normalized vectors to index
    faiss.normalize_L2(title_embeddings)
    index.add(title_embeddings)

    query_vec = np.array([model.encode(query)])
    faiss.normalize_L2(query_vec)

    distances, ann = index.search(query_vec, k=index.ntotal)

    top_posts = np.array(ids)[ann[0]][:10]
    all_comments = []

    for post in top_posts:
        all_comments.extend(retrieve_comments(post))
    
    return jsonify({"locations": generate_response(query,all_comments)})

def retrieve_comments(postId):
    submission = reddit.submission(postId)
    url = submission.url
    submission.comment_sort = "top"
    submission.comments.replace_more(limit=0)
    return [(comment.body, url) for comment in submission.comments[:10]]

def sanitize_unescaped_quotes(s: str, strict=False) -> dict:
    js_str = s
    prev_pos = -1
    cur_pos = 0
    while cur_pos > prev_pos:
        prev_pos = cur_pos
        try:
            return json.loads(js_str, strict=strict)
        except json.JSONDecodeError as err:
            cur_pos = err.pos
            if cur_pos <= prev_pos:
                raise err
        prev_quote_index = js_str.rfind("'", 0, cur_pos)
        js_str = js_str[:prev_quote_index] + '\\' + js_str[prev_quote_index:]


def generate_response(query, comments):
    comments = "\n".join([', '.join(comment) for comment in comments])
    
    prompt = "You are an expert travel guide that knows all the best local attractions, restaurants, bars, etc. Given the following reddit comments and corresponding url pruned via the following user query: " + query + ", find the desired location/attraction for the user to go to. The locations you pick must be as accurate according to the user query (don't just suggest something random, put careful thought in the suggestion). Do not repeat any locations. Feel free to suggest an event as a location, just make sure it has a location associated with it. Please make sure to quote the exact comment referenced and give the addresses of the top locations you determine. Use comments that are directly related to the user's query. You MUST pick 5-10 locations. Provide a brief explanation for why you picked these locations (e.g. maybe point out some of the fun activities you can partake in at that location). The locations you suggest must be in the same location as the user query. Make sure your entire response can be covered within the json output (you have a limit of 2048 tokens). Return your response in a json format as folows: {\"results\": [{\"comment\": \"COMMENT_1\", \"commentUrl\": \"URL_1\", \"location_name\": \"LOCATION_1\", \"address\": \"ADDRESS_1\"} \"explanation\": \"EXPLANATION_1\", ...]}"

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
            "role": "system",
            "content": [
                {
                "text": prompt,
                "type": "text"
                }
            ]
            },
            {
            "role": "user",
            "content": [
                {
                "type": "text",
                "text": comments
                }
            ]
            }
        ],
        temperature=0.5,
        max_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        response_format={
            "type": "json_object"
        }
    )
    print(response)
    try:
        json_resp = sanitize_unescaped_quotes(response.choices[0].message.content)
        
    except Exception as e:
        print(e)
        json_resp = None

    return json_resp['results']