import { useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box, Chip } from '@mui/material'; // Add Chip here
import './RepoCard.css'; // Add this import

export default function RepoCard({ repo, onSwipeLeft, onSwipeRight }) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    setCurrentX(deltaX);
    
    // Apply transform to card for visual feedback
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
      cardRef.current.style.opacity = Math.max(0.5, 1 - Math.abs(deltaX) / 300);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const threshold = 100; // Minimum distance for swipe
    
    if (Math.abs(currentX) > threshold) {
      if (currentX > 0) {
        // Swipe right
        onSwipeRight?.(repo);
      } else {
        // Swipe left
        onSwipeLeft?.(repo);
      }
    }
    
    // Reset card position
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
      cardRef.current.style.opacity = '1';
    }
    
    setIsDragging(false);
    setCurrentX(0);
    setStartX(0);
  };

  // Mouse events for desktop
  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const deltaX = currentX - startX;
    setCurrentX(deltaX);
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
      cardRef.current.style.opacity = Math.max(0.5, 1 - Math.abs(deltaX) / 300);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    
    if (Math.abs(currentX) > threshold) {
      if (currentX > 0) {
        onSwipeRight?.(repo);
      } else {
        onSwipeLeft?.(repo);
      }
    }
    
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
      cardRef.current.style.opacity = '1';
    }
    
    setIsDragging(false);
    setCurrentX(0);
    setStartX(0);
  };

  // Click handlers for indicators
  const handleLeftClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Left click triggered');
    onSwipeLeft?.(repo);
  };

  const handleRightClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Right click triggered');
    onSwipeRight?.(repo);
  };

  return (
    <Box 
      sx={{ 
        position: 'relative',
        userSelect: 'none',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        ref={cardRef}
        sx={{ 
          maxWidth: 345,
          transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
          touchAction: 'none'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className='repo-card'
      >
        <CardActionArea>
          <Typography gutterBottom variant="h5" component="div">
            {repo.name}
          </Typography>
          <CardMedia
            component="img"
            height="140"
            image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
            alt="green iguana"
          />
          <CardContent>
            <div className='repo-card-labels'>
                <div className='repo-card-tags'>
                    {repo.tags?.map((tag, index) => (
                        <Chip 
                        key={index} 
                        label={tag} 
                        variant="outlined" 
                        sx={{ margin: '2px' }} 
                        />
                    ))}
                </div>
                <div className = "repo-card-rating">
                <Typography variant="body2" color="text.secondary">
                    Rating: {repo.rating || 'N/A'}
                </Typography>
                </div>
            </div>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {repo.description || "No description available"}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      
      {/* Visual indicators - show on hover OR when dragging */}
      {(isHovered || isDragging) && (
        <>
          <Box 
            sx={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)',
              color: 'red',
              fontSize: '24px',
              opacity: isDragging ? (currentX < -50 ? 1 : 0.3) : 1,
              transition: 'opacity 0.2s',
              cursor: 'pointer',
              zIndex: 1000,
              '&:hover': {
                opacity: 1,
                transform: 'translateY(-50%) scale(1.2)'
              }
            }}
            onClick={handleLeftClick}
            onMouseDown={(e) => e.stopPropagation()}
          >
            ←
          </Box>
          <Box 
            sx={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              color: 'green',
              fontSize: '24px',
              opacity: isDragging ? (currentX > 50 ? 1 : 0.3) : 1,
              transition: 'opacity 0.2s',
              cursor: 'pointer',
              zIndex: 1000,
              '&:hover': {
                opacity: 1,
                transform: 'translateY(-50%) scale(1.2)'
              }
            }}
            onClick={handleRightClick}
            onMouseDown={(e) => e.stopPropagation()}
          >
            →
          </Box>
        </>
      )}
    </Box>
  );
}