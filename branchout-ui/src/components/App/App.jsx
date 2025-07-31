import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "../UISwitch/ThemeContext.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import PreferencesPage from "/src/pages/PreferencesPage/PreferencesPage";
import DiscoveryPage from "/src/pages/DiscoveryPage/DiscoveryPage";
import LoginPage from "/src/pages/Login/LoginPage";
import SignupPage from "/src/pages/Signup/SignupPage";
import AuthComponent from "../../components/Auth/Auth";
import AdminDashboard from "../../pages/AdminDashboard/AdminDashboard"; // Fixed import path
import ProfilePage  from "../../pages/ProfilePage/ProfilePage";
import "./App.css";
import { ProtectedRoute, AdminRoute } from '../ProtectedRoute/ProtectedRoute';
import SideBar from "../../components/SideBar/SideBar";
import Footer from "../../components/Footer/Footer";
import SavedReposPage from "../../pages/SavedReposPage/SavedReposPage"; // Fixed import path
import PageNotFound from "../../pages/PageNotFoundPage/PageNotFoundPage.jsx";
import SettingsPage from "../../pages/Settings/SettingsPage.jsx"
import AboutPage from "../../pages/AboutPage/AboutPage.jsx"
import OnboardingSystem from "../../components/Onboarding/OnboardingSystem.jsx";

// const drawerWidth = 270;

// Layout wrapper for protected pages
const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'row' }}>
      <CssBaseline />
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  </ProtectedRoute>
);
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
      },
      background: {
        default: isDarkMode ? '#121212' : '#ffffff',
        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <OnboardingSystem />
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
         <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <SettingsPage />
              </ProtectedLayout>
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/about" 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AboutPage />
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
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ProfilePage />
              </ProtectedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/SavedRepos" 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <SavedReposPage />
              </ProtectedLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/discovery" replace />} />
        <Route path="*" element={<PageNotFound />} />
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