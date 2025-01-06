# ThrillTrail

My friends and I often struggle to find things to do in new cities (and sometimes even at home!). ThrillTrail searches thousands of posts to find the best spots, attractions, restaurants, bars, etc. you can visit in a new city :)

## Getting Started

First, make sure to install any dependcies.

```bash
npm install
# In retrieval/
pip3 install -r requirements.txt
```

The project uses the following external APIs:
- Reddit API (for post & comment retrieval)
- Google Maps API (get relevant address information)

Please create a local .env file that follows the format in "sample.env".

To run the project locally:
```bash
#In retrieval/
python3 -m flask run
#In root directory
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start searching!

## Demo

You can check out a [a demo video](https://youtu.be/GuFV0r49SS8) demonstrating the pipeline in action — any feedback is greatly appreciated!

## Architecture

## Features

- [x] Faiss-based IR of relevant osts & comments from Reddit API using search query
- [x] Google Maps API address retrieval
- [x] GPT-4o Integration w/ cleaned JSON output
- [x] Relevant image retrieval
- [x] Automatic citations for LLM response
- [x] Flask-based REST API to handle outgoing requests
- [x] Search Animations
- [ ] Real-time retrieval