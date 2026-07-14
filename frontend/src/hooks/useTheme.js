"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (storedTheme) {
      document.cookie = `theme=${storedTheme}; path=/; max-age=31536000`;
    }

    // Determine initial state from document element class
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    // Watch for class changes on documentElement to sync theme across different components
    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDarkNow);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    if (nextDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
      document.cookie = "theme=dark; path=/; max-age=31536000";
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      document.cookie = "theme=light; path=/; max-age=31536000";
    }
    setIsDarkMode(nextDark);
  };

  return { isDarkMode, toggleTheme };
}
