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
        <AppBar position = "fixed" sx={{ bgcolor: 'black', zIndex:1300, boxShadow: 'none', backgroundImage:"none",
    borderBottom: '1px solid rgba(169, 81, 19, 0.6)'}}>
            <Toolbar sx={{ justifyContent: 'space-between', px: 2, minHeight: '64px !important' }}>
              <img 
                src={miniLogo} 
                alt="logo" 
                style={{ width: 30, cursor: 'pointer' }}
              />
              <IconButton onClick={handleMenuOpen} sx={{ color: 'white'}}>
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
          sx={{
            '& .MuiPaper-root': {
              marginTop: 1,
              minWidth: 160,
              backgroundColor:"black",
            }
          }}
        >
          <MenuItem onClick={() => { handleMenuClose(); navigate('/profile')}} sx = {{color: isActive("/profile") ? "#e34714" : "white"}}>
            <PersonIcon sx={{ mr: 2}} />
            Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { handleMenuClose(); navigate('/discovery'); }}sx = {{color: isActive("/discovery") ? "#e34714" : "white"}}>
            <ExploreIcon sx={{ mr: 2}} />
            Discovery
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { handleMenuClose(); navigate('/search'); }}sx = {{color: isActive("/search") ? "#e34714" : "white"}}>
            <ManageSearchIcon sx={{ mr: 2}} />
            Search
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { handleMenuClose(); navigate('/preferences'); }}sx = {{color: isActive("/preferences") ? "#e34714" : "white"}}>
            <SettingsAccessibilityIcon sx={{ mr: 2}} />
            Preferences
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { handleMenuClose(); navigate('/savedrepos'); }}sx = {{color: isActive("/savedrepos") ? "#e34714" : "white"}}>
            <ChatIcon sx={{ mr: 2}} />
            Saved Repos
          </MenuItem>
          
          {/* <MenuItem onClick={async() => { handleMenuClose(); await signOut();navigate("/signup") }}>
            <InfoIcon sx={{ mr: 2 }} />
            Logout
          </MenuItem> */}
          {currentUser?.role === 'ADMIN' && (
            <MenuItem onClick={() => { handleMenuClose(); navigate('/admin'); }}>
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
          backgroundColor: 'black',
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
          color: 'white',
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
        <Avatar className="profile-avatar" sx={{ width: 32, height: 32, bgcolor: '#daa7e2' }}>
          {(clerkUser?.firstName?.charAt(0) ||
            currentUser?.username?.charAt(0) ||
            currentUser?.email?.charAt(0) ||
            'U').toUpperCase()}
        </Avatar>
        {!isTablet && (
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
                color: isActive('/discovery') ? '#e34714' : 'white',
                backgroundColor: isActive('/discovery') ? 'rgba(227, 71, 20, 0.1)' : 'transparent',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease, background-color 0.3s ease',                
                '& .MuiSvgIcon-root': {
                  color: isActive('/discovery') ? '#e34714' : 'white',
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
                <ExploreIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              {!isTablet && <ListItemText primary="Discovery" />}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              href="/search"
              sx={{
                paddingLeft: isTablet ? 2.25 : 1.5 ,
                color: isActive('/search') ? '#e34714' : 'white',
                backgroundColor: isActive('/search') ? 'rgba(227, 71, 20, 0.1)' : 'transparent',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease, background-color 0.3s ease',                
                '& .MuiSvgIcon-root': {
                  color: isActive('/search') ? '#e34714' : 'white',
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
                <ManageSearchIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              {!isTablet && <ListItemText primary="Search" />}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              href="/preferences"
              sx={{
                paddingLeft: isTablet ? 2.25 : 1.5 ,
                color: isActive('/preferences') ? '#e34714' : 'white',
                backgroundColor: isActive('/preferences') ? 'rgba(227, 71, 20, 0.1)' : 'transparent',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease, background-color 0.3s ease',                
                '& .MuiSvgIcon-root': {
                  color: isActive('/preferences') ? '#e34714' : 'white',
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
                <SettingsAccessibilityIcon sx={{ color: 'white' }} />
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
                color: isActive('/savedrepos') ? '#e34714' : 'white',
                backgroundColor: isActive('/savedrepos') ? 'rgba(227, 71, 20, 0.1)' : 'transparent',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease, background-color 0.3s ease',                
                '& .MuiSvgIcon-root': {
                  color: isActive('/savedrepos') ? '#e34714' : 'white',
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
                <ChatIcon sx={{ color: 'white', marginLeft:"2px" }} />
              </ListItemIcon>
              {!isTablet && <ListItemText primary="Saved Repos" />}
            </ListItemButton>
          </ListItem>
          {/* NAVIGATION Section */}
        {/* {!isCollapsed && (
          <Typography 
            variant="caption"
            sx={{ px: 2, color: 'text.secondary', fontWeight: 'bold', mb:1}}>
            NAVIGATION
          </Typography>
        )} */}
          {/* <ListItem disablePadding>
            <ListItemButton
              href="/about"
              sx={{
                paddingLeft: isTablet ? 2.25 : 1.5 ,
                color: isActive('/about') ? '#e34714' : 'white',
                backgroundColor: isActive('/about') ? 'rgba(227, 71, 20, 0.1)' : 'transparent',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease, background-color 0.3s ease',                
                '& .MuiSvgIcon-root': {
                  color: isActive('/about') ? '#e34714' : 'white',
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
                <InfoIcon sx={{ color: 'white' }} />
              </ListItemIcon>
                {!isTablet && <ListItemText primary="About" />}
              </ListItemButton>
            </ListItem> */}
          {/* Admin Dashboard - only show if user is admin */}
          {currentUser?.role === 'ADMIN' && (
            <ListItem disablePadding>
              <ListItemButton
                href="/admin"
                sx={{
                paddingLeft: isTablet ? 2.25 : 1.5 ,
                color: isActive('/admin') ? '#e34714' : 'white',
                backgroundColor: isActive('/admin') ? 'rgba(227, 71, 20, 0.1)' : 'transparent',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease, background-color 0.3s ease',                
                '& .MuiSvgIcon-root': {
                  color: isActive('/admin') ? '#e34714' : 'white',
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
                {!isTablet && <ListItemText primary="Admin Dashboard" />}
              </ListItemButton>
            </ListItem>
          )}
          {/* <ListItem disablePadding>
            <ListItemButton
              sx={{
                paddingLeft: isTablet ? 2.25 : 1.5 ,
                color: isActive('/history') ? '#e34714' : 'white',
                backgroundColor: isActive('/history') ? 'rgba(227, 71, 20, 0.1)' : 'transparent',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease, background-color 0.3s ease',                
                '& .MuiSvgIcon-root': {
                  color: isActive('/history') ? '#e34714' : 'white',
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
              {!isTablet && <ListItemText primary="History" />}
            </ListItemButton>
          </ListItem> */}
          {/* <ListItem disablePadding>
            <ListItemButton
              onClick ={() => navigate("/settings")}
              sx={{
                paddingLeft: isTablet ? 2.25 : 1.5 ,
                color: isActive('/settings') ? '#e34714' : 'white',
                backgroundColor: isActive('/settings') ? 'rgba(227, 71, 20, 0.1)' : 'transparent',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease, background-color 0.3s ease',                
                '& .MuiSvgIcon-root': {
                  color: isActive('/settings') ? '#e34714' : 'white',
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
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', display: 'flex', paddingBottom:"3px", paddingRight:"5px" }}>
                <SettingsIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              {!isTablet && <ListItemText primary="Settings" />}
            </ListItemButton>
          </ListItem> */}
        </List>
      </Box>
    </Drawer>
    )}
    </>
  );
}