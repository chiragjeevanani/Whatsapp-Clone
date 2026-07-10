import React, { useState, useEffect } from "react";
import { Bell, Search, ShieldAlert, Sun, Moon } from "lucide-react";

export default function Topbar({ title }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Sync theme on mount from localStorage
    const savedTheme = localStorage.getItem("admin-theme") || "dark";
    setTheme(savedTheme);
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("admin-theme", nextTheme);
    
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card/85 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30 w-full select-none transition-colors duration-200">
      {/* Navigation Title / Directory Path */}
      <div className="flex items-center gap-2">
        <h1 className="font-semibold text-base text-foreground tracking-tight">{title}</h1>
      </div>

      {/* Action Utilities (Search, Alerts, Notifications, Theme, Profile) */}
      <div className="flex items-center gap-4">
        {/* Universal Search Bar */}
        <div className="relative w-64 max-w-xs md:block hidden">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search system records..." 
            className="w-full bg-secondary border border-border rounded-full pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Toggle Theme Mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>
          
          <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer relative" aria-label="System Alerts">
            <ShieldAlert className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
          </button>
          <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer" aria-label="Notifications">
            <Bell className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-border"></div>

        {/* User Session Profile details */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center border border-border shadow-sm">
            <span className="font-bold text-xs text-primary">AD</span>
          </div>
          <div className="flex flex-col text-left justify-center md:block hidden">
            <span className="text-xs font-semibold block text-foreground leading-tight">Admin Principal</span>
            <span className="text-[10px] text-muted-foreground font-medium leading-none">Super Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
