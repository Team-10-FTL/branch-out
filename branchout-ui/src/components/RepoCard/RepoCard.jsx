import { useState, useRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Box, Chip, useMediaQuery } from "@mui/material";
import "./RepoCard.css";
import RepoCardModal from "../RepoCardModal/RepoCardModal";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useTheme } from "@mui/material/styles";


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

  // function that makes the summary only show 50 words of the whole thing.
  const truncateSummary = (text, wordLimit = 50) => { 
    if (!text) return "No summary available";

    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(" ") + "...";
  };
  
  const FloatingIcon = ({ sx }) => (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        opacity: 0.7,
        zIndex: 10,
        p: 0.5,
        ...sx
      }}
    >
      <AutoAwesomeIcon sx={{ fontSize: { xs: 18, md: 22 }, color: '#DAA7E2' }} />
    </Box>
  );

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
          background: theme.palette.background.paper, 
          color: theme.palette.text.primary,
          "&:hover": {
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
                  color: theme.palette.text.primary,
                  zIndex: 2,
                }}
              >
                <Typography variant= {isSmall ? "h6": "h5"} sx={{ fontWeight: 700, letterSpacing: 1, fontSize:{xs:"1.1rem", sm:"1.3rem", md:"1.5rem"}}}>
                  {repo.name}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.primary, mt: 0.5, fontSize:{xs:".8rem", md:".875rem"} }}>
                ☆ {repo.stars || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.primary, mt: 0.5, fontSize:{xs:".8rem", md:".875rem"} }}>
                  {confidence ? `Confidence: ${Math.round(confidence.toFixed(2)*100)}%` : "Confidence: N/A"}
                </Typography>
              </Box>
            </Box>

            <CardContent  sx={{ padding: {xs:1, md:1.5, display:"flex", flexDirection:"column", overflow:"hidden"}}}>
              <div className="repo-card-labels">
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Related Tags:
                </Typography>
                <div className="repo-card-tags">
                  {/* <FloatingIcon/> */}
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
                          xs:".5rem",
                          md:".7rem"
                        }
                      }}
                    />
                  ))}
                </div>
              </Box>
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
              <Box sx={{ position: 'relative', mb: 2 }}>
              {repo.summaryTitle}
                {/* <FloatingIcon /> */}
              </Box>
              </Typography>
              <Typography variant="body2"
                sx={{ 
                color: theme.palette.text.primary,
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
              <Box sx={{ position: 'relative', mb: 1 }}>
                {/* <span>{ repo.summary || "No summary available"}</span> */}
              <Box sx={{ mb: 2 }}>
                <span> {truncateSummary(repo.summary)} </span>
                <span style={{ color: '#DAA7E2', fontWeight: 'bold', marginLeft: '4px', opacity: 0.8 }}>Read More</span>
              </Box>
              </Box>

              </Typography>
              <Box className="repo-card-languages" sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Languages Used:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <FloatingIcon />
                  {repo.languages?.map((language) => (
                    <Chip
                      size={isSmall ? "small" : "medium"}
                      key={language}
                      label={language}
                      variant="filled"
                      sx={{
                        margin: "2px",
                        borderRadius: "10px",
                        fontSize: { xs: '0.7rem', md: '0.8125rem' }
                      }}
                    />
                  ))}
                </Box>
              </Box>

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
              fontSize: {
                xs: "20px",
                md: "24px"
              },
              opacity: isDragging ? (currentX < -50 ? 1 : 0.3) : 1,
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
            onClick={handleLeftClick}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <CancelIcon fontSize={isMobile ? "medium" : "large"}/>
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              right: {
                xs: "-20px",
                md: "24px"
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
