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
  Toolbar,
  Button
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
  ExpandMore,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 270;

export default function SideBar() {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const { user: clerkUser } = useUser();
  const  {signOut}  = useClerk();
  const navigate = useNavigate();

  // Check for local user
  const getLocalUser = () => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      return null;
    }
  };

  const localUser = getLocalUser();
  const currentUser = clerkUser || localUser;

  const handleSubmenuToggle = () => setSubmenuOpen(!submenuOpen);

  const handleLogout = async () => {
    try {
      // Sign out from Clerk if using OAuth
      if (clerkUser) {
        await signOut();
      }
      
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if there's an error
      navigate('/login');
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>Branch Out</Typography>
          </Box>
        </Box>
      </Toolbar>
      
      <Divider />

      {/* User Info */}
        <Box
        sx={{
            p: 2,
            color: 'white',
            cursor: 'pointer', // Show pointer on hover
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
        }}
        onClick={() => navigate('/profile')}
        >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {(clerkUser?.firstName?.charAt(0) ||
                currentUser?.username?.charAt(0) ||
                currentUser?.email?.charAt(0) ||
                'U').toUpperCase()}
            </Avatar>
            <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {clerkUser
                ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim()
                : currentUser?.username ||
                    currentUser?.email ||
                    'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'grey.400' }}>
                {currentUser?.role || 'USER'}
            </Typography>
            </Box>
        </Box>
        </Box>

      <Divider />

      {/* NAVIGATION Section */}
      <Box sx={{ p: 1, flexGrow: 1 }}>
        <Typography variant="caption" sx={{ px: 2, color: 'text.secondary', fontWeight: 'bold' }}>
          NAVIGATION
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton href="/discovery" sx={{ color: 'white' }}>
              <ListItemIcon><HomeIcon sx={{ color: 'white' }} /></ListItemIcon>
              <ListItemText primary="Discovery" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton href="/preferences" sx={{ color: 'white' }}>
              <ListItemIcon><SettingsIcon sx={{ color: 'white' }} /></ListItemIcon>
              <ListItemText primary="Preferences" />
            </ListItemButton>
          </ListItem>

          
          {/* Admin Dashboard - only show if user is admin */}
          {currentUser?.role === 'ADMIN' && (
            <ListItem disablePadding>
              <ListItemButton href="/admin" sx={{ color: 'white' }}>
                <ListItemIcon><AdminIcon sx={{ color: 'white' }} /></ListItemIcon>
                <ListItemText primary="Admin Dashboard" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>

      {/* FEATURES Section */}
      <Box sx={{ p: 1 }}>
        <Typography variant="caption" sx={{ px: 2, color: 'text.secondary', fontWeight: 'bold' }}>
          FEATURES
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ color: 'white' }}>
              <ListItemIcon><ChatIcon sx={{ color: 'white' }} /></ListItemIcon>
              <ListItemText primary="Saved Repos" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton sx={{ color: 'white' }}>
              <ListItemIcon><CalendarIcon sx={{ color: 'white' }} /></ListItemIcon>
              <ListItemText primary="History" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton sx={{ color: 'white' }}>
              <ListItemIcon><SettingsIcon sx={{ color: 'white' }} /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Logout Button - Bottom Left */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}