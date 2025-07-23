import { useState, useEffect } from 'react';
import RepoCard from '../../components/RepoCard/RepoCard';
import CritiqueChips from '../../components/Feedback/CritiqueChips';
import { Box, CssBaseline, Modal, Backdrop, Fade } from '@mui/material';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from "axios";
import { useRecommendations } from '../../hooks/useRecommendations';

const DiscoveryPage = () => {
  const CRITIQUE_OPTIONS = [
    "NOTINTERESTED",
    "MISLEADING",
    "TOOCOMPLEX",
    "TOOEASY"
  ];

  const { user: clerkUser } = useUser();
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

  // Use WebSocket recommendations
  const { recommendations: repos, refreshRecommendations } = useRecommendations(userId);

  useEffect(() => {
    setCurrentIndex(0); // Reset index when recommendations change
  }, [repos]);

  const handleSwipeLeft = (repo) => {
    setSelectedRepo(repo);
    setShowFeedbackModal(true); // show chips modal
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
      // Optionally refresh recommendations after swipe
      refreshRecommendations();
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
      // Optionally refresh recommendations after feedback
      refreshRecommendations();
    } catch (error) {
      console.error('Error sending feedback:', error.response?.data || error.message);
    }
    setShowFeedbackModal(false);
    setSelectedRepo(null);
    setCurrentIndex(prev => (prev + 1) % repos.length);
  };

  const drawerWidth = 270;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <h1>Discovery Page</h1>
        <p>Swipe left to dislike, right to like!</p>
        {repos.length > 0 && (
          <RepoCard
            repo={repos[currentIndex]}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            className="repo-card"
          />
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
    </Box>
  );
}

export default DiscoveryPage;