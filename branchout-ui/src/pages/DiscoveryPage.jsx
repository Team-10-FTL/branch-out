// Example usage in your parent component
import { useState } from 'react';
import RepoCard from '../components/RepoCard/RepoCard';
import { Box, CssBaseline } from '@mui/material';

const DiscoveryPage = () => {
  const [repos, setRepos] = useState([
    { id: 1, name: 'Repo 1', description: 'First repository', tags: ['Machine Learning', 'React'], rating: 4.5 },
    { id: 2, name: 'Repo 2', description: 'Second repository', tags: ['MCP', "Android Development", 'Java'] , rating: 2000},
    { id: 3, name: 'Repo 3', description: 'Third repository', tags: ['Web Development', 'Node.js'], rating: 4600 },
  ]);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipeLeft = (repo) => {
    console.log('Swiped left on:', repo.name);
    // Move to next card
    setCurrentIndex(prev => (prev + 1) % repos.length);
  };

  const handleSwipeRight = (repo) => {
    console.log('Swiped right on:', repo.name);
    // Move to next card
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
    </Box>
  );
}

export default DiscoveryPage;