import pickle
import numpy as np
from lightfm import LightFM
from lightfm.data import Dataset

from prisma import Prisma  # <-- This imports the Prisma client

def fetch_interactions():
    db = Prisma()
    db.connect()
    users = db.user.find_many(
        include={"savedRepos": True}
    )
    interactions = []
    # Positive interactions (saved repos)
    for user in users:
        for repo in user.savedRepos:
            interactions.append((str(user.id), str(repo.id), 1))  # 1 = positive

    # Negative interactions (feedback)
    feedbacks = db.feedBack.find_many()
    for fb in feedbacks:
        if fb.swipeDirection == "left":
            # You can use -1 or 0 for negative feedback
            interactions.append((str(fb.userId), str(fb.repoId), -1))
            # Optionally, you can use fb.feedbackReason for more logic

    db.disconnect()
    return interactions

def main():
    interactions = fetch_interactions()
    users = set(u for u, _, _ in interactions)
    repos = set(r for _, r, _ in interactions)

    dataset = Dataset()
    dataset.fit(users, repos)

    (interactions_matrix, _) = dataset.build_interactions(
        ((u, r, int(i)) for u, r, i in interactions)
    )

    model = LightFM(loss='warp')
    model.fit(interactions_matrix, epochs=20, num_threads=2)

    with open('lightfm_model.pkl', 'wb') as f:
        pickle.dump((model, dataset), f)

if __name__ == "__main__":
    main()