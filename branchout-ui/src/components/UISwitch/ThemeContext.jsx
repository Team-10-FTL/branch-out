import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeContext = createContext();

const CustomThemeProvider = ({ children }) => {
  const getInitialMode = () => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [isDarkMode, setIsDarkMode] = useState(getInitialMode);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.body.classList.toggle('light-mode', !isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          ...(isDarkMode
            ? {
                background: { default: '#0f0e0eff', paper: '#111', sideBar:"black" },
                text: { primary: '#fff', secondary: "#827b82ff" },
                primary: { main: '#e34714' },
                secondary: { main: '#daa7e2' },
                warning: { main: '#e34714' },
                savedRepo:{main: "#252525ff"}
              }
            : {
                background: { default: '#ffffff', paper: '#f5f5f5', sideBar:"#ffffffff" },
                text: { primary: '#000000', secondary: "#524c52ff" },
                primary: { main: '#e37106' },
                secondary: { main: '#4c1255' },
                warning: { main: '#e34714' },
                savedRepo:{main: "#d1cfcfff"}
              }),
        },
      }),
    [isDarkMode]
  );

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default CustomThemeProvider;