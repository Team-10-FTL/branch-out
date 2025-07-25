from fastapi import FastAPI, Request
from sentence_transformers import SentenceTransformer
import numpy as np

app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')

@app.post("/recommend")
async def recommend(request: Request):
    data = await request.json()
    user_profile = data.get('user_profile', '')
    repos = data.get('repos', [])  # repos = [{id: ..., text: ...}]

    if not user_profile or not repos:
        return {"recommendations": []}

    # Embed user profile
    user_emb = model.encode(user_profile)

    # Embed repo texts on the fly
    repo_texts = [repo['text'] for repo in repos]
    repo_embs = model.encode(repo_texts)

    # Score similarity
    repo_ids = [repo['id'] for repo in repos]
    scores = np.dot(repo_embs, user_emb) / (np.linalg.norm(repo_embs, axis=1) * np.linalg.norm(user_emb) + 1e-8)
    top_idx = np.argsort(scores)[::-1][:10]
    top_repo_ids = [repo_ids[i] for i in top_idx]

    return {"recommendations": top_repo_ids}
