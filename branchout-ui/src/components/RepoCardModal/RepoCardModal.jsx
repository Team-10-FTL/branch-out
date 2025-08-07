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
          left: '50%',
          transform: 'translate(-50%, -50%)',
          [theme.breakpoints.up(850)]: {
            left: '53%',
          },
          width:{
            xs:"95vw",
            sm:"90vw",
            md:500
          },
          marginRight:{
            xs:"5vw",
            sm:"10vw"
          },
          maxWidth:"500px",
          maxHeight:"80vh",
          overflow:"auto",
          bgcolor:theme.palette.background.paper,
          border:"1px solid #979796",
          color: theme.palette.text.primary,
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
            color:theme.palette.text.primary,
            zIndex:10,
            '&:hover': {
              color:theme.palette.text.primary,
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

          <Typography variant="h5" sx={{ color:theme.palette.text.primary, fontWeight: 500, mb: 1, px:1, textAlign:"center" }}>
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
            color:theme.palette.text.primary,
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
            <Typography component="span" sx={{ color:theme.palette.text.primary, fontWeight: 600, textAlign:"center" }}>
              by {repo.owner || "Unknown Owner"}
            </Typography>

            <Typography component="span" sx={{ mx: 1, color:theme.palette.text.primary, display: {xs:"none", sm:"inline"} }}>| |</Typography>

            <Typography component="span" sx={{ color:theme.palette.text.primary, fontWeight: 600  }}>
              ☆ {repo.stars || "N/A"}
            </Typography>

            <Typography component="span" sx={{ mx: 1, color:theme.palette.text.primary, display: {xs:"none", sm:"inline"} }}>| |</Typography>

            <Link href={repo.repoLink} target="_blank" underline="always" sx={{ color: "#e37106", fontWeight: 600 }}>
              View Repository
            </Link>
          </Box>


          {/* Description */}
          <Box sx={{ width: "100%", textAlign: "left" }}>
          <Typography variant="subtitle1" sx={{ color:theme.palette.text.primary, fontWeight: 600, mb: 1, alignItems:"left !important"}}>
            Description
          </Typography>
          </Box>
        <Typography variant="body2" sx={{ color:theme.palette.text.primary, mb: 2}}>
          {repo.description || "No description available"}
        </Typography>

          {/* Summary */}
          <Box sx={{ width: "100%", textAlign: "left" }}>
            <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1, alignItems: "left !important" }}>
              Summary
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 2 }}>
            {repo.summary|| "No summary available"}
          </Typography>
        
          <Box sx={{ width: '100%', height: '1px', backgroundColor: theme.palette.background.default, opacity: 0.3}} />

        {/* Topics */}
        {repo.topics?.length > 0 && (
          <>
            <Box sx={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1" sx={{ color:theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
              Topics
            </Typography>
              {repo.topics.map((topic) => (
                <Chip
                  key={topic}
                  label={topic}
                  variant="outlined"
                  sx={{
                    m: 0.2,
                    color:theme.palette.text.primary,
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
              <Typography variant="subtitle1" sx={{ color:theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
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
                    color:theme.palette.text.primary,
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
              <Typography variant="subtitle1" sx={{ color:theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
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
                    color:theme.palette.text.primary,
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
          <Typography variant="subtitle1" sx={{ color:theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
            Level
          </Typography>
          {/* Stars & Level */}
          <Chip
            label={repo.skill || "Unknown"}
            // variant="outlined"
            sx={{
              color:theme.palette.background.default,
              backgroundColor: theme.palette.text.secondary,
              border: 'n',
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
