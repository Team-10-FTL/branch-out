from sentence_transformers import SentenceTransformer, util

def rerank_repos(user_profile, repo_texts, top_k=5):
    """
    repo_texts: list of strings, each combining repo description and feedback reason (if any)
    """
    model = SentenceTransformer('all-MiniLM-L6-v2')
    user_embedding = model.encode([user_profile])
    repo_embeddings = model.encode(repo_texts)
    similarities = util.cos_sim(user_embedding, repo_embeddings)[0]
    top_indices = similarities.argsort(descending=True)[:top_k]
    return [repo_texts[i] for i in top_indices]