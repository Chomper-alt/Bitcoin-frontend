
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const applyThemeToDocument = (newTheme) => {
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const setTheme = (newTheme) => {
    setThemeState((currentTheme) => {
      if (currentTheme === newTheme) return currentTheme;
      return newTheme;
    });

    localStorage.setItem("theme", newTheme);
    requestAnimationFrame(() => applyThemeToDocument(newTheme));
  };

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
;
