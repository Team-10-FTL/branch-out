import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "../UISwitch/ThemeContext.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import PreferencesPage from "/src/pages/PreferencesPage";
import DiscoveryPage from "/src/pages/DiscoveryPage";
import LoginPage from "/src/pages/Login/LoginPage";
import SignupPage from "/src/pages/Signup/SignupPage";
import AuthComponent from "../../components/Auth/Auth";
import AdminDashboard from "../../pages/AdminDashboard/AdminDashboard"; // Fixed import path
import "./App.css";
import { ProtectedRoute, AdminRoute } from '../ProtectedRoute/ProtectedRoute';
import SideBar from "../../components/SideBar/SideBar";

const drawerWidth = 270;

// Layout wrapper for protected pages
const ProtectedLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <SideBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
function AppContent() {
  const { isDarkMode } = useTheme();

  
  // Create theme based on the context
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: isDarkMode ? '#121212' : '#ffffff',
        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <SideBar />
      <Routes>
        {/* Public routes - no sidebar */}
        <Route path="/login" element={<AuthComponent />} />
        <Route path="/signup" element={<AuthComponent />} />
        
        {/* Protected routes - with sidebar */}
        <Route 
          path="/discovery" 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <DiscoveryPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }   
        />
        <Route 
          path="/preferences" 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <PreferencesPage />
              </ProtectedLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Admin routes - with sidebar */}
        <Route 
          path="/admin/*" 
          element={
            <AdminRoute>
              <ProtectedLayout>
                <AdminDashboard />
              </ProtectedLayout>
            </AdminRoute>
          } 
        />
        
        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/discovery" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <>
      <Router>
        <AppContent />
      </Router>
    </>
  );
}

export default App;