import React, {useState, useEffect} from 'react';
import { Container, Divider, Chip, Box, Paper, Typography, Stack, Accordion, AccordionSummary, AccordionDetails, useMediaQuery  } from '@mui/material';
import './PreferencesPage.css';
import ToolTip from '../../components/ToolTip/ToolTip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
    <Box sx={{ width: "100vw", minHeight:"100vh", pt: isMobile ? 2 : 8, px: 2 }}>
      <Paper
        className="preferences-container"
        sx={{
          width: "100%",
          maxWidth: "100%",
          background: "#111",
          color: "#fff",
          borderRadius: 4,
          boxSizing: "border-box",
          p: isMobile ? 2 : 4,
          position: "relative",
          transition: "box-shadow 0.3s, background 0.3s",
          "&:hover": {
            background: "#111",
          },
        }}
      >
        <Typography 
          variant={isMobile ? "h4" : "h5"} 
          gutterBottom 
          sx={{ 
            fontWeight: 700, 
            letterSpacing: 1, 
            fontFamily: "Inter, sans-serif",
            textAlign: "left"
          }}
        >
          Select
          <br/>
          Preferences
        </Typography>
        <Divider className="preferences-divider" sx={{ borderColor: "#222", mb: 2 }} />

        {isMobile ? (
          // Mobile Accordion Layout
          <>
            {/* Skill Level */}
            <Accordion 
              sx={{ 
                background: "transparent", 
                color: "#fff",
                mb: 2,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                <Typography variant = {isMobile ? "h6":"h5"} sx={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  Skill Level
                  <div style={{fontSize:"10px"}}>
                    Choose a school year to match repo difficulty.
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
                color: "#fff",
                mb: 2,
                borderRadius: "8px !important",
                "&:before": { display: "none" }
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                <Typography variant = {isMobile ? "h6":"h5"} sx={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  Languages
                  <div style={{fontSize:"10px"}}>
                    Select programming languages to focus on.
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
                color: "#fff",
                mb: 3,
                borderRadius: "8px !important",
                "&:before": { display: "none" }
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                <Typography variant = {isMobile ? "h6":"h5"} sx={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  Tags
                  <div style={{fontSize:"10px"}}>
                    Pick tech you're interested in exploring.
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
            <Typography variant="h6" sx={{ color: "#0ff", mt: 2, fontFamily: "Inter, sans-serif" }}>
              Skill Level <ToolTip className="ToolTip" information={"Set your school level - think of 1st as freshman and 4th as senior! This will correlate to the level repositories you get in your feed."} />
            </Typography>
            <Stack direction="row" spacing={1} rowGap={1} flexWrap="wrap" className="preferences-stack" justifyContent="center" alignItems="center">
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
                    borderRadius: "10px",
                    width: "100px",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                />
              ))}
            </Stack>

            <Divider sx={{ borderColor: "#222", my: 2 }} />

            <Typography variant="h6" sx={{ color: "#0ff", mt: 2, fontFamily: "Inter, sans-serif" }}>
              Languages <ToolTip className="ToolTip" information={"Set any languages you know (or want to know) here"} />
            </Typography>
            <Stack direction="row" spacing={1} rowGap={1} flexWrap="wrap" className="preferences-stack" justifyContent="center" alignItems="center">         
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
                    borderRadius: "10px",
                    width: "100px",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                />
              ))}
            </Stack>

            <Divider sx={{ borderColor: "#222", my: 2 }} />

            <Typography variant="h6" sx={{ color: "#0ff", mt: 2, fontFamily: "Inter, sans-serif" }}>
              Tags <ToolTip className="ToolTip" information={"Set any tags of topics that you know or want to know here"} />
            </Typography>
            <Stack direction="row" spacing={1} rowGap={1} flexWrap="wrap" className="preferences-stack" justifyContent="center" alignItems="center"> 
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
                    borderRadius: "10px",
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
            marginLeft: isMobile ? "5%" : "none",
            borderRadius:"5px"
          }}
        >
          <div className='preferences-save-btn-content'>Save Preferences</div>
        </button>
      </Paper>
    </Box>
  );
}

export default PreferencesPage;