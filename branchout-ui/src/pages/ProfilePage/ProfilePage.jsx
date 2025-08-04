import React, { useEffect, useState} from "react";
import { useUser, useClerk} from "@clerk/clerk-react";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useContext } from "react";
import { ThemeContext } from "../../components/UISwitch/ThemeContext";
import { useTheme } from "@mui/material/styles";
import { Switch, FormControlLabel } from '@mui/material';


import {
  Box,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  TextField,
  Button,
  Avatar,
  ListItemIcon,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Logout as LogoutIcon} from "@mui/icons-material";

import "./ProfilePage.css"; 

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saveError, setSaveError] = useState("");
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const localUser = (() => {
    try {
      const userData = localStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  })();

  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const user = clerkUser || localUser;
  const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;


  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError("No user found.");
      return;
    }
    const token = localStorage.getItem("authToken");
    fetch(`${DATABASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        if (!editMode) {
          setName(data.username || "");
          setEmail(data.email || "");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {   

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');

      // Sign out from Clerk if using OAuth
      if (clerkUser) {
        await signOut({redirectUrl: "/home"});
      }   

      setTimeout(() => {
        navigate('/home');
      }, 100);

    } catch (error) {
      console.error('Error during logout:', error);
      // Clear storage and force redirect even if there's an error
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setTimeout(() => {
        navigate('/home');
      }, 100);
    }
  };

  function mapSkillLevel(level) {
    const mapping = {
      FIRSTYEAR: "1st Year",
      SECONDYEAR: "2nd Year",
      THIRDYEAR: "3rd Year",
      FOURTHYEAR: "4th Year",
    };
    return mapping[level] || level;
  }

  const handleSave = async () => {
    setSaveError("");
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${DATABASE_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: name, email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setSaveError(data.error || "Failed to update profile");
        return;
      }
      const updated = await res.json();
      setProfile((prev) => ({ ...prev, ...updated }));
      setEditMode(false);
    } catch (err) {
      setSaveError("Network error");
      console.log("Error:",err)
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  const display = profile || user || {};

  return (
    <Box sx={{ position: "relative", maxWidth: 500, mx: "auto", mt: 6 }}>
      <Paper
        className="profile-container"
        sx={{
          background: theme.palette.background.default,
          borderRadius: 4,
          p: 4,
          position: "relative",
          transition: "box-shadow 0.3s, background 0.3s",
          boxShadow: {
            xs: "none",
            sm: "0 0 24px 4px rgba(232,63,37,0.10)"
          },
        }}
      >

        {saveError && (
          <Alert severity="error" className="profile-alert" sx={{ background: "#222", color: "#fff" }}>
            {saveError}
          </Alert>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", 
            alignItems: "center",
            marginBottom: "20px"
          }}
        >
          <Avatar
            sx={{
              width: 200,
              height: 200,
              bgcolor: theme.palette.secondary.main,
              fontSize: "80pt",
            }}
          >
            {(clerkUser?.firstName?.charAt(0) ||
              user?.username?.charAt(0) ||
              user?.email?.charAt(0) ||
              "U").toUpperCase()}
          </Avatar>
        </Box>

        <Divider className="profile-divider" sx={{mb: 2 }} />

        {/* Editable Name & Email Section */}
        <Box className="profile-edit-section" sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", }}>
            {editMode ? (
              <>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  sx={{
                    mb: 2,
                    input: { color: theme.palette.text.main },
                    label: { color: theme.palette.secondary.main },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#333" },
                      "&:hover fieldset": { borderColor: "#0ff" },
                    },
                  }}
                />
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  sx={{
                    mb: 2,
                    input: { color: theme.palette.text.main },
                    label: { color: theme.palette.secondary.main },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#333" },
                      "&:hover fieldset": { borderColor: "#0ff" },
                    },
                  }}
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button variant="contained" color="#e37106" onClick={handleSave}>
                    Save
                  </Button>
                  <Button variant="outlined" color="#e37106" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="body1" className="profile-section" sx={{ color: theme.palette.text.primary }}>
                  <strong style = {{}}>Username:</strong> {display.username || display.firstName || display.email || "User"}
                </Typography>
                <Typography variant="body1" className="profile-section" sx={{ color: theme.palette.text.primary }}>
                  <strong>Email:</strong> {display.email || "N/A"}
                </Typography>
                        {!editMode && (
                <Button
                  variant="outlined"
                  size="small"
                  className="profile-edit-btn"
                  onClick={() => setEditMode(true)}
                  sx={{
                    borderColor: "#E83F25",
                    color: "#E83F25",
                    position: "absolute",
                    top: 24,
                    right: 16,
                    zIndex: 2,
                    "&:hover": {
                      borderColor: "#EA7300",
                      background: "#222",
                      color: "#EA7300",
                    },
                  }}
                >
                  <EditIcon />
                </Button>
              )}
              </>
            )}
          </Box>
        </Box>

        {display.role === "ADMIN" && (
          <>
            <Typography variant="body1" className="profile-section" sx={{ color: "#fff" }}>
              <strong>Role:</strong> {display.role}
            </Typography>
            <Typography variant="body1" className="profile-section" sx={{ color: "#fff" }}>
              <strong>ID:</strong> {display.id}
            </Typography>
            <Typography variant="body1" className="profile-section" sx={{ color: "#fff" }}>
              <strong>Auth:</strong> {clerkUser ? "OAuth" : "Local"}
            </Typography>
            <Divider sx={{ my: 2, borderColor: "#4c1255" }} />
          </>
        )}
      <Divider/>

      <Accordion
        defaultExpanded
        sx={{
          backgroundColor:"transparent",
          background:"none",
          color:theme.palette.text.primary,
          borderRadius: 2,
          boxShadow: "none",
          mt:2,
          mb: 2,
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color:theme.palette.text.primary }} />}>
          <Typography sx={{ fontWeight: 600}}>Preferences</Typography>
        </AccordionSummary>
        <AccordionDetails>

           <Typography variant="subtitle1" sx={{  mt:-1, fontWeight:"500", paddingBottom:"10px", fontSize:"10pt" }}>Skill Level</Typography>
            <Stack
              direction="row"
              spacing={2}
              rowGap={1}
              flexWrap="wrap"
              paddingBottom="10px"
              className="profile-stack"
              justifyContent="center"
              alignItems="left"
            >
            {(display.skill && display.skill.length > 0)
            ? display.skill.map((skill) => (
                <Chip
                  key={skill}
                  label={mapSkillLevel(skill)}
                  color="secondary"
                  className="profile-skill-chip"
                  variant="outlined"
                  sx={{
                    border: "1.5px solid #E83F25",
                    fontWeight: 500,
                    background: "transparent",
                    borderRadius: "8px",
                    width: "100px",
                    "& .MuiChip-label": {
                    color: theme.palette.text.primary,
                  }
                  }}
                />
              ))
            : <Chip label="None" color="default" variant="outlined" sx={{ color: theme.palette.text.primary, border: "1.5px solid gray", background: "transparent", borderRadius: "8px"}} />}
        </Stack>
        <Divider className="profile-divider" sx={{mb: 2 }} />
        <Typography variant="subtitle1" sx={{ color: "", mt: 2, fontWeight:"500", paddingBottom:"10px", fontSize:"10pt"}}>Languages</Typography>
            <Stack
              direction="row"
              spacing={2}
              rowGap={1}
              flexWrap="wrap"
              className="profile-stack"
              justifyContent="center"
              alignItems="center"
            >
          {(display.languages && display.languages.length > 0)
            ? display.languages.map((lang) => (
                <Chip
                  key={lang}
                  label={lang}
                  color="primary"
                  variant="outlined"
                  sx={{
                    border: "1.5px solid #E83F25",
                    fontWeight: 500,
                    background: "transparent",
                    borderRadius: "5px", // <-- Change this value as you like
                    width: "100px",
                    justifyContent:"center",
                    textAlign:"center",
                    "& .MuiChip-label": {
                    color: theme.palette.text.primary,
                  }
                  }}
                />
              ))
            : <Chip label="None" color="default" variant="outlined" sx={{ color: "#fff", border: "1.5px solid gray", background: "transparent", borderRadius: "8px" }} />}
        </Stack>
        <Divider className="profile-divider" sx={{mb: 2 }} />

        <Typography variant="subtitle1" sx={{ color: "", mt: 2, fontWeight:"500", paddingBottom:"10px", fontSize:"10pt" }}>Tags</Typography>

          <Stack
            direction="row"
            spacing={2}
            rowGap={1}
            flexWrap="wrap"
            paddingBottom="10px"
            className="profile-stack"
            justifyContent="center"
            alignItems="center"
          >          
          {(display.preferenceTags && display.preferenceTags.length > 0)
            ? display.preferenceTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  color="success"
                  variant="outlined"
                  sx={{
                    border: "1.5px solid #E83F25",
                    fontWeight: 500,
                    background: "transparent",
                    borderRadius: "8px", // <-- Change this value as you like
                    width: "135px",
                    justifyContent:"center",
                    textAlign:"center",
                    "& .MuiChip-label": {
                    color: theme.palette.text.primary,
                  }
                  }}
                />
              ))
            : <Chip label="None" color="default" variant="outlined" sx={{ color: "#fff", border: "1.5px solid gray", background: "transparent", borderRadius: "8px" }} />}
        </Stack>

        </AccordionDetails>
      </Accordion>

      {/* dark and light mode toggle */}
        <Box display="flex" justifyContent="center" alignItems="center">
          <FormControlLabel
            control={
              <Switch 
                checked={isDarkMode}
                onChange={toggleTheme}
                sx={{
                  '& .MuiSwitch-thumb': {
                    backgroundColor: theme.palette.primary.main,
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: theme.palette.primary.light, // optional
                  },
                  '&.Mui-checked .MuiSwitch-thumb': {
                    backgroundColor: theme.palette.primary.main,
                  },
                  '&.Mui-checked .MuiSwitch-track': {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              />
            }
            label={isDarkMode ? "Dark Mode" : "Light Mode"}
          />
        </Box>

        <Box sx={{ p: 2, mt: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ListItemButton className = "settingsButton"
            onClick={handleOpenModal}
            sx={{
              color: 'white',
              backgroundColor: '#e34714',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: "200px",
              borderRadius: "7px"
            , '&:hover': {
              backgroundColor: "#e37106",
              color: "black"
            }}}
          > Logout  
            <LogoutIcon />
          </ListItemButton>
      </Box>
       {/* Logout Confirmation Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            backgroundColor: '#1e1e1e',
            color: 'white',
            borderRadius: 3,
            p: 3,
            minWidth: 300,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.2rem', pb: 0, textAlign: "center", marginBottom: "15px" }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent sx={{ pt: 1, pb: 2 }}>
          Are you sure you want to log out?
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleCloseModal} variant = "text" sx={{ color: 'white', backgroundColor: '#e34714', '&:hover': {
            backgroundColor: '#e37106', color:"black",
          },}}>
            Cancel
          </Button>
          <Button onClick={handleLogout} sx={{ backgroundColor: 'transparent',
          color: 'white',
          '&:hover': {
            backgroundColor: 'transparent', color:"#4c1255",
          }}}>
            Yes, Logout
          </Button>
        </DialogActions>
      </Dialog>
      </Paper>
    </Box>
  );
};

export default ProfilePage;