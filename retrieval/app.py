import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import praw
from dotenv import load_dotenv
import os
import faiss
from sentence_transformers import SentenceTransformer

load_dotenv()

reddit = praw.Reddit(client_id=os.environ['REDDIT_CLIENT_ID'], 
                     client_secret=os.environ['REDDIT_CLIENT_SECRET'],
                     user_agent="crawler")

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

    results = reddit.subreddit("all").search(query, limit=100)
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

    top_posts = list(np.array(ids)[ann[0]][:10])
    all_comments = []

    for post in top_posts:
        all_comments.extend(retrieve_comments(post))
    
    return jsonify({"posts": top_posts, "comments": all_comments})

def retrieve_comments(postId):
    submission = reddit.submission(postId)
    comments = []
    for top_comment in submission.comments:
        if len(comments) < 5:
            comments.append(top_comment.body)
    return comments

    


