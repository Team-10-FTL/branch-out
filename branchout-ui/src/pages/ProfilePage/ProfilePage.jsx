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
    fetch("http://localhost:5000/user/profile", {
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
    FIFTHYEAR: "5th Year",
    GRADUATE: "Graduate",
    OTHER: "Other"
  };
  return mapping[level] || level;
}

  const handleSave = async () => {
    setSaveError("");
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch("http://localhost:5000/user/preferences", {
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
    <Paper sx={{ maxWidth: 500, mx: "auto", mt: 8, p: 4, borderRadius: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile Page
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {saveError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {saveError}
        </Alert>
      )}

      {/* Editable Name & Email Section */}
      <Box sx={{ position: "relative", mb: 3, p: 2, border: "1px solid #eee", borderRadius: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {editMode ? (
            <>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", gap: 1 }}>
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
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {display.username || display.firstName || display.email || "User"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {display.email || "N/A"}
              </Typography>
            </>
          )}
        </Box>
        {!editMode && (
          <Button
            variant="outlined"
            size="small"
            sx={{ position: "absolute", top: 8, right: 8, minWidth: 0, padding: 1 }}
            onClick={() => setEditMode(true)}
          >
            <EditIcon />
          </Button>
        )}
      </Box>

      {display.role === "ADMIN" && (
        <>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Role:</strong> {display.role}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>ID:</strong> {display.id}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Auth:</strong> {clerkUser ? "OAuth" : "Local"}
          </Typography>
          <Divider sx={{ my: 2 }} />
        </>
      )}

      <Typography variant="subtitle1">Skill Level:</Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
        {(display.skill && display.skill.length > 0)
          ? display.skill.map((skill) => (
              <Chip key={skill} label={mapSkillLevel(skill)} color="secondary" />
            ))
          : <Chip label="None" color="default" />}
      </Stack>

      <Typography variant="subtitle1">Languages:</Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
        {(display.languages && display.languages.length > 0)
          ? display.languages.map((lang) => (
              <Chip key={lang} label={lang} color="primary" />
            ))
          : <Chip label="None" color="default" />}
      </Stack>

      <Typography variant="subtitle1">Tags:</Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
        {(display.preferenceTags && display.preferenceTags.length > 0)
          ? display.preferenceTags.map((tag) => (
              <Chip key={tag} label={tag} color="success" />
            ))
          : <Chip label="None" color="default" />}
      </Stack>
    </Paper>
  );
};

export default ProfilePage;