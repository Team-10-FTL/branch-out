import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "../UISwitch/ThemeContext.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PreferencesPage from "/src/pages/PreferencesPage";
import DiscoveryPage from "/src/pages/DiscoveryPage";
import LoginPage from "/src/pages/Login/LoginPage";
import SignupPage from "/src/pages/Signup/SignupPage";
import AuthComponent from "../../components/Auth/Auth";
import AdminDashboard from "../../pages/AdminDashboard/AdminDashboard"; // Fixed import path
import "./App.css";
import { ProtectedRoute, AdminRoute } from '../ProtectedRoute/ProtectedRoute';
import SideBar from "../../components/SideBar/SideBar"; // Fixed import path

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
      <SideBar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<AuthComponent />} />
        <Route path="/signup" element={<AuthComponent />} />
        
        {/* Protected routes */}
        <Route 
          path="/discovery" 
          element={
            <ProtectedRoute>
              <DiscoveryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/preferences" 
          element={
            <ProtectedRoute>
              <PreferencesPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin routes */}
        <Route 
          path="/admin/*" 
          element={
            <AdminRoute>
              <AdminDashboard />
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