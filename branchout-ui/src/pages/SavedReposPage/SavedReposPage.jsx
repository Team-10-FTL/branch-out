import './SavedRepos.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RepoCard from '../../components/RepoCard/RepoCard';
import SavedRepoCard from '../../components/SavedRepoCard/SavedRepoCard';
import { useAuth } from '../../components/ProtectedRoute/ProtectedRoute.jsx';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

function SavedReposPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    const fetchSavedRepos = async () => {
      try {
        let token;
        let userId;
        if (user && typeof user.getToken === 'function') {
          token = await user.getToken();
          userId = user.id;
        } else {
          token = localStorage.getItem('authToken');
          userId = user?.id;
        }
        if (!userId) {
          throw new Error('User ID not found');
        }
        const response = await fetch(
          `${import.meta.env.VITE_DATABASE_URL}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        const data = await response.json();
        setRepos(data.savedRepos || []);
      } catch (error) {
        console.error('Error fetching saved repositories:', error);
      }
      setLoading(false);
    };
    fetchSavedRepos();
  }, [isAuthenticated, isLoading, navigate, user]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (repos.length === 0) {
    return <div>No saved repositories found.</div>;
  }
  return (
    <div className="saved-repos-page">
      <h1>Saved Repositories</h1>
      <div className="repo-list" >
        {repos.map((repo) => (
          <SavedRepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
}

export default SavedReposPage;