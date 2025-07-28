import { useState, useRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Box, Chip } from "@mui/material";
import "./RepoCard.css";
import RepoCardModal from "../RepoCardModal/RepoCardModal";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

export default function RepoCard({ repo, onSwipeLeft, onSwipeRight }) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const cardRef = useRef(null);
  const handleClose = () => setOpen(false);
  const handleCardClick = () => {
    setOpen(true);
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    setCurrentX(deltaX);
    
    // Apply transform to card for visual feedback - ONLY slide, no rotation
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${deltaX}px)`;
      cardRef.current.style.opacity = Math.max(0.5, 1 - Math.abs(deltaX) / 300);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const threshold = 100;

    if (Math.abs(currentX) > threshold) {
      if (currentX > 0) {
        onSwipeRight?.(repo);
      } else {
        onSwipeLeft?.(repo);
      }
    }
    
    // Reset card position - ONLY reset translation, no rotation
    if (cardRef.current) {
      cardRef.current.style.transform = "translateX(0)";
      cardRef.current.style.opacity = "1";
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
    
    // Apply transform to card for visual feedback - ONLY slide, no rotation
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${deltaX}px)`;
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

    // Reset card position - ONLY reset translation, no rotation
    if (cardRef.current) {
      cardRef.current.style.transform = "translateX(0)";
      cardRef.current.style.opacity = "1";
    }

    setIsDragging(false);
    setCurrentX(0);
    setStartX(0);
  };

  // Click handlers for indicators
  const handleLeftClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onSwipeLeft?.(repo);
  };

  const handleRightClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onSwipeRight?.(repo);
  };

  return (
    <Box
      sx={{
        position: "relative",
        userSelect: "none",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <RepoCardModal open={open} handleClose={handleClose} repo={repo} />
      <Card
        ref={cardRef}
        sx={{
          maxWidth: 400,
          borderRadius: 3, 
          boxShadow: 6,   
          overflow: "hidden",
          transition: isDragging
            ? "none"
            : "transform 0.3s cubic-bezier(.4,2,.6,1), opacity 0.3s",
          touchAction: "none",
          background: "#111", 
          color: "#fff",
          "&:hover": {
            background: "#111", 
            boxShadow: "0 0 24px 4px rgba(232,63,37,0.10)", 
            transform: "scale(1.015)",          
          },
          cursor: "grab",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="repo-card"
      >
        <CardActionArea>
            <Card sx={{ borderRadius: 3, overflow: "hidden", backgroundColor: (theme) => theme.palette.background.default, boxShadow: 3}}>
            <Box sx={{ position: "relative", height: 280, borderRadius: 2, overflow: "hidden" }}>
              {/* Background Image */}
              <CardMedia
                component="img"
                src={`src/assets/LangImages/${repo.languages[0]}.png`}
                alt={repo.name ? `Image of ${repo.name}` : "Repository image"}
                onError={(e) => {
                  e.target.onerror = null; // Prevents infinite loop if fallback also fails
                  e.target.src = 'https://avatars.githubusercontent.com/u/31138227?v=4'; // Default fallback image URL
                }}
                sx={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  transition: "transform 0.2s",
                  cursor: "pointer",
                }}
                onClick={handleCardClick}
              />

              {/* Gradient Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "65%",
                  background: (theme) =>
                    `linear-gradient(to top, ${theme.palette.background.paper}, rgba(250,250,250,0))`,
                  
                }}
              />

              {/* Text Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 12,
                  left: 16,
                  right: 16,
                  color: "#fff",
                  zIndex: 2,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                  {repo.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#ddd", mt: 0.5 }}>
                ☆ {repo.stars || "N/A"}
                </Typography>
              </Box>
            </Box>

            <CardContent  sx={{ padding: 2 }}>
            {/* <Typography gutterBottom variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            {repo.name}
            </Typography> */}
              <div className="repo-card-labels">
                <div className="repo-card-tags">
                  <AutoFixHighIcon sx = {{width:"20px", paddingTop:"5px"}}/>
                  {repo.tags?.map((tag) => (
                    <Chip
                      size="small"  
                      key={tag}
                      label={tag}
                      variant="outlined"
                      sx={{ 
                        margin: "2px",
                        borderRadius: "10px", 
                      }}
                    />
                  ))}
                </div>
                <div className="repo-card-rating">
                </div>
              </div>
              <Typography variant="h6">
                {repo.summaryTitle}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <AutoFixHighIcon sx = {{width:"20px"}}/>
                { repo.summary || "No summary available"}
              </Typography>
              <div className="repo-card-languages">
                  <AutoFixHighIcon sx = {{width:"20px", paddingBottom:"5px"}}/>
                  {repo.languages?.map((language) => (
                    <Chip
                      size="small" 
                      key={language}
                      label={language}
                      variant="filled" 
                      sx={{ 
                        margin: "2px",
                        borderRadius: "10px",
                        borderColor: "#90caf9",
                      }}
                    />
                  ))}
                </div>
            </CardContent>
          </Card>
        </CardActionArea>
      </Card>

      {/* Visual indicators - show on hover OR when dragging */}
      {(isHovered || isDragging) && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
              color: "#E34714",
              fontSize: "24px",
              opacity: isDragging ? (currentX < -50 ? 1 : 0.3) : 1,
              transition: "opacity 0.2s",
              cursor: "pointer",
              zIndex: 1000,
              "&:hover": {
                opacity: 1,
                transform: "translateY(-50%) scale(1.2)",
              },
            }}
            onClick={handleLeftClick}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <CancelIcon fontSize="large" />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              color: "green",
              fontSize: "24px",
              opacity: isDragging ? (currentX > 50 ? 1 : 0.3) : 1,
              transition: "opacity 0.2s",
              cursor: "pointer",
              zIndex: 1000,
              "&:hover": {
                opacity: 1,
                transform: "translateY(-50%) scale(1.2)",
              },
            }}
            onClick={handleRightClick}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <CheckCircleIcon fontSize="large" />
          </Box>
        </>
      )}
    </Box>
  );
}
