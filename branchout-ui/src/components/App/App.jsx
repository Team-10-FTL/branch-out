import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useTheme } from "../UISwitch/ThemeContext.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PreferencesPage from "/src/pages/PreferencesPage";
import DiscoveryPage from "/src/pages/DiscoveryPage";
import LoginPage from "/src/pages/Login/LoginPage";
import SignupPage from "/src/pages/Signup/SignupPage";
import AuthComponent from "../../components/Auth/Auth";
import "./App.css";

function AppContent() {
  const { isDarkMode } = useTheme(); // ✅ Access dark mode state

  const muiTheme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light", // ✅ Dynamic theme
      primary: {
        main: isDarkMode ? "#ffffff" : "#000000",
      },
      text: {
        primary: isDarkMode ? "#ffffff" : "#000000",
      },
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      {/* <div className="auth">
        <AuthComponent />
      </div> */}

      {/* <nav>
        <Link to="/">Discovery Page</Link> |{" "}
        <Link to="/preferences">Preferences</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<DiscoveryPage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/login" element={<AuthComponent isSignUp={false} />} />
        <Route path="/signup" element={<AuthComponent isSignUp={true} />} />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <AppContent />
      </Router>
    </>
  );
}

export default App;
