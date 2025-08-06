import React, {useState, useEffect} from 'react';
import { useUser } from "@clerk/clerk-react";
import { Container, Divider, Chip, Box, Paper, Typography, Stack, Accordion, AccordionSummary, AccordionDetails, useMediaQuery  } from '@mui/material';
import './PreferencesPage.css';
import ToolTip from '../../components/ToolTip/ToolTip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from "@mui/material/styles";

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
  const isMobile = useMediaQuery('(max-width:430px)');
  const { user: clerkUser } = useUser();
  const theme = useTheme();

  const localUser = (() => {
    try {
      const userData = localStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  })();

  const user = clerkUser || localUser;



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
      hasCompletedOnboarding: true, // Assuming this is always true for now
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
    <Box sx={{ minWidth: "100vw", minHeight:"100vh", pt: isMobile ? 2 : 8}}>
      <Paper
        className="preferences-container"
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "70%",
          marginLeft: isMobile ? "0" : "10%",
          background: "transparent",
          borderRadius: 4,
          boxSizing: "border-box",
          p: isMobile ? 2 : 4,
          boxShadow:"none",
          position: "relative",
          color: theme.palette.text.primary
        }}
      >
        <Typography 
          variant="h4"
          gutterBottom 
          sx={{ 
            fontFamily: "Inter, sans-serif",
            fontWeight: 700, 
            letterSpacing: 1, 
            textAlign: "left",
            color:theme.palette.text.primary
          }}
        > 
        {!isMobile ? (
          <span className="oneLineTitle">
            {user?.username}'s
            Preferences</span>
        ) : (
          <>
          <div className="select">{user?.username}'s</div>
          <div className="preferences">Preferences</div>
          </>
        )}
        </Typography>
        <Divider className="preferences-divider" sx={{ borderColor: "#222", mb: 2 }} />

        {isMobile ? (
          // Mobile Accordion Layout
          <>
            {/* Skill Level */}
            <Accordion 
              sx={{ 
                background: "transparent", 
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.text.primary }} />}>
                <Typography variant = {isMobile ? "h6":"h5"} sx={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  Skill Level
                  <div style={{fontSize:"10px"}}>
                    School year = repo difficulty.
                  </div>
                </Typography>
                {selectedLevels.length > 0 && (
                  <Chip 
                    label={selectedLevels.length}
                    size="small"
                    sx={{ ml: "auto", mr: 1, mt:1, bgcolor: "#e37106", color: "#fff" }}
                  />
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Stack 
                  direction="row"
                  flexWrap="wrap"
                  justifyContent="center"
                  gap="10px"
                >
                  {LEVELS.map((level) => (
                    <Chip
                      key={level}
                      label={level}
                      onClick={() => handleToggle(level, selectedLevels, setSelectedLevels)}
                      sx={{
                        width: "calc(40% - 4px)",
                        fontSize:"9pt",
                        background: selectedLevels.includes(level) ? "#fff" : "#333",
                        color: selectedLevels.includes(level) ? "#000" : "#fff",
                        border: "1px solid #555",
                        borderRadius: "5px",
                      }}
                    />
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Languages */}
            <Accordion 
              sx={{ 
                background: "transparent", 
                mb: 2,
                color:theme.palette.text.primary,
                borderRadius: "8px !important",
                "&:before": { display: "none" }
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon  sx={{ color:theme.palette.text.primary }}/>}>
                <Typography variant = {isMobile ? "h6":"h5"} sx={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  Languages
                  <div style={{fontSize:"10px"}}>
                    Programming languages to focus on.
                  </div>
                </Typography>
                {selectedLanguages.length > 0 && (
                  <Chip 
                    label={selectedLanguages.length}
                    size="small"
                    sx={{ ml: "auto", mr: 1, mt:1, bgcolor: "#e37106", color: "#fff" }}
                  />
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row" gap="5px" flexWrap="wrap" justifyContent="center">
                  {LANGUAGES.map((lang) => (
                    <Chip
                      key={lang}
                      label={lang}
                      onClick={() => handleToggle(lang, selectedLanguages, setSelectedLanguages)}
                      sx={{
                        minWidth: "80px",
                        flex: "0 1 calc(33% - 4px)",
                        maxWidth: "calc(33% - 4px)",                        
                        textAlign: "center",
                        background: selectedLanguages.includes(lang) ? "#fff" : "#333",
                        color: selectedLanguages.includes(lang) ? "#000" : "#fff",
                        border: "1px solid #555",
                        borderRadius: "5px"
                      }}
                    />
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Tags */}
            <Accordion 
              sx={{ 
                background: "transparent", 
                color:theme.palette.text.primary,
                mb: 3,
                borderRadius: "8px !important",
                "&:before": { display: "none" }
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color:theme.palette.text.primary }} />}>
                <Typography variant = {isMobile ? "h6":"h5"} sx={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  Tags
                  <div style={{fontSize:"10px"}}>
                    Tech you're interested in exploring.
                  </div>
                </Typography>
                {selectedTags.length > 0 && (
                  <Chip 
                    label={selectedTags.length}
                    size="small"
                    sx={{ ml: "auto", mr:1,mt:1, bgcolor: "#e37106", color: "#fff" }}
                  />
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row" gap="8px" flexWrap="wrap" justifyContent="center" alignItems="center">
                  {TAGS.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() => handleToggle(tag, selectedTags, setSelectedTags)}
                      sx={{                       
                        background: selectedTags.includes(tag) ? "#fff" : "#333",
                        color: selectedTags.includes(tag) ? "#000" : "#fff",
                        border: "1px solid #555",
                        borderRadius: "5px",
                        // Remove flex: 1 and use:
                        flex: 1,
                        minWidth: "fit-content",
                      }}
                    />
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          </>
        ) : (
          // Desktop Layout - Keep your existing code here
          <>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, mt: 2, mb:1, fontFamily: "Inter, sans-serif"}}>
              Skill Level <ToolTip className="ToolTip" information={"Set your school level - think of 1st as freshman and 4th as senior! This will correlate to the level repositories you get in your feed."}/>
            </Typography>
            <Stack direction="row" gap = "8px" flexWrap="wrap" className="preferences-stack" justifyContent="left" alignItems="center">
              {LEVELS.map((level) => (
                <Chip
                  key = {level}
                  label={level}
                  onClick={() => handleToggle(level, selectedLanguages, setSelectedLanguages)}
                  variant={selectedLanguages.includes(level) ? "filled" : "outlined"}
                  sx={{
                    backgroundColor: selectedLanguages.includes(level) ? theme.palette.primary.main : "transparent",
                    color: selectedLanguages.includes(level) ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    border: `1px solid ${selectedLanguages.includes(level) ? theme.palette.primary.main : "#0ff"}`,
                    borderRadius:"5px",
                  }}
                />
              ))}
            </Stack>

            <Divider sx={{ borderColor: "#222", my: 2 }} />

            <Typography variant="h6" sx={{ color: theme.palette.text.primary, mt: 2, mb:1, fontFamily: "Inter, sans-serif" }}>
              Languages <ToolTip className="ToolTip" information={"Set any languages you know (or want to know) here"} />
            </Typography>
            <Stack direction="row"rowGap={.5} flexWrap="wrap" className="preferences-stack" justifyContent="left" alignItems="center">         
              {LANGUAGES.map((lang) => (
                <Chip
                  key={lang}
                  label={lang}
                  onClick={() => handleToggle(lang, selectedLanguages, setSelectedLanguages)}
                  variant={selectedLanguages.includes(lang) ? "filled" : "outlined"}
                  sx={{
                    backgroundColor: selectedLanguages.includes(lang) ? theme.palette.primary.main : "transparent",
                    color: selectedLanguages.includes(lang) ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    border: `1px solid ${selectedLanguages.includes(lang) ? theme.palette.primary.main : "#0ff"}`,
                    fontWeight: 500,
                    marginRight: 1,
                    marginBottom: 1,
                    borderRadius: "5px",
                    width: "100px",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                />
              ))}
            </Stack>

            <Divider sx={{ borderColor: "#222", my: 2 }} />

            <Typography variant="h6" sx={{ color: theme.palette.text.primary, mt: 2, mb:1, fontFamily: "Inter, sans-serif" }}>
              Tags <ToolTip className="ToolTip" information={"Set any tags of topics that you know or want to know here"} />
            </Typography>
            <Stack direction="row" rowGap={.5} flexWrap="wrap" className="preferences-stack" justifyContent="left" alignItems="center"> 
              {TAGS.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => handleToggle(tag, selectedLanguages, setSelectedLanguages)}
                  variant={selectedLanguages.includes(tag) ? "filled" : "outlined"}
                  sx={{
                    backgroundColor: selectedLanguages.includes(tag) ? theme.palette.primary.main : "transparent",
                    color: selectedLanguages.includes(tag) ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    border: `1px solid ${selectedLanguages.includes(tag) ? theme.palette.primary.main : "#0ff"}`,
                    fontWeight: 500,
                    marginRight: 1,
                    marginBottom: 1,
                    borderRadius: "5px",
                    width: "135px",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                />
              ))}
            </Stack>

            <Divider sx={{ borderColor: "#222", my: 2 }} />
          </>
        )}

        <button
          onClick={handleSave}
          className="preferences-save-btn"
          style={{
            width: isMobile ? "90%" : "auto",
            marginLeft: isMobile ? "5%" : "0",
            borderRadius:"5px",
          }}
        >
          <div className='preferences-save-btn-content'>Save Preferences</div>
        </button>
      </Paper>
    </Box>
  );
}

export default PreferencesPage;