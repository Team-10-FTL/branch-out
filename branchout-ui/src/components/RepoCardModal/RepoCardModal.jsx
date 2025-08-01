import React from "react";
import { Modal, Box, Typography, CardMedia, Chip, Fade, Link, useTheme, useMediaQuery } from "@mui/material";

export default function RepoCardModal({ open, handleClose, repo }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // <960px
  const isSmall = useMediaQuery(theme.breakpoints.down('sm')); // <600px

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="repo-modal-title"
      aria-describedby="repo-modal-description"
      closeAfterTransition
      sx={{ backdropFilter: 'blur(6px)' }}
    >
      <Fade in={open} timeout={300}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '58%',
          transform: 'translate(-50%, -50%)',
          width:{
            xs:"95vw",
            sm:"90vw",
            md:500
          },
          maxWidth:"500px",
          maxHeight:"90vh",
          overflow:"auto",
          // bgcolor: theme.palette.background.paper,
          bgcolor:"#d6d6d5",
          border:"1px solid #979796",
          color: '#fff',
          borderRadius: '10px',
          p: {
            xs:2,
            sm:3,
            md:4
          },
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign:"left",
        }}>
          <Box
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: {
              xs:8,
              md:12
            },
            right: {
              xs:8,
              md:12
            },
            cursor: 'pointer',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            color: '#aaa',
            zIndex:10,
            '&:hover': {
              color: '#fff',
            }
          }}
        >
          ×
        </Box>
          {/* Image */}
          <CardMedia
            component="img"
            height="200"
            image={`LangImages/${repo.languages[0]}.png`}
            alt={repo.name || "Repository image"}
            sx={{
              width: {
                xs:"120px",
                sm:"150px",
                md:"200px",
              },
              objectFit: 'contain',
              borderRadius: '15px',
              mb: 2,
            }}
          />

          <Typography variant="h5" sx={{ color: "black", fontWeight: 500, mb: 1, px:1, textAlign:"center" }}>
            {repo.name}
          </Typography>


          <Box sx={{
            display: 'flex',
            flexDirection:{
              xs:"column",
              sm:"row"
            },
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'black',
            fontWeight: 500,
            fontSize: {
              xs:".85rem",
              md:".95rem"
            },
            borderTop: 1,
            borderTopColor: '#444',
            borderBottom: 1,
            borderBottomColor: '#444',
            mb: 2,
            gap: 1,
            width:"100%"
          }}>
            <Typography component="span" sx={{ color: "black", fontWeight: 600 }}>
              by {repo.owner || "Unknown Owner"}
            </Typography>

            <Typography component="span" sx={{ mx: 1, color: "#666" }}>| |</Typography>

            <Typography component="span" sx={{ color: "black", fontWeight: 600  }}>
              ☆ {repo.stars || "N/A"}
            </Typography>

            <Typography component="span" sx={{ mx: 1, color: "#666" }}>| |</Typography>

            <Link href={repo.repoLink} target="_blank" underline="always" sx={{ color: "black", fontWeight: 600 }}>
              View Repository
            </Link>
          </Box>


          {/* Description */}
          <Box sx={{ width: "100%", textAlign: "left" }}>
          <Typography variant="subtitle1" sx={{ color: "black", fontWeight: 600, mb: 1, alignItems:"left !important"}}>
            Description
          </Typography>
          </Box>
        <Typography variant="body2" sx={{ color: "#fff", mb: 2}}>
          {repo.description || "No description available"}
        </Typography>
        
          <Box sx={{ width: '100%', height: '1px', backgroundColor: '#444', opacity: 0.3}} />

        {/* Topics */}
        {repo.topics?.length > 0 && (
          <>
              <Typography variant="subtitle1" sx={{ color: "black", fontWeight: 600, mb: 1 }}>
              Topics
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
              {repo.topics.map((topic) => (
                <Chip
                  key={topic}
                  label={topic}
                  variant="outlined"
                  sx={{
                    m: 0.2,
                    color: "#fff",
                    borderColor: "black",
                    borderWidth: "2px",
                    backgroundColor: "transparent",
                    borderRadius: "12px",
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          </>
        )}

        <Box sx={{ width: '100%', height: '1px', backgroundColor: '#444', opacity: 0.3 }} />


        {/* Tags */}
        {repo.tags?.length > 0 && (
          <>
            <Box sx={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1" sx={{ color: "black", fontWeight: 600, mb: 1 }}>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
              {repo.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant="outlined"
                  sx={{
                    m: 0.2,
                    color: "#fff",
                    borderColor: "#E37106",
                    borderWidth: "2px",
                    backgroundColor: "transparent",
                    borderRadius: "12px",
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
            </Box>
          </>
        )}

          <Box sx={{ width: '100%', height: '1px', backgroundColor: '#444', opacity: 0.3 }} />


        {/* Languages */}
        {repo.languages?.length > 0 && (
          <>
            <Box sx={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1" sx={{ color: "black", fontWeight: 600, mb: 1 }}>
              Languages
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2}}>
              {repo.languages.map((language) => (
                <Chip
                  key={language}
                  label={language}
                  variant="outlined"
                  sx={{
                    m: 0.2,
                    color: "#fff",
                    borderColor: "#E37106",
                    borderWidth: "2px",
                    backgroundColor: "transparent",
                    borderRadius: "12px",
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
            </Box>
          </>
        )}
        <Box sx={{ width: "100%", textAlign: "left" }}>
          <Typography variant="subtitle1" sx={{ color: "black", fontWeight: 600, mb: 1 }}>
            Level
          </Typography>
          {/* Stars & Level */}
          <Chip
            label={repo.skill || "Unknown"}
            // variant="outlined"
            sx={{
              color: "#fff",
              backgroundColor: '#2E2E2E',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 500,
              px: 2,
              py: 0.5,
            }}
          />
        </Box>
      </Box>
    </Fade>
    </Modal >
  );
}
