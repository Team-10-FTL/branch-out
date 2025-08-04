import { useState, useEffect } from 'react';
import RepoCard from '../../components/RepoCard/RepoCard';
import CritiqueChips from '../../components/Feedback/CritiqueChips';
import Chat from '../../components/ChatBox/Chat.jsx';
import { Box, CssBaseline, Modal, Fade, useMediaQuery, useTheme } from '@mui/material';
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
  const { getToken } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // <600px
  const isLarge = useMediaQuery('(min-width:1130px)'); // custom breakpoint

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
        setConfidenceScores(response.data.confidence || []);
      } catch (err) {
        setLoading(false);
        console.log("Error:", err)
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
      setConfidenceScores(response.data.confidence || []);
    } catch (err) {
      setLoading(false);
      console.log("Error:", err)
    }
    setLoading(false);
  };

  const handleSwipeLeft = (repo) => {
    console.log("Left swipe triggered")
    setSelectedRepo(repo);
    setShowFeedbackModal(true);
  };

  const handleSwipeRight = async (repo) => {
    console.log("Right swipe triggered")
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
    case 'right':{
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

      if(e.key === "ArrowLeft" || e.key.toLowerCase() === "a"){
        handleSwipeLeft(currentRepo);
      } else if(e.key === "ArrowRight" || e.key.toLowerCase() === "d"){
        handleSwipeRight(currentRepo);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return() => window.removeEventListener("keydown", handleKeyDown);
  }, [repos, currentIndex]);

  return (
    <>
      <CssBaseline />
        {loading && <p>Loading recommendations...</p>}
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
        <Chat></Chat>
        {!loading && repos.length > 0 && (
          <Box 
            className = "carousel-container"
            sx={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth:"700px", 
            mt:2,
            display:"flex",
            justifyContent: 'center',
            alignItems:"center",
            }}>
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
                  key={repo.id}
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
            
            <CritiqueChips onSelect={handleCritiqueSelect} handleClose={() => setShowFeedbackModal(false)}/>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default DiscoveryPage;