// Example usage in your parent component
import { useState } from 'react';
import RepoCard from '../components/RepoCard/RepoCard';

export function DiscoveryPage() {
  const [repos, setRepos] = useState([
    { id: 1, name: 'Repo 1', description: 'First repository' },
    { id: 2, name: 'Repo 2', description: 'Second repository' },
    { id: 3, name: 'Repo 3', description: 'Third repository' },
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

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      {repos.length > 0 && (
        <RepoCard
          repo={repos[currentIndex]}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      )}
    </div>
  );
}