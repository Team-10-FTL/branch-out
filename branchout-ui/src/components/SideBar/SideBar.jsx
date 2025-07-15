import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Avatar,
  Collapse,
  ListItemButton,
  Toolbar
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Apps as AppsIcon,
  Chat as ChatIcon,
  CalendarMonth as CalendarIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';

const drawerWidth = 270;

export default function SideBar() {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const handleSubmenuToggle = () => setSubmenuOpen(!submenuOpen);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'black'
        },
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Branch Out</Typography>
          </Box>
        </Box>
      </Toolbar>
      
      <Divider />

      {/* NAVIGATION Section */}
      <Box sx={{ p: 1 }}>
        <Typography variant="caption" sx={{ px: 2, color: 'text.secondary', fontWeight: 'bold' }}>
          NAVIGATION
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton href="/">
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Discovery" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton href="/preferences">
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Preferences" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton href="/profile">
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* FEATURES Section */}
      <Box sx={{ p: 1 }}>
        <Typography variant="caption" sx={{ px: 2, color: 'text.secondary', fontWeight: 'bold' }}>
          FEATURES
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon><ChatIcon /></ListItemIcon>
              <ListItemText primary="Saved Repos" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon><CalendarIcon /></ListItemIcon>
              <ListItemText primary="History" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      
    </Drawer>
  );
}