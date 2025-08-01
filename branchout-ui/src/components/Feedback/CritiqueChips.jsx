import React, { useState } from "react";
import { Chip, Box, Typography } from "@mui/material";

const CritiqueChips = ({ onSelect, handleClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const options = [
    { label: "Not Interested", value: "NOTINTERESTED" },
    { label: "Misleading", value: "MISLEADING" },
    { label: "Too Complex", value: "TOOCOMPLEX" },
    { label: "Too Easy", value: "TOOEASY" },
  ];

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        mt: 2,
        position: "relative",
      }}
    >
      {/* Close Button */}
      <Box
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: -50,
          right: -20,
          cursor: "pointer",
          fontSize: "1.4rem",
          fontWeight: "bold",
          color: "#aaa",
          zIndex: 10,
          "&:hover": { color: "#fff" },
        }}
      >
        ×
      </Box>

      <Typography variant="subtitle1" sx={{ mb: 1, textAlign:"center" }}>
        Why did you dislike this repository?
      </Typography>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", width:"250px", justifyContent:"center", margin:"0 auto", mt:2
       }}>
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            clickable
            onClick={() => onSelect(option.value)}
            sx = {{
                borderRadius:"5px"
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CritiqueChips;
