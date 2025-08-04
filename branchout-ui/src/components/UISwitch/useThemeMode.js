import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeMode must be used within a CustomThemeProvider");
  return context;
};

export default useThemeMode;
