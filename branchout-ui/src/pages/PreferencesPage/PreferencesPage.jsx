import React, {useState, useEffect} from 'react';
import { Container, Divider, Chip, Box, Paper, Typography, Stack } from '@mui/material';
import './PreferencesPage.css';
import ToolTip from '../../components/ToolTip/ToolTip';

const LEVELS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const LEVEL_TO_ENUM = {
  "1st Year": "FIRSTYEAR",
  "2nd Year": "SECONDYEAR",
  "3rd Year": "THIRDYEAR",
  "4th Year": "FOURTHYEAR",
};
const ENUM_TO_LEVEL = {
  FIRSTYEAR: "1st Year",
  SECONDYEAR: "2nd Year",
  THIRDYEAR: "3rd Year",
  FOURTHYEAR: "4th Year",
};
const LANGUAGES = [
  "JavaScript", "Python", "Java", "C++", "Ruby", "Go", "Rust", "Swift", "Kotlin", "PHP", "TypeScript", "C#", "C", "HTML/CSS", "SQL",
];
const TAGS = [
  "Web Development", "Operating Systems", "Hardware", "Compiler Design", "AI", "Mobile", "Data Science", "Game Development", "Blockchain", "DevOps", "Cybersecurity", "Cloud Computing", "Machine Learning", "AR/VR", "IoT", "Mobile Development: Swift", "Mobile Development: Kotlin", "APIs", "Microservices",
];

function PreferencesPage() {
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const VITE_URL = import.meta.env.VITE_DATABASE_URL

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch(`${VITE_URL}/user/preferences`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSelectedLevels(
            (data.skill || [])
              .map((levelEnum) => ENUM_TO_LEVEL[levelEnum])
              .filter(Boolean)
          );
          setSelectedLanguages(data.languages || []);
          setSelectedTags(data.preferenceTags || []);
        }
      })
      .catch((error) => {
        console.log("Failed to load user preferences", error);
      });
  }, []);

  const handleToggle = (item, selectedArray, setSelectedArray) => {
    setSelectedArray((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSave = async () => {
    const preferences = {
      skill: selectedLevels.map((label) => LEVEL_TO_ENUM[label]),
      languages: selectedLanguages,
      preferenceTags: selectedTags,
    };
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${VITE_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      });
      if (res.ok) {
        console.log("Preferences saved successfully");
      }
    } catch (error) {
      console.log("Failed to save preferences, ", error);
    }
  };

  return (
    <Box sx={{ position: "relative", maxWidth: 500, mx: "auto", mt: 6 }}>
      <Paper
        className="preferences-container"
        sx={{
          background: "#111",
          color: "#fff",
          borderRadius: 4,
          boxShadow: "0 0 24px 4px rgba(232,63,37,0.10)",
          p: 4,
          position: "relative",
          transition: "box-shadow 0.3s, background 0.3s",
          "&:hover": {
            boxShadow: "0 0 32px 8px rgba(232,63,37,0.18)",
            background: "#111",
          },
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, letterSpacing: 1 }}>
          Preferences Page
        </Typography>
        <Divider className="preferences-divider" sx={{ borderColor: "#222", mb: 2 }} />

        <Typography variant="h6" sx={{ color: "#0ff", mt: 2 }}>
          Skill Level <ToolTip className="ToolTip" information={"Set your school level - think of 1st as freshman and 4th as senior! This will correlate to the level repositories you get in your feed."} />
        </Typography>
          <Stack
            direction="row"
            spacing={1}
            rowGap={1}
            flexWrap="wrap"
            className="preferences-stack"
            justifyContent="center"
            alignItems="center"
          >
            {LEVELS.map((level) => (
            <Chip
              key={level}
              label={level}
              onClick={() => handleToggle(level, selectedLevels, setSelectedLevels)}
              color={selectedLevels.includes(level) ? "secondary" : "default"}
              variant={selectedLevels.includes(level) ? "filled" : "outlined"}
              clickable
              sx={{
                background: selectedLevels.includes(level) ? "#222" : "#111",
                color: "#fff",
                border: "1px solid #0ff",
                fontWeight: 500,
                marginRight: 1,
                marginBottom: 1,
                borderRadius: "10px", // <-- Change this value as you like
              }}
            />
          ))}
        </Stack>

        <Divider sx={{ borderColor: "#222", my: 2 }} />

        <Typography variant="h6" sx={{ color: "#0ff", mt: 2 }}>
          Languages <ToolTip className="ToolTip" information={"Set any languages you know (or want to know) here"} />
        </Typography>
            <Stack
              direction="row"
              spacing={1}
              rowGap={1}
              flexWrap="wrap"
              className="preferences-stack"
              justifyContent="center"
              alignItems="center"
            >         
          {LANGUAGES.map((lang) => (
            <Chip
              key={lang}
              label={lang}
              onClick={() => handleToggle(lang, selectedLanguages, setSelectedLanguages)}
              color={selectedLanguages.includes(lang) ? "primary" : "default"}
              variant={selectedLanguages.includes(lang) ? "filled" : "outlined"}
              clickable
              sx={{
                background: selectedLanguages.includes(lang) ? "#222" : "#111",
                color: "#fff",
                border: "1px solid #0ff",
                fontWeight: 500,
                marginRight: 1,
                marginBottom: 1,
                borderRadius: "10px", // <-- Change this value as you like
              }}
            />
          ))}
        </Stack>

        <Divider sx={{ borderColor: "#222", my: 2 }} />

        <Typography variant="h6" sx={{ color: "#0ff", mt: 2 }}>
          Tags <ToolTip className="ToolTip" information={"Set any tags of topics that you know or want to know here"} />
        </Typography>
          <Stack
            direction="row"
            spacing={1}
            rowGap={1}
            flexWrap="wrap"
            className="preferences-stack"
            justifyContent="center"
            alignItems="center"
          > 
         {TAGS.map(tag => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => handleToggle(tag, selectedTags, setSelectedTags)}
              color={selectedTags.includes(tag) ? "success" : "default"}
              variant={selectedTags.includes(tag) ? "filled" : "outlined"}
              clickable
              sx={{
                background: selectedTags.includes(tag) ? "#222" : "#111",
                color: "#fff",
                border: "1px solid #0ff",
                fontWeight: 500,
                marginRight: 1,
                marginBottom: 1,
                borderRadius: "10px", // <-- Change this value as you like
              }}
            />
          ))}
        </Stack>

        <Divider sx={{ borderColor: "#222", my: 2 }} />

        <button
          onClick={handleSave}
          className="preferences-save-btn"
        >
          <div className='preferences-save-btn-content'>Save Preferences</div>
        </button>
        {/* <ToolTip className="ToolTip" information="Select your preferences below. Click to toggle selection." /> */}
      </Paper>
    </Box>
  );
}

export default PreferencesPage;