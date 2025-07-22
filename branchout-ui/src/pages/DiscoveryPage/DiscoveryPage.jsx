// Example usage in your parent component
import { useState, useEffect } from 'react';
import RepoCard from '../../components/RepoCard/RepoCard';
import CritiqueChips from '../../components/Feedback/CritiqueChips';
import { Box, CssBaseline, Modal, Backdrop, Fade } from '@mui/material';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from "axios";

const DiscoveryPage = () => {

  const CRITIQUE_OPTIONS = [
    "NOTINTERESTED",
    "MISLEADING",
    "TOOCOMPLEX",
    "TOOEASY"
  ];

  const [repos, setRepos] = useState([
// { id: 1, name: 'Repo 1', description: 'First repository', tags: ['Machine Learning', 'React'], rating: 4.5 },
//  { id: 2, name: 'Repo 2', description: 'Second repository', tags: ['MCP', "Android Development", 'Java'] , rating: 2000},
//  { id: 3, name: 'Repo 3', description: 'Third repository', tags: ['Web Development', 'Node.js'], rating: 4600 },
  
]);

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

  useEffect(() => {
    axios
      .get(`${VITE_URL}/repo/`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setRepos(res.data);
        }
        setLoading(false);
      })
      .catch(() => {
        // Only set loading to false, keep sample repos
        setLoading(false);
      });
  }, []);


  const handleSwipeLeft = (repo) => {
    console.log('Swiped left on:', repo.name);
    setSelectedRepo(repo);
    setShowFeedbackModal(true); // show chips modal
  };

  const handleSwipeRight = async (repo) => {

    try {
      const token = await getToken();
      await axios.post(`${VITE_URL}/repo/swipe`, {
        userId: user?.id,  // this works for both Clerk and local
        repoId: repo.id,
        direction: "RIGHT"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
      }
    });

    console.log('Feedback submitted');
    } catch (err) {
      console.error("Swipe RIGHT failed", err);
    }

    setCurrentIndex(prev => (prev + 1) % repos.length);
  };

  const handleCritiqueSelect = async (reason) => {

    try {
      const token = await getToken();
      const payload = {
        userId: user?.id,  // this works for both Clerk and local
        repoId: selectedRepo?.id,
        direction: "LEFT",
        feedbackReason: reason
      };

      console.log("Sending swipe payload:", payload);

      await axios.post(`${VITE_URL}/repo/swipe`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Feedback submitted');
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