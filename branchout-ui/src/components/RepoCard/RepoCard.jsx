import { useState, useRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Box, Chip, useTheme, useMediaQuery } from "@mui/material";
import "./RepoCard.css";
import RepoCardModal from "../RepoCardModal/RepoCardModal";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

export default function RepoCard({ repo, confidence , onSwipeLeft, onSwipeRight }) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const cardRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

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

    const threshold = isMobile ? 80 : 100;

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
    if (!isDragging || isMobile) return;

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
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <RepoCardModal open={open} handleClose={handleClose} repo={repo} />
      <Card
        ref={cardRef}
        sx={{
          maxWidth: {
            xs:"90vw",
            sm:"80vw",
            md:400
          },
          width:{
            xs:"100%",
            md:400
          },
          borderRadius: 3, 
          height: {
            xs:"70vh",
            sm:"75vh",
            md:"800px"
          },
          height:{
            xs:"70vh",
            sm:"75vh",
            md:"800px"
          },
          minHeight:{
            xs:500,
            md:800
          },
          display:"flex",
          flexDirection:"column",  
          overflow: "hidden",
          boxShadow: `
            inset 0 0 1px rgba(9, 1, 1, 0.70),
            0 0 10px 3px rgba(98, 90, 100, 0.46)
          `,
          transition: isDragging
            ? "none"
            : "transform 0.3s cubic-bezier(.4,2,.6,1), opacity 0.3s",
          touchAction: "pan-y",
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
        <CardActionArea sx = {{flexGrow:1, display:"flex", flexDirection:"column", overflow:"hidden"}}>
            <Box sx={{ position: "relative", width: "100%",height: {xs:200, sm:240, md:280}, overflow: "hidden" }}               
            onClick={handleCardClick}>
              {/* Background Image */}
              <CardMedia
                component="img"
                src={`LangImages/${repo.languages[0]}.png`}
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
                  bottom: {
                    xs:8,
                    md:12
                  },
                  left: {
                    xs:12,
                    md:16
                  },
                  right: {
                    xs:12,
                    md:16
                  },
                  color: "#fff",
                  zIndex: 2,
                }}
              >
                <Typography variant= {isSmall ? "h6": "h5"} sx={{ fontWeight: 700, letterSpacing: 1, fontSize:{xs:"1.1rem", sm:"1.3rem", md:"1.5rem"}}}>
                  {repo.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#ddd", mt: 0.5, fontSize:{xs:".8rem", md:".875rem"} }}>
                ☆ {repo.stars || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#ddd", mt: 0.5, fontSize:{xs:".8rem", md:".875rem"} }}>
                  {confidence ? `Confidence: ${confidence.toFixed(2)*100}%` : "Confidence: N/A"}
                </Typography>
              </Box>
            </Box>

            <CardContent  sx={{ padding: {xs:1, md:1.5, display:"flex", flexDirection:"column", overflow:"hidden"}}}>
            {/* <Typography gutterBottom variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            {repo.name}
            </Typography> */}
              <div className="repo-card-labels">
                <div className="repo-card-tags">
                  <AutoFixHighIcon sx = {{width:{xs:"16px", md:"20px"}, paddingTop:"5px", maxHeight: 'calc(600px - 280px)' }}/>
                  {repo.tags?.map((tag) => (
                    <Chip
                      size={isSmall ? "small": "medium"}
                      key={tag}
                      label={tag}
                      variant="outlined"
                      sx={{ 
                        margin: "2px",
                        borderRadius: "10px", 
                        fontSize:{
                          xs:".7rem",
                          md:".82rem"
                        }
                      }}
                    />
                  ))}
                </div>
                <div className="repo-card-rating">
                </div>
              </div>
              <Typography variant= {isSmall ? "subtitle1":"h6"}
                sx={{
                fontSize: {
                  xs: '1rem',
                  md: '1.25rem'
                },
                fontWeight: 600,
                lineHeight: 1.2,
                // Add these 3 lines:
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
              >
              {repo.summaryTitle}
              </Typography>
              <Typography variant="body2"
                sx={{ 
                color: "text.secondary",
                fontSize: {
                  xs: '0.6rem',
                  md: '0.7rem'
                },
                lineHeight: 1.4,
                alignItems: 'flex-start',
                gap: 0.5,
                flexGrow: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp:{
                  xs:11,
                  md:20
                },
                WebkitBoxOrient:"vertical"
              }}
              >
                <AutoFixHighIcon 
                  sx={{
                  width: {
                    xs: "14px",
                    md: "20px"
                  },
                  flexShrink: 0,
                  mt: 0.1
                }}
                />
                <span>{ repo.summary || "No summary available"}</span>
              </Typography>
              <div className="repo-card-languages" style = {{marginTop:"auto"}}>
                  <AutoFixHighIcon 
                    sx={{
                    width: {
                      xs: "16px",
                      md: "20px"
                    },
                    paddingBottom: "5px"
                  }}
                  />
                  {repo.languages?.map((language) => (
                    <Chip
                      size={isSmall ? "small": "medium"}
                      key={language}
                      label={language}
                      variant="filled" 
                      sx={{ 
                        margin: "2px",
                        borderRadius: "10px",
                        borderColor: "#90caf9",
                        fontSize: {
                          xs: '0.7rem',
                          md: '0.8125rem'
                        }
                      }}
                    />
                  ))}
                </div>
            </CardContent>
        </CardActionArea>
      </Card>

      {/* Visual indicators - show on hover OR when dragging */}
      {(isHovered || isDragging) && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: {
                xs:"20px",
                md:"24px"
              },
              transform: "translateY(-50%)",
              color: "#E34714",
              opacity: isDragging ? (currentX < -50 ? 1 : 0.3) : 1,
              transition: "opacity 0.2s",
              cursor: "pointer",
              zIndex: 1000,
              fontSize: "24px",
              "&:hover": {
                  opacity: 1,
                  transform: isMobile 
                    ? "translateY(-50%)" 
                    : "translateY(-50%) scale(1.2)",
              },
            }}
            onClick={handleLeftClick}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <CancelIcon fontSize="large" />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              right: {
                xs: "5px",
                md: "10px"
              },
              transform: "translateY(-50%)",
              color: "green",
              fontSize: {
                xs: "20px",
                md: "24px"
              },
              opacity: isDragging ? (currentX > 50 ? 1 : 0.3) : 1,
              transition: "opacity 0.2s",
              cursor: "pointer",
              zIndex: 1000,
              "&:hover": {
                opacity: 1,
                transform: isMobile 
                  ? "translateY(-50%)" 
                  : "translateY(-50%) scale(1.2)",
              },
            }}
            onClick={handleRightClick}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
          <CheckCircleIcon fontSize={isMobile ? "medium" : "large"} />
          </Box>
        </>
      )}
    </Box>
  );
}
