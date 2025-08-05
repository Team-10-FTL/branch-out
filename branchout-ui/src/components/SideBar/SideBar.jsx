import React, { useState } from 'react';
import { useMediaQuery, Menu, MenuItem, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
  AppBar,
  Button
} from '@mui/material';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import InfoIcon from '@mui/icons-material/Info';
import ExploreIcon from '@mui/icons-material/Explore';
import {
  Home as HomeIcon,
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
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";


const drawerWidth = 180;

export default function SideBar() {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const { user: clerkUser } = useUser();
  const isMobile = useMediaQuery('(max-width:430px)');
  const isTablet = useMediaQuery('(max-width:768px)');  
  const  {signOut}  = useClerk();
  const navigate = useNavigate();
  // const isDiscoveryPage = location.pathname === '/discovery';
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const isActive = (path) => location.pathname === path;
  const theme = useTheme();
  
  const location = useLocation();
  const hideSidebar = location.pathname === '/home';
  if (hideSidebar) return null;


  // Check for local user
  const getLocalUser = () => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.log("ERROR", e)
      return null;
    }
  };
  

  const localUser = getLocalUser();
  const currentUser = clerkUser || localUser;

  const handleSubmenuToggle = () => setSubmenuOpen(!submenuOpen);

  return (
    <>
    {isMobile ? (
      <>
        <AppBar position = "fixed" sx={{ bgcolor: theme.palette.background.sideBar, zIndex:1300, boxShadow: 'none', backgroundImage:"none",
    borderBottom: '1px solid rgba(169, 81, 19, 0.6)'}}>
            <Toolbar sx={{ justifyContent: 'space-between', px: 2, minHeight: '64px !important' }}>
              <img 
                src={miniLogo} 
                alt="logo" 
                style={{ width: 30, cursor: 'pointer' }}
              />
              <IconButton onClick={handleMenuOpen} sx={{ color: theme.palette.text.primary}}>
                <MenuIcon />
              </IconButton>
          </Toolbar>
        </AppBar>


        {/* Mobile Dropdown Menu */}
        <Menu
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorReference="anchorPosition"
          anchorPosition={
            anchorEl
              ? { top: anchorEl.getBoundingClientRect().bottom -20, left: anchorEl.getBoundingClientRect().right - 180 }
              : undefined
          }
          className="mobile-navigation-menu" // Add this class
          sx={{
            '& .MuiPaper-root': {
              marginTop: 1,
              minWidth: 160,
              backgroundColor:theme.palette.background.default,
            }
          }}
        >
          <MenuItem onClick={() => { handleMenuClose(); navigate('/profile')}} sx = {{color: isActive("/profile") ? "#e34714" : theme.palette.text.primary}}>
            <PersonIcon sx={{ mr: 2}} />
            Profile
          </MenuItem>
          
          <Divider />
          <MenuItem onClick={() => { handleMenuClose(); navigate('/discovery'); }}sx = {{color: isActive("/discovery") ? "#e34714" : theme.palette.text.primary}}>
            <ExploreIcon sx={{ mr: 2}} />
            Discovery
          </MenuItem>
          
          <Divider />
          <MenuItem onClick={() => { handleMenuClose(); navigate('/search'); }}sx = {{color: isActive("/search") ? "#e34714" : theme.palette.text.primary}}>
            <ManageSearchIcon sx={{ mr: 2}} />
            Search
          </MenuItem>
          
          <Divider />
          <MenuItem onClick={() => { handleMenuClose(); navigate('/preferences'); }}sx = {{color: isActive("/preferences") ? "#e34714" : theme.palette.text.primary}}>
            <SettingsAccessibilityIcon sx={{ mr: 2}} />
            Preferences
          </MenuItem>
          
          <Divider />
          <MenuItem onClick={() => { handleMenuClose(); navigate('/savedrepos'); }}sx = {{color: isActive("/savedrepos") ? "#e34714" : theme.palette.text.primary}}>
            <ChatIcon sx={{ mr: 2}} />
            Saved Repos
          </MenuItem>
          
          {currentUser?.role === 'ADMIN' && (
            <MenuItem 
              onClick={() => { handleMenuClose(); navigate('/admin'); }}
              className="nav-item-admin" // Add this class
              data-nav="admin" // Add this attribute
            >
              <AdminIcon sx={{ mr: 2}} />
              Admin Dashboard
            </MenuItem>
          )}
        </Menu>
      </>
    ) : (
      
    <Drawer
      variant="permanent"
      sx={{
        width: isTablet ? 60 : drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: isTablet ? 60 : drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.sideBar,
          flexDirection: 'column',
           "&::after": {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '4px',
            height: '100%',
            background: 'linear-gradient(to left, rgba(197, 111, 31, 0.6), rgba(227, 71, 20, 0.2), transparent)',              }
        },
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'relative' }}>
          {/* Full logo (visible only when not collapsed) */}
          {isTablet ? (
            <img
            src={miniLogo}
            alt="mini logo"
            style={{
              width: '30px',
              opacity: isTablet ? 1 : 0,
              transition: 'opacity 0.3s ease',
              position: 'absolute',
              pointerEvents: isTablet ? 'auto' : 'none',
            }}
          />
          ) : (
          <img
            src={fullLogo}
            alt="full logo"
            style={{
              width: '150px',
              cursor:"pointer"
            }}
          />
          )}
        </Box>
      </Toolbar>
      <Divider />
      {/* User Info */}
      <Box
        sx={{
          p: 2,
          paddingLeft: isTablet ? 2.25 : 1.5, 
          color:theme.palette.text.primary,
          cursor: currentUser ? 'pointer' : 'not-allowed',
          display: 'flex',
          justifyContent: isTablet ? 'center' : 'flex-start',
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
        <Avatar className="profile-avatar" sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
          {(clerkUser?.firstName?.charAt(0) ||
            currentUser?.username?.charAt(0) ||
            currentUser?.email?.charAt(0) ||
            'U').toUpperCase()}
        </Avatar>

        {!isTablet && (
          <Box sx={{ ml: 1, color:theme.palette.text.primary }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {clerkUser
                ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim()
                : currentUser?.username ||
                  currentUser?.email ||
                  'User'}
            </Typography>
            <Typography variant="caption" sx={{ color:theme.palette.text.secondary, paddingRight: "13pt"}}>
              {currentUser?.role || 'USER'}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      {/* FEATURES Section */}
      <Box sx={{ p: 1, flexGrow: 1 }}>
        {/* {!isCollapsed && (
          <Typography variant="caption" sx={{ px: 2, color: 'text.secondary', fontWeight: 'bold' }}>
            FEATURES
          </Typography>
        )} */}
        <List>
          <ListItem disablePadding>
            <ListItemButton
              href="/discovery"
              sx={{
                paddingLeft: isTablet ? 2.25 : 1.5 ,
                color: isActive('/discovery') ? '#e34714' : theme.palette.text.primary,
                backgroundColor: isActive('/discovery') ? 'rgba(227, 71, 20, 0.1)' : 'transparent',
                justifyContent: 'center',
                borderRadius:"5px",
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease, background-color 0.3s ease',                
                '& .MuiSvgIcon-root': {
                  color: isActive('/discovery') ? '#e34714' : theme.palette.text.primary,
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
                <ExploreIcon sx={{ color: theme.palette.text.primary }} />
              </ListItemIcon>
              {!isTablet && <ListItemText primary="Discovery" />}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              href="/search"
              sx={{
                paddingLeft: isTablet ? 2.25 : 1.5 ,
                color: isActive('/search') ? '#e34714' : theme.palette.text.primary,
                backgroundColor: isActive('/search') ? 'rgba(227, 71, 20, 0.1)' : 'transparent',
                justifyContent: 'center',
                borderRadius:"5px",
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease, background-color 0.3s ease',                
                '& .MuiSvgIcon-root': {
                  color: isActive('/search') ? '#e34714' : theme.palette.text.primary,
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
                <ManageSearchIcon sx={{ color: theme.palette.text.primary }} />
              </ListItemIcon>
              {!isTablet && <ListItemText primary="Search" />}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              href="/preferences"
              sx={{
                paddingLeft: isTablet ? 2.25 : 1.5 ,
                color: isActive('/preferences') ? '#e34714' : theme.palette.text.primary,
                backgroundColor: isActive('/preferences') ? 'rgba(227, 71, 20, 0.1)' : 'transparent',
                justifyContent: 'center',
                borderRadius:"5px",
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease, background-color 0.3s ease',                
                '& .MuiSvgIcon-root': {
                  color: isActive('/preferences') ? '#e34714' : theme.palette.text.primary,
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
                <SettingsAccessibilityIcon sx={{ color: theme.palette.text.primary }} />
              </ListItemIcon>
              {!isTablet && <ListItemText primary="Preferences" />}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
                component={Link}
                to="/savedrepos"
              sx={{
                paddingLeft: isTablet ? 2.25 : 1.5 ,
                color: isActive('/savedrepos') ? '#e34714' : theme.palette.text.primary,
                backgroundColor: isActive('/savedrepos') ? 'rgba(227, 71, 20, 0.1)' : 'transparent',
                justifyContent: 'center',
                borderRadius:"5px",
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease, background-color 0.3s ease',                
                '& .MuiSvgIcon-root': {
                  color: isActive('/savedrepos') ? '#e34714' : theme.palette.text.primary,
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
                <ChatIcon sx={{ color: theme.palette.text.primary, marginLeft:"2px" }} />
              </ListItemIcon>
              {!isTablet && <ListItemText primary="Saved Repos" />}
            </ListItemButton>
          </ListItem>
          {currentUser?.role === 'ADMIN' && (
            <ListItem disablePadding>
              <ListItemButton
                href="/admin"
                sx={{
                paddingLeft: isTablet ? 2.25 : 1.5 ,
                color: isActive('/admin') ? '#e34714' : 'white',
                backgroundColor: isActive('/admin') ? 'rgba(227, 71, 20, 0.1)' : 'transparent',
                justifyContent: 'center',
                borderRadius:"5px",
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease, background-color 0.3s ease',                
                '& .MuiSvgIcon-root': {
                  color: isActive('/admin') ? '#e34714' : theme.palette.text.primary,
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
                  <AdminIcon sx={{ color: theme.palette.text.primary }} />
                </ListItemIcon>
                {!isTablet && <ListItemText primary="Admin Dashboard" />}
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
    )}
    </>
  );
}