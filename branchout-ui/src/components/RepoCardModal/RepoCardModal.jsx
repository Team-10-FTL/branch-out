import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, CardMedia, Chip } from "@mui/material";

const style = {
  position: 'absolute',
  textAlign: "center",
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#111',
  color: '#fff',
  border: '2px solid transparent', // <-- Transparent border to maintain shape
  borderRadius: '20px',
  boxShadow: '0 0 30px 6px rgba(232,63,37,0.5)', // <-- Stronger glow effect
  p: 4,
  marginLeft: '130px', // <-- set to your sidebar width

};

export default function RepoCardModal({ open, handleClose , repo}) {

  return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="repo-modal-title"
        aria-describedby="repo-modal-description"
        sx={{ backdropFilter: 'blur(5px)' }}
      >
        <Box sx={style}>
          <Typography
            id="repo-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center", color: "#E83F25", fontWeight: 700, mb: 2 }}
          >
            {repo.name}
          </Typography>
          <CardMedia
            component="img"
            height="140"
            image="https://avatars.githubusercontent.com/u/583231?v=4"
            alt={repo.name ? `Image of ${repo.name}` : "Repository image"}
            sx={{
              borderRadius: "12px",
              border: "1px solid #222",
              mb: 2,
            }}
          />
          <Box id="repo-modal-rating" sx={{ mt: 2 }}>
            <span style={{ color: "#E83F25", fontWeight: 600 }}>⭐</span> {repo.stars || "N/A"}
          </Box>
          <Box id="repo-modal-tags" sx={{ mt: 2 }}>
            <span style={{ color: "#E83F25", fontWeight: 600 }}>Tags:</span>{" "}
            {repo.tags?.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                variant="outlined"
                sx={{
                  margin: '2px',
                  color: "#fff",
                  border: "1.5px solid #E83F25",
                  fontWeight: 500,
                  background: "transparent",
                  borderRadius: "10px", // <-- Change this value as you like

                }}
              />
            ))}
          </Box>
          <Box id="repo-modal-languages" sx={{ mt: 2 }}>
            <span style={{ color: "#E83F25", fontWeight: 600 }}>Languages:</span>{" "}
            {repo.languages?.map((language) => (
              <Chip
                key={language}
                label={language}
                variant="outlined"
                sx={{
                  margin: '2px',
                  color: "#fff",
                  border: "1.5px solid #E83F25",
                  fontWeight: 500,
                  background: "transparent",
                  borderRadius: "10px", // <-- Change this value as you like
                }}
              />
            ))}
          </Box>

          <Typography id="repo-modal-description" sx={{ mt: 2, color: "#fff" }}>
            <span style={{ color: "#E83F25", fontWeight: 600 }}>Description:</span> {repo.description || "No description available"}
          </Typography>
        </Box>
      </Modal>
  );
}