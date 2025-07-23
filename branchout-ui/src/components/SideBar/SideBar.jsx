import React, { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import fullLogo from "../../assets/logo/fullLogo.png"
import miniLogo from "../../assets/logo/miniLogo.png"


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
import { Link, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 270;

export default function SideBar() {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const { user: clerkUser } = useUser();
  const isCollapsed = useMediaQuery('(max-width:1000px)');
  const  {signOut}  = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const isDiscoveryPage = location.pathname === '/discovery';


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

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? 60 : drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: isCollapsed ? 60 : drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Toolbar>
        {/* Logo */}
        {!isCollapsed ? (
           <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src = {fullLogo} style={{width:"200px"}}></img>
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={miniLogo} style={{ width: "35px", paddingRight: "5px"}} />
          </Box>
        </Box>
        )} 
      </Toolbar>
      <Divider />
      {/* User Info */}
      <Box
        sx={{
          p: 2,
          paddingLeft: isCollapsed ? 2 : 5, 
          color: 'white',
          cursor: currentUser ? 'pointer' : 'not-allowed',
          display: 'flex',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          alignItems: 'center',
          '&:hover': { backgroundColor: currentUser ? 'rgba(255,255,255,0.05)' : 'inherit' }
        }}
        onClick={() => {
          if (currentUser) {
            navigate('/profile');
          }
        }}
      >
        {/* Logo */}
        <Avatar sx={{ width: 32, height: 32, bgcolor: '#daa7e2' }}>
          {(clerkUser?.firstName?.charAt(0) ||
            currentUser?.username?.charAt(0) ||
            currentUser?.email?.charAt(0) ||
            'U').toUpperCase()}
        </Avatar>
        {!isCollapsed && (
          <Box sx={{ ml: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {clerkUser
                ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim()
                : currentUser?.username ||
                  currentUser?.email ||
                  'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'grey.400', paddingRight: "13pt"}}>
              {currentUser?.role || 'USER'}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      {/* NAVIGATION Section */}
      <Box sx={{ p: 1, flexGrow: 1 }}>
        {!isCollapsed && (
          <Typography variant="caption" sx={{ px: 2, color: 'text.secondary', fontWeight: 'bold' }}>
            NAVIGATION
          </Typography>
        )}
        <List>
          <ListItem disablePadding>
            <ListItemButton
              href="/discovery"
              sx={{
                paddingLeft: isCollapsed ? 2.5 : 5 ,
                color: 'white',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease',
                '& .MuiSvgIcon-root': {
                  color: 'white', // Default icon color
                  transition: 'color 0.3s ease',
                },
                '&:hover': {
                  color: '#e34714', // Text hover color
                  '& .MuiSvgIcon-root': {
                    color: '#e34714', // Icon hover color
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', display: 'flex', paddingBottom:"5px", paddingRight:"5px"}}>
                <HomeIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary="Discovery" />}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              href="/preferences"
              sx={{
                paddingLeft: isCollapsed ? 2.5 : 5,
                color: 'white',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease',
                '& .MuiSvgIcon-root': {
                  color: 'white', // Default icon color
                  transition: 'color 0.3s ease',
                },
                '&:hover': {
                  color: '#e34714', // Text hover color
                  '& .MuiSvgIcon-root': {
                    color: '#e34714', // Icon hover color
                  },
                },
              }}
              
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', display: 'flex', paddingBottom:"2px", paddingRight:"5px"}}>
                <SettingsIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary="Preferences" />}
            </ListItemButton>
          </ListItem>
          {/* Admin Dashboard - only show if user is admin */}
          {currentUser?.role === 'ADMIN' && (
            <ListItem disablePadding>
              <ListItemButton
                href="/admin"
                sx={{
                  paddingLeft: isCollapsed ? 2.5 : 5 ,
                  color: 'white',
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.3s ease',
                '& .MuiSvgIcon-root': {
                  color: 'white', // Default icon color
                  transition: 'color 0.3s ease',
                },
                '&:hover': {
                  color: '#e34714', // Text hover color
                  '& .MuiSvgIcon-root': {
                    color: '#e34714', // Icon hover color
                  },
                },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', display: 'flex', paddingBottom:"5px", paddingRight:"5px" }}>
                  <AdminIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                {!isCollapsed && <ListItemText primary="Admin Dashboard" />}
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>

      {/* FEATURES Section */}
      <Box sx={{ p: 1 }}>
        {!isCollapsed && (
          <Typography variant="caption" sx={{ px: 2, color: 'text.secondary', fontWeight: 'bold' }}>
            FEATURES
          </Typography>
        )}
        <List>
          <ListItem disablePadding>
            <ListItemButton
                component={Link}
                to="/SavedRepos"
              sx={{
                paddingLeft: isCollapsed ? 2.5 : 5 ,
                color: 'white',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease',
                '& .MuiSvgIcon-root': {
                  color: 'white', // Default icon color
                  transition: 'color 0.3s ease',
                },
                '&:hover': {
                  color: '#e34714', // Text hover color
                  '& .MuiSvgIcon-root': {
                    color: '#e34714', // Icon hover color
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', display: 'flex', paddingRight:"5px"}}>
                <ChatIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary="Saved Repos" />}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                paddingLeft: isCollapsed ? 2.5 : 5 ,
                color: 'white',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease',
                '& .MuiSvgIcon-root': {
                  color: 'white', // Default icon color
                  transition: 'color 0.3s ease',
                },
                '&:hover': {
                  color: '#e34714', // Text hover color
                  '& .MuiSvgIcon-root': {
                    color: '#e34714', // Icon hover color
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', display: 'flex', paddingBottom:"5px", paddingRight:"5px" }}>
                <CalendarIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary="History" />}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                paddingLeft: isCollapsed ? 2.5 : 5 ,
                color: 'white',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease',
                '& .MuiSvgIcon-root': {
                  color: 'white', // Default icon color
                  transition: 'color 0.3s ease',
                },
                '&:hover': {
                  color: '#e34714', // Text hover color
                  '& .MuiSvgIcon-root': {
                    color: '#e34714', // Icon hover color
                  },
                },
              }}
              onClick ={() => navigate("/settings")}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', display: 'flex', paddingBottom:"3px", paddingRight:"5px" }}>
                <SettingsIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary="Settings" />}
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Logout Button - Bottom Left
      <Box sx={{ p: 2, mt: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {isCollapsed ? (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LogoutIcon />
          </ListItemButton>
        ) : (
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
        )}
      </Box> */}
    </Drawer>
  );
}