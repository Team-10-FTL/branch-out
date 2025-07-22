import './SavedRepos.css';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import RepoCard from '../../components/RepoCard/RepoCard';
import RepoCardModal from '../../components/RepoCardModal/RepoCardModal';

function SavedReposPage() {
  const { user } = useUser();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    const fetchSavedRepos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_DATABASE_URL}/repos/saved`, {
          headers: {
            Authorization: `Bearer ${user.getToken()}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch saved repositories');
        }
        const data = await response.json();
        setRepos(data);
      } catch (error) {
        console.error('Error fetching saved repositories:', error);
      }
      setLoading(false);
    };
    fetchSavedRepos();
  }, [user, navigate]); 
    if (loading) {
        return <div>Loading...</div>;
    }
    if (repos.length === 0) {
        return <div>No saved repositories found.</div>;
    }
    return (
    <div className="saved-repos-page">
      <h1>Saved Repositories</h1>
      <div className="repo-list">
        {repos.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            onClick={() => navigate(`/repo/${repo.id}`)}
          />
        ))}
      </div>
      <RepoCardModal />
    </div>
  );
}

export default SavedReposPage;