import sys
import pickle
import json
import turicreate as tc
from prisma import Prisma
from sentence_transformer_rerank import rerank_repos

def fetch_user_profile(user_id):
    db = Prisma()
    db.connect()
    user = db.user.find_unique(where={"id": int(user_id)})
    db.disconnect()
    if not user:
        return ""
    profile = f"{user['username']} " \
              f"{' '.join(user.get('languages', []))} " \
              f"{' '.join(user.get('skill', []))} " \
              f"{' '.join(user.get('preferenceTags', []))}"
    return profile

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

def get_recommendations(user_id):
    model = tc.load_model('turicreate_model')
    with open('turicreate_users_repos.pkl', 'rb') as f:
        mapping = pickle.load(f)
    users = mapping['users']
    repos = mapping['repos']

    # Exclude repos the user has already swiped left on
    db = Prisma()
    db.connect()
    disliked = db.feedBack.find_many(
        where={"userId": int(user_id), "swipeDirection": "left"},
        select={"repoId": True}
    )
    db.disconnect()
    disliked_ids = set(str(fb.repoId) for fb in disliked)

    # Recommend repos not disliked
    recs = model.recommend(users=[str(user_id)], k=10)
    rec_repo_ids = [str(r['repo_id']) for r in recs if str(r['repo_id']) not in disliked_ids]
    if not rec_repo_ids:
        return []

    # Rerank with sentence-transformers
    user_profile = fetch_user_profile(user_id)
    repo_texts = fetch_repo_texts(user_id, rec_repo_ids)
    if user_profile and all(repo_texts):
        reranked_texts = rerank_repos(user_profile, repo_texts, top_k=1)
        reranked_ids = [rec_repo_ids[repo_texts.index(text)] for text in reranked_texts]
        return reranked_ids
    else:
        return rec_repo_ids[:1]

if __name__ == "__main__":
    user_id = sys.argv[1]
    recommended_ids = get_recommendations(user_id)
    print(json.dumps(recommended_ids[0] if recommended_ids else None))