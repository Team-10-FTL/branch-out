import React from "react";
import { Modal, Box, Typography, CardMedia, Chip, Fade, Link, useTheme } from "@mui/material";

export default function RepoCardModal({ open, handleClose, repo }) {
  const theme = useTheme();

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
          width: 500,
          bgcolor: theme.palette.background.paper,
          color: '#fff',
          borderRadius: '20px',
          boxShadow: `
            inset 0 0 15px rgba(9, 1, 1, 0.70),
            0 0 30px 6px rgba(212, 147, 230, 0.46)
          `,
          p: 4,
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          {/* Image */}
          <CardMedia
            component="img"
            height="200"
            image={`src/assets/LangImages/${repo.languages[0]}.png`}
            alt={repo.name || "Repository image"}
            sx={{
              width: '60%',
              objectFit: 'contain',
              borderRadius: '15px',
              mb: 2,
            }}
          />

          <Typography variant="h5" sx={{ color: "#E34714", fontWeight: 700, mb: 1 }}>
            {repo.name}
          </Typography>


          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#DAA7E2',
            fontWeight: 500,
            fontSize: '0.95rem',
            borderTop: 1,
            borderTopColor: '#444',
            borderBottom: 1,
            borderBottomColor: '#444',
            mb: 2,
            gap: 1
          }}>
            <Typography component="span" sx={{ color: "#DAA7E2", fontWeight: 600 }}>
              by {repo.owner || "Unknown Owner"}
            </Typography>

            <Typography component="span" sx={{ mx: 1, color: "#666" }}>| |</Typography>

            <Typography component="span" sx={{ color: "#DAA7E2", fontWeight: 600  }}>
              ☆ {repo.stars || "N/A"}
            </Typography>

            <Typography component="span" sx={{ mx: 1, color: "#666" }}>| |</Typography>

            <Link href={repo.repoLink} target="_blank" underline="always" sx={{ color: "#DAA7E2", fontWeight: 600 }}>
              View Repository
            </Link>
          </Box>


          {/* Description */}
          <Typography variant="subtitle1" sx={{ color: "#DAA7E2", fontWeight: 600, mb: 1 }}>
            Description:
        </Typography>
        <Typography variant="body2" sx={{ color: "#fff", mb: 2 }}>
          {repo.description || "No description available"}
        </Typography>

          <Box sx={{ width: '100%', height: '1px', backgroundColor: '#444', opacity: 0.3}} />

        {/* Topics */}
        {repo.topics?.length > 0 && (
          <>
              <Typography variant="subtitle1" sx={{ color: "#DAA7E2", fontWeight: 600, mb: 1 }}>
              Topics:
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
                    borderColor: "#DAA7E2",
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
              <Typography variant="subtitle1" sx={{ color: "#DAA7E2", fontWeight: 600, mb: 1 }}>
              Tags:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
              {repo.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant="outlined"
                  sx={{
                    m: 0.2,
                    color: "#fff",
                    borderColor: "#E34714",
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


        {/* Languages */}
        {repo.languages?.length > 0 && (
          <>
              <Typography variant="subtitle1" sx={{ color: "#DAA7E2", fontWeight: 600, mb: 1 }}>
              Languages:
            </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mb: 2}}>
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
          </>
        )}

          <Typography variant="subtitle1" sx={{ color: "#DAA7E2", fontWeight: 600, mb: 1 }}>
            Level:
          </Typography>

        {/* Stars & Level */}
          <Chip
            label={repo.skill || "Unknown"}
            // variant="outlined"
            sx={{
              color: "#fff",
              backgroundColor: '#2E2E2E',  // Solid dark gray
              border: 'none',
              borderRadius: '12px',
              fontWeight: 500,
              px: 2,  // Add horizontal padding so it doesn't look cramped
              py: 0.5,  // Slight vertical padding
            }}
          />
      </Box>
    </Fade>
    </Modal >
  );
}
