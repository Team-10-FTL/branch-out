// components/CritiqueChips.jsx
import React from "react";
import { Chip, Box, Typography } from "@mui/material";

const CritiqueChips = ({ onSelect }) => {
const options = [
    { label: "Not Interested", value: "NOTINTERESTED" },
    { label: "Misleading", value: "MISLEADING" },
    { label: "Too Complex", value: "TOOCOMPLEX" },
    { label: "Too Easy", value: "TOOEASY" }
];

return (
    <Box sx={{ mt: 2 }}>
    <Typography variant="subtitle1">Why did you dislike this repository?</Typography>
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
        {options.map((option) => (
        <Chip
            key={option.value}
            label={option.label}
            clickable
            onClick={() => onSelect(option.value)}
        />
        ))}
    </Box>
    </Box>
);
};

export default CritiqueChips;
