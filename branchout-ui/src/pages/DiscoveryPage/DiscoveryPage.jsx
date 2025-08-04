import { useState, useEffect } from 'react';
import RepoCard from '../../components/RepoCard/RepoCard';
import CritiqueChips from '../../components/Feedback/CritiqueChips';
import Chat from '../../components/ChatBox/Chat.jsx';
import { Box, CssBaseline, Modal, Fade, useMediaQuery, useTheme, CircularProgress, Typography } from '@mui/material';
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
  const [confidenceScores, setConfidenceScores] = useState([]);
  const [isLoadingNewBatch, setIsLoadingNewBatch] = useState(false);
  const { getToken } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLarge = useMediaQuery('(min-width:1130px)');

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

  // Fetch recommendations
  const fetchRecommendations = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setIsLoadingNewBatch(true);
    }
    
    try {
      const token = await getToken();
      const response = await axios.get(`${VITE_URL}/user/recommendations/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Reset to beginning with new batch
      setRepos(response.data.recommendations || []);
      setConfidenceScores(response.data.confidence || []);
      setCurrentIndex(0); // Reset carousel to start
      
    } catch (err) {
      console.log("Error:", err);
    } finally {
      if (showLoader) {
        setLoading(false);
      } else {
        setIsLoadingNewBatch(false);
      }
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchRecommendations(true);
  }, [userId, getToken, VITE_URL]);

  // Check if we need to load new batch when reaching the end
  useEffect(() => {
    // If we've seen all repos in current batch, fetch new ones
    if (repos.length > 0 && currentIndex >= repos.length) {
      console.log("Reached end of current batch, fetching new recommendations...");
      fetchRecommendations(false); // Don't show main loader
    }
  }, [currentIndex, repos.length]);

  const handleSwipeLeft = (repo) => {
    console.log("Left swipe triggered");
    setSelectedRepo(repo);
    setShowFeedbackModal(true);
  };

  const handleSwipeRight = async (repo) => {
    console.log("Right swipe triggered");
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
      
      // Move to next repo
      setCurrentIndex(prev => prev + 1);
      
    } catch (err) {
      console.error("Swipe RIGHT failed", err);
    }
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
      
      // Move to next repo
      setCurrentIndex(prev => prev + 1);
      
    } catch (error) {
      console.error('Error sending feedback:', error.response?.data || error.message);
    }
    
    setShowFeedbackModal(false);
    setSelectedRepo(null);
  };

  const getCardStyles = (styleClass) => {
    const baseStyles = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: 'none',
    };

    switch (styleClass) {
      case 'active':
        return {
          ...baseStyles,
          transform: 'translate(calc(-50% - 20px), -50%) scale(1)',
          opacity: 1,
          zIndex: 10,
          pointerEvents: 'auto',
        };

      case 'left':
      case 'right': {
        if (isMobile) {
          return { display: 'none' };
        }

        const transform =
          styleClass === 'left'
            ? isLarge
              ? 'translate(-120%, -50%) scale(0.52)'
              : 'translate(-100%, -50%) scale(0.5)'
            : isLarge
            ? 'translate(20%, -50%) scale(0.52)'
            : 'translate(0%, -50%) scale(0.5)';

        return {
          ...baseStyles,
          transform,
          opacity: 0.3,
          filter: 'blur(1px)',
          zIndex: 5,
        };
      }
      case 'far':
        return {
          ...baseStyles,
          transform: 'translate(-50%, -50%) scale(0.5)',
          opacity: 0,
          zIndex: 1,
          visibility: 'hidden',
        };

      default:
        return baseStyles;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentRepo = repos[currentIndex];
      if (!currentRepo) return;

<<<<<<< Updated upstream
      if(e.key === "ArrowLeft"){
        handleSwipeLeft(currentRepo);
      } else if(e.key === "ArrowRight"){
=======
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        handleSwipeLeft(currentRepo);
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
>>>>>>> Stashed changes
        handleSwipeRight(currentRepo);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [repos, currentIndex]);

  // Show loading state when fetching new batch
  if (isLoadingNewBatch) {
    return (
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
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Finding new repositories for you...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <CssBaseline />
      {loading && (
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
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading recommendations...
          </Typography>
        </Box>
      )}
      
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
        <Chat />
        {!loading && repos.length > 0 && (
          <Box 
            className="carousel-container"
            sx={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: "700px", 
              mt: 2,
              display: "flex",
              justifyContent: 'center',
              alignItems: "center",
            }}
          >
            {repos.map((repo, i) => {
              let styleClass = 'far';
              if (i === currentIndex) {
                styleClass = 'active';
              } else if (i === currentIndex - 1) {
                styleClass = 'left';
              } else if (i === currentIndex + 1) {
                styleClass = 'right';
              }

              if (styleClass === 'far') return null;

              return (
                <Box
                  key={`${repo.id}-${currentIndex}`} // Add currentIndex to force re-render
                  sx={getCardStyles(styleClass)}
                >
                  <RepoCard
                    repo={repo}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    confidence={confidenceScores[i] || 0}
                  />
                </Box>
              );
            })}
          </Box>
        )}

        {!loading && repos.length === 0 && (
          <Typography variant="h6">
            No more recommendations available at the moment.
          </Typography>
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
            <CritiqueChips 
              onSelect={handleCritiqueSelect} 
              handleClose={() => setShowFeedbackModal(false)}
            />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default DiscoveryPage;