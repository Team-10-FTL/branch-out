import sys
import pickle
import numpy as np
import json

from prisma import Prisma
from sentence_transformer_rerank import rerank_repos

def fetch_user_profile(user_id):
    db = Prisma()
    db.connect()
    user = db.user.find_unique(where={"id": int(user_id)})
    db.disconnect()
    if not user:
        return ""
    # Combine username, languages, skill, and preferenceTags for profile
    profile_parts = [
        user.username,
        " ".join(user.languages or []),
        " ".join([str(skill) for skill in (user.skill or [])]),
        " ".join(user.preferenceTags or [])
    ]
    return " ".join(profile_parts)

def fetch_repo_texts(user_id, repo_ids):
    """
    For each repo, combine its description and the user's feedback reason (if any).
    Returns a list of strings in the same order as repo_ids.
    """
def fetch_repo_texts(user_id, repo_ids):
    db = Prisma()
    db.connect()
    repos = db.repo.find_many(
        where={"id": {"in": [int(rid) for rid in repo_ids]}},
        select={"id": True, "description": True}
    )
    feedbacks = db.feedBack.find_many(
        where={
            "userId": int(user_id),
            "repoId": {"in": [int(rid) for rid in repo_ids]}
        },
        select={"repoId": True, "feedbackReason": True}
    )
    db.disconnect()
    feedback_map = {str(fb.repoId): str(fb.feedbackReason) for fb in feedbacks if fb.feedbackReason}
    repo_map = {str(repo.id): repo.description for repo in repos}
    return [
        f"{repo_map.get(rid, '')} {feedback_map.get(rid, '')}".strip()
        for rid in repo_ids
    ]

def recommend_for_user(user_id, model, dataset, n=10):
    user_ids = list(dataset._user_id_mapping.keys())
    repo_ids = list(dataset._item_id_mapping.keys())

    if user_id not in user_ids:
        return []

    user_index = user_ids.index(user_id)
    scores = model.predict(user_index, np.arange(len(repo_ids)))
    top_items = np.argsort(-scores)  # All indices, sorted by score descending

    # Fetch disliked repo IDs
    db = Prisma()
    db.connect()
    disliked_feedbacks = db.feedBack.find_many(
        where={
            "userId": int(user_id),
            "swipeDirection": "left"
        },
        select={"repoId": True}
    )
    db.disconnect()
    disliked_ids = set(str(fb.repoId) for fb in disliked_feedbacks)

    # Collect up to n recommendations, skipping disliked ones
    recommended_repo_ids = []
    for i in top_items:
        repo_id = repo_ids[i]
        if str(repo_id) not in disliked_ids and repo_id not in recommended_repo_ids:
            recommended_repo_ids.append(repo_id)
        if len(recommended_repo_ids) == n:
            break

    return recommended_repo_ids

def get_recommendations(user_id):
    with open('lightfm_model.pkl', 'rb') as f:
        model, dataset = pickle.load(f)
    recommendations = recommend_for_user(user_id, model, dataset, n=1)  # Only 1 recommendation
    user_profile = fetch_user_profile(user_id)
    repo_texts = fetch_repo_texts(user_id, recommendations)
    if user_profile and all(repo_texts):
        reranked_texts = rerank_repos(user_profile, repo_texts, top_k=1)
        reranked_ids = [recommendations[repo_texts.index(text)] for text in reranked_texts]
        return reranked_ids
    else:
        return recommendations

if __name__ == "__main__":
    user_id = sys.argv[1]
    recommended_ids = get_recommendations(user_id)
    # Print a single ID, not a list
    print(json.dumps(recommended_ids[0] if recommended_ids else None))