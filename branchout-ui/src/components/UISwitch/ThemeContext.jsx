// src/contexts/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const CustomThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme) {
        setIsDarkMode(JSON.parse(savedTheme));
    }
}, []);

// Save theme to localStorage when it changes
useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply theme to body element
    if (isDarkMode) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    }
}, [isDarkMode]);

const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
};

return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
    {children}
    </ThemeContext.Provider>
);
};