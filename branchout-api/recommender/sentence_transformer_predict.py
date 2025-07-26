from fastapi import FastAPI, Request
from sentence_transformers import SentenceTransformer
import numpy as np

app = FastAPI()

model = None  # Will be loaded after startup


@app.on_event("startup")
async def load_model():
    global model
    print("Loading sentence transformer model...")
    model = SentenceTransformer("paraphrase-albert-small-v2")
    print("Model loaded and ready.")


@app.get("/")
async def root():
    return {"message": "API is running!"}


@app.post("/recommend")
async def recommend(request: Request):
    global model
    if model is None:
        return {"error": "Model is still loading, please try again shortly."}

    data = await request.json()
    sentences = data.get("sentences", [])

    if not sentences:
        return {"error": "No sentences provided."}

    embeddings = model.encode(sentences)
    return {"embeddings": embeddings.tolist()}
