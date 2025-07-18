import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import EditIcon from "@mui/icons-material/Edit";
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
  ListItemIcon,
} from "@mui/material";
import "./ProfilePage.css"; 

const ProfilePage = () => {
  const { user: clerkUser } = useUser();
  const localUser = (() => {
    try {
      const userData = localStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  })();
  const user = clerkUser || localUser;
  const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || 'http://localhost:5000';

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saveError, setSaveError] = useState("");

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
        setName(data.username || "");
        setEmail(data.email || "");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

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
      const res = await fetch(`${DATABASE_URL}/user/preferences`, {
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
          background: "#111",
          color: "#fff",
          borderRadius: 4,
          boxShadow: "0 0 24px 4px rgba(232,63,37,0.10)", // #E83F25
          p: 4,
          position: "relative",
          transition: "box-shadow 0.3s, background 0.3s",
          "&:hover": {
            boxShadow: "0 0 32px 8px rgba(232,63,37,0.18)", // #E83F25
            background: "#111",
          },
        }}
      >


        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, letterSpacing: 1 }}>
          Profile Page
        </Typography>
        <Divider className="profile-divider" sx={{ borderColor: "#222", mb: 2 }} />

        {saveError && (
          <Alert severity="error" className="profile-alert" sx={{ background: "#222", color: "#fff" }}>
            {saveError}
          </Alert>
        )}

        {/* Editable Name & Email Section */}
        <Box className="profile-edit-section" sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {editMode ? (
              <>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  sx={{
                    mb: 2,
                    input: { color: "#fff" },
                    label: { color: "#aaa" },
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
                    input: { color: "#fff" },
                    label: { color: "#aaa" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#333" },
                      "&:hover fieldset": { borderColor: "#0ff" },
                    },
                  }}
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="body1" className="profile-section" sx={{ color: "#fff" }}>
                  <strong>Name:</strong> {display.username || display.firstName || display.email || "User"}
                </Typography>
                <Typography variant="body1" className="profile-section" sx={{ color: "#fff" }}>
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
            <Divider sx={{ my: 2, borderColor: "#222" }} />
          </>
        )}

      <Typography variant="subtitle1" sx={{ color: "#E83F25", mt: 2 }}>Skill Level:</Typography>
            <Stack
              direction="row"
              spacing={2}
              rowGap={1}
              flexWrap="wrap"
              className="profile-stack"
              justifyContent="center"
              alignItems="center"
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
                    color: "#fff",
                    border: "1.5px solid #E83F25",
                    fontWeight: 500,
                    background: "transparent",
                    borderRadius: "10px", // <-- Change this value as you like
                  }}
                />
              ))
            : <Chip label="None" color="default" variant="outlined" sx={{ color: "#fff", border: "1.5px solid #E83F25", background: "transparent" }} />}
        </Stack>

        <Typography variant="subtitle1" sx={{ color: "#E83F25", mt: 2 }}>Languages:</Typography>
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
                    color: "#fff",
                    border: "1.5px solid #E83F25",
                    fontWeight: 500,
                    background: "transparent",
                    borderRadius: "10px", // <-- Change this value as you like
                  }}
                />
              ))
            : <Chip label="None" color="default" variant="outlined" sx={{ color: "#fff", border: "1.5px solid #E83F25", background: "transparent" }} />}
        </Stack>

        <Typography variant="subtitle1" sx={{ color: "#E83F25", mt: 2 }}>Tags:</Typography>

          <Stack
            direction="row"
            spacing={2}
            rowGap={1}
            flexWrap="wrap"
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
                    color: "#fff",
                    border: "1.5px solid #E83F25",
                    fontWeight: 500,
                    background: "transparent",
                    borderRadius: "10px", // <-- Change this value as you like
                  }}
                />
              ))
            : <Chip label="None" color="default" variant="outlined" sx={{ color: "#fff", border: "1.5px solid #E83F25", background: "transparent" }} />}
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProfilePage;