import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../UISwitch/ThemeContext.jsx";
import { Box, CssBaseline } from "@mui/material";
import PreferencesPage from "/src/pages/PreferencesPage/PreferencesPage";
import DiscoveryPage from "/src/pages/DiscoveryPage/DiscoveryPage";
import LoginPage from "/src/pages/Login/LoginPage";
import SignupPage from "/src/pages/Signup/SignupPage";
import AuthComponent from "../../components/Auth/Auth";
import AdminDashboard from "../../pages/AdminDashboard/AdminDashboard"; // Fixed import path
import ProfilePage  from "../../pages/ProfilePage/ProfilePage";
import "./App.css";
import { ProtectedRoute, AdminRoute, useAuth } from '../ProtectedRoute/ProtectedRoute';
import SideBar from "../../components/SideBar/SideBar";
import Footer from "../../components/Footer/Footer";
import SavedReposPage from "../../pages/SavedReposPage/SavedReposPage"; // Fixed import path
import PageNotFound from "../../pages/PageNotFoundPage/PageNotFoundPage.jsx";
import SettingsPage from "../../pages/Settings/SettingsPage.jsx"
import AboutPage from "../../pages/AboutPage/AboutPage.jsx"
import OnboardingSystem from "../../components/Onboarding/OnboardingSystem.jsx";
import HomePage from "../../pages/HomePage/HomePage.jsx"
import SearchPage from "../../pages/SearchPage/SearchPage.jsx";

// const drawerWidth = 270;

// Layout wrapper for protected pages
const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <OnboardingSystem />

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
  const { isDarkMode } = useContext(ThemeContext);
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;

  return (
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
          path="/search" 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <SearchPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }   
        />
        <Route 
          path="/home" 
          element={
            // no protected route bc anyone can access
            !isAuthenticated ? <HomePage/> : <Navigate to = "/discovery" replace />
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
          path="/savedrepos" 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <SavedReposPage />
              </ProtectedLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirects */}
        <Route path="/" element={!isAuthenticated ? (<HomePage/>) : (<Navigate to="/discovery" replace />)}/>
        <Route path="*" element={<PageNotFound />} />
        </Routes>
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