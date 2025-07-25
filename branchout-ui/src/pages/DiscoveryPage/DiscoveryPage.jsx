import { useState, useEffect } from 'react';
import RepoCard from '../../components/RepoCard/RepoCard';
import CritiqueChips from '../../components/Feedback/CritiqueChips';
import { Box, CssBaseline, Modal, Fade } from '@mui/material';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from "axios";

const DiscoveryPage = () => {
  const CRITIQUE_OPTIONS = [
    "NOTINTERESTED",
    "MISLEADING",
    "TOOCOMPLEX",
    "TOOEASY"
  ];

  const [repos, setRepos] = useState([]);
  const { user: clerkUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const { getToken } = useAuth();

  const localUser = (() => {
    try {
      const userData = localStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  })();

  // Final user
  const user = clerkUser || localUser;
  const userId = user?.id;
  const VITE_URL = import.meta.env.VITE_DATABASE_URL;

  // Fetch recommendations on mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const response = await axios.get(`${VITE_URL}/user/recommendations/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Use the ordered repo objects directly
        setRepos(response.data.recommendations || []);
      } catch (err) {
        setLoading(false);
      }
      setLoading(false);
    };
    fetchRecommendations();
  }, [userId, getToken, VITE_URL]);

  // Fetch recommendations after feedback
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(`${VITE_URL}/user/recommendations/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRepos(response.data.recommendations || []);
    } catch (err) {
      setLoading(false);
    }
    setLoading(false);
  };

  const handleSwipeLeft = (repo) => {
    setSelectedRepo(repo);
    setShowFeedbackModal(true);
  };

  const handleSwipeRight = async (repo) => {
    try {
      const token = await getToken();
      await axios.post(`${VITE_URL}/repo/swipe`, {
        userId: user?.id,
        repoId: repo.id,
        direction: "RIGHT"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await fetchRecommendations();
    } catch (err) {
      console.error("Swipe RIGHT failed", err);
    }
    setCurrentIndex(prev => (prev + 1) % repos.length);
  };

  const handleCritiqueSelect = async (reason) => {
    try {
      const token = await getToken();
      const payload = {
        userId: user?.id,
        repoId: selectedRepo?.id,
        direction: "LEFT",
        feedbackReason: reason
      };
      await axios.post(`${VITE_URL}/repo/swipe`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await fetchRecommendations();
    } catch (error) {
      console.error('Error sending feedback:', error.response?.data || error.message);
    }
    setShowFeedbackModal(false);
    setSelectedRepo(null);
    setCurrentIndex(prev => (prev + 1) % repos.length);
  };

  return (
    <>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <h1>Discovery Page</h1>
        <p>Swipe left to dislike, right to like!</p>
        {loading && <p>Loading recommendations...</p>}
        {!loading && repos.length > 0 && (
          <RepoCard
            repo={repos[currentIndex]}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            className="repo-card"
          />
        )}
        {!loading && repos.length === 0 && (
          <p>No recommendations available.</p>
        )}
      </Box>
      <Modal
        open={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        closeAfterTransition
      >
        <Fade in={showFeedbackModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}>
            <CritiqueChips onSelect={handleCritiqueSelect} />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default DiscoveryPage;