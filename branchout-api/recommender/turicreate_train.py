import turicreate as tc
import pickle
from prisma import Prisma

def fetch_interactions():
    db = Prisma()
    db.connect()
    users = db.user.find_many(include={"savedRepos": True})
    feedbacks = db.feedBack.find_many()
    db.disconnect()

    data = []
    for user in users:
        for repo in user.savedRepos:
            data.append({"user_id": str(user.id), "repo_id": str(repo.id), "score": 1})
    for fb in feedbacks:
        if fb.swipeDirection == "left":
            data.append({"user_id": str(fb.userId), "repo_id": str(fb.repoId), "score": 0})
    return tc.SFrame(data)

def main():
    sf = fetch_interactions()
    model = tc.recommender.create(sf, user_id='user_id', item_id='repo_id', target='score')
    model.save('turicreate_model')
    # Save user and repo lists for mapping
    users = sf['user_id'].unique()
    repos = sf['repo_id'].unique()
    with open('turicreate_users_repos.pkl', 'wb') as f:
        pickle.dump({'users': users, 'repos': repos}, f)

if __name__ == "__main__":
    main()