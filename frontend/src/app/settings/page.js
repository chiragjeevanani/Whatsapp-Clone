"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

export default function SettingsPage() {
  const router = useRouter();
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Sub-page navigation: null = main list, "account", "privacy", "lists", "chats", "broadcasts", "notifications"
  const [subPage, setSubPage] = useState(null);

  // Profile edit states
  const [displayName, setDisplayName] = useState("Chirag🍻");
  const [username, setUsername] = useState("@Chiragjeevanani");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("Chirag🍻");
  const [editUser, setEditUser] = useState("@Chiragjeevanani");

  // Scroll detection to morph top header in main list
  const [scrolled, setScrolled] = useState(false);

  // --- Settings Sub-page Toggle States ---
  // Privacy
  const [cameraEffects, setCameraEffects] = useState(true);
  // Chats settings
  const [enterIsSend, setEnterIsSend] = useState(false);
  const [mediaVisibility, setMediaVisibility] = useState(true);
  const [keepArchived, setKeepArchived] = useState(true);
  // Notifications settings
  const [conversationTones, setConversationTones] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [highPriority, setHighPriority] = useState(true);
  const [reactionNotifications, setReactionNotifications] = useState(true);
  // Storage and data settings
  const [lessDataForCalls, setLessDataForCalls] = useState(true);

  useEffect(() => {
    // Sync dark mode on load
    setIsDarkMode(document.documentElement.classList.contains("dark"));

    const handleScroll = () => {
      if (window.scrollY > 150) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleEditProfileSubmit = (e) => {
    e.preventDefault();
    if (editName.trim()) {
      setDisplayName(editName.trim());
      setUsername(editUser.trim().startsWith("@") ? editUser.trim() : `@${editUser.trim()}`);
      setShowEditModal(false);
    }
  };

  // Main settings list
  const settingsList = [
    { name: "Account", subtitle: "Security notifications, change number", icon: "key" },
    { name: "Privacy", subtitle: "Blocked accounts, disappearing messages", icon: "lock" },
    { name: "Lists", subtitle: "Manage people and groups", icon: "contact_phone" },
    { name: "Chats", subtitle: "Theme, wallpapers, chat history", icon: "chat" },
    { name: "Appearance", subtitle: "Chat theme, app icon, app theme", icon: "palette" },
    { name: "Broadcasts", subtitle: "Manage lists and send broadcasts", icon: "podcasts" },
    { name: "Notifications", subtitle: "Message, group & call tones", icon: "notifications" },
    { name: "Storage and data", subtitle: "Network usage, auto-download", icon: "data_usage" },
    { name: "Help and feedback", subtitle: "Help centre, contact us, privacy policy", icon: "help" },
    { name: "Invite a friend", subtitle: null, icon: "group" },
    { name: "App updates", subtitle: null, icon: "system_update_alt" },
  ];

  // ==========================================
  // SUB-PAGES RENDERING
  // ==========================================

  // 1. ACCOUNT SUB-PAGE
  if (subPage === "account") {
    return (
      <div className="w-full bg-[#f8f9fa] dark:bg-[#0b141a] text-[#1c2e35] dark:text-[#e9edef] antialiased min-h-screen flex flex-col pb-24 font-sans select-none transition-colors duration-200">
        <header className="sticky top-0 z-40 px-4 py-3.5 flex items-center bg-white dark:bg-[#111b21] border-b border-zinc-100 dark:border-[#222d34] shadow-sm">
          <button 
            onClick={() => setSubPage(null)}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 transition-transform text-zinc-700 dark:text-white cursor-pointer mr-4"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[25px]">arrow_back</span>
          </button>
          <h2 className="text-[19px] font-bold text-[#111b21] dark:text-white">Account</h2>
        </header>

        <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto bg-white dark:bg-[#0b141a] py-3">
          <div 
            onClick={() => {
              if (confirm("Are you sure you want to log out?")) {
                router.push("/login");
              }
            }}
            className="flex items-center px-5 py-4 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer transition-colors border-b border-zinc-100/70 dark:border-[#222d34]/40"
          >
            <div className="w-[38px] h-[38px] flex items-center justify-start text-zinc-600 dark:text-zinc-400 shrink-0 mr-1.5">
              <span className="material-symbols-outlined text-[24px]">logout</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-medium text-[#111b21] dark:text-[#e9edef]">Log out</span>
              <span className="text-[12.5px] text-zinc-400 dark:text-zinc-500 mt-0.5">Exit your current session on this device</span>
            </div>
          </div>

          <div 
            onClick={() => {
              if (confirm("WARNING: This will permanently delete your account and all associated data. Are you sure you want to proceed?")) {
                router.push("/login");
              }
            }}
            className="flex items-center px-5 py-4 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer transition-colors text-red-500 dark:text-red-400"
          >
            <div className="w-[38px] h-[38px] flex items-center justify-start text-red-500 dark:text-red-400 shrink-0 mr-1.5">
              <span className="material-symbols-outlined text-[24px] text-red-500 dark:text-red-400">delete_forever</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-red-500 dark:text-red-400">Delete account</span>
              <span className="text-[12.5px] text-red-400 dark:text-red-400/80 mt-0.5">Permanently erase your chat logs, groups, and settings</span>
            </div>
          </div>
        </main>
        <Navigation activeTab="settings" />
      </div>
    );
  }

  // 2. PRIVACY SUB-PAGE
  if (subPage === "privacy") {
    return (
      <div className="w-full bg-[#f8f9fa] dark:bg-[#0b141a] text-[#1c2e35] dark:text-[#e9edef] antialiased min-h-screen flex flex-col pb-24 font-sans select-none transition-colors duration-200">
        <header className="sticky top-0 z-40 px-4 py-3.5 flex items-center bg-white dark:bg-[#111b21] border-b border-zinc-100 dark:border-[#222d34] shadow-sm">
          <button 
            onClick={() => setSubPage(null)}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 transition-transform text-zinc-700 dark:text-white cursor-pointer mr-4"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[25px]">arrow_back</span>
          </button>
          <h2 className="text-[19px] font-bold text-[#111b21] dark:text-white">Privacy</h2>
        </header>

        <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto bg-white dark:bg-[#0b141a] py-3 overflow-y-auto">
          {/* Default Message Timer */}
          <div className="flex justify-between items-center px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer">
            <div className="flex flex-col min-w-0 pr-4">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Default message timer</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Start new chats with disappearing messages set to your timer</span>
            </div>
            <span className="text-[14px] text-zinc-400 dark:text-zinc-500 font-semibold shrink-0">Off</span>
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-5 my-1"></div>

          {/* Groups */}
          <div className="flex flex-col px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer">
            <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Groups</span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">Everyone</span>
          </div>

          {/* Avatar Stickers */}
          <div className="flex flex-col px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer">
            <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Avatar stickers</span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">My contacts</span>
          </div>

          {/* Live Location */}
          <div className="flex flex-col px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer">
            <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Live location</span>
          </div>

          {/* Calls */}
          <div className="flex flex-col px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer">
            <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Calls</span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">Silence unknown callers</span>
          </div>

          {/* Blocked Contacts */}
          <div className="flex flex-col px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer">
            <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Contacts</span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">Blocked accounts, WhatsApp contacts</span>
          </div>

          {/* App Lock */}
          <div className="flex flex-col px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer">
            <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">App lock</span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">Disabled</span>
          </div>

          {/* Chat Lock */}
          <div className="flex flex-col px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer">
            <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Chat lock</span>
          </div>

          {/* Allow Camera Effects Toggle */}
          <div className="flex justify-between items-center px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer">
            <div className="flex flex-col min-w-0 pr-4">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Allow camera effects</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Use effects in the camera and video calls. <span className="text-[#00a884] dark:text-[#ff2d55] font-semibold cursor-pointer">Learn more</span>
              </span>
            </div>
            
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
              <input 
                type="checkbox" 
                checked={cameraEffects} 
                onChange={(e) => setCameraEffects(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a884] dark:peer-checked:bg-[#ff2d55]"></div>
            </label>
          </div>

          {/* Advanced */}
          <div className="flex flex-col px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer">
            <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Advanced</span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">Protect IP address in calls, Disable link previews</span>
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-5 my-1"></div>

          {/* Privacy Checkup Banner */}
          <div className="flex flex-col px-5 py-4 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer bg-zinc-50/50 dark:bg-[#111b21]/10 rounded-xl m-4 border border-zinc-100 dark:border-zinc-800/80">
            <span className="text-[15.5px] font-bold text-[#111b21] dark:text-white">Privacy checkup</span>
            <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Control your privacy and choose the right settings for you.</span>
          </div>
        </main>
        <Navigation activeTab="settings" />
      </div>
    );
  }

  // 3. LISTS SUB-PAGE
  if (subPage === "lists") {
    return (
      <div className="w-full bg-[#f8f9fa] dark:bg-[#0b141a] text-[#1c2e35] dark:text-[#e9edef] antialiased min-h-screen flex flex-col pb-24 font-sans select-none transition-colors duration-200">
        <header className="sticky top-0 z-40 px-4 py-3.5 flex justify-between items-center bg-white dark:bg-[#111b21] border-b border-zinc-100 dark:border-[#222d34] shadow-sm">
          <div className="flex items-center min-w-0">
            <button 
              onClick={() => setSubPage(null)}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 transition-transform text-zinc-700 dark:text-white cursor-pointer mr-4"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[25px]">arrow_back</span>
            </button>
            <h2 className="text-[19px] font-bold text-[#111b21] dark:text-white">Lists</h2>
          </div>
          <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-[24px]">edit</span>
          </button>
        </header>

        <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto bg-white dark:bg-[#0b141a] overflow-y-auto">
          {/* Top Illustration Area */}
          <div className="flex flex-col items-center justify-center py-8 px-8 text-center bg-zinc-50/50 dark:bg-zinc-800/10 border-b border-zinc-100 dark:border-[#222d34]">
            {/* Custom vector illustration of overlapping pills */}
            <div className="flex justify-center items-center gap-1.5 mb-5 select-none scale-110">
              <div className="w-14 h-14 rounded-full bg-[#e6f5ef] dark:bg-[#ff2d55]/15 border border-[#00a884]/20 flex items-center justify-center text-[#00a884] dark:text-[#ff2d55] shadow-sm transform -rotate-12 translate-x-4">
                <span className="material-symbols-outlined text-[28px] fill">favorite</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-emerald-100/70 dark:bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm z-10">
                <span className="material-symbols-outlined text-[28px] fill">work</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-[#e6f5ef] dark:bg-[#ff2d55]/15 border border-[#00a884]/20 flex items-center justify-center text-[#00a884] dark:text-[#ff2d55] shadow-sm transform rotate-12 -translate-x-4">
                <span className="material-symbols-outlined text-[28px] font-bold">add</span>
              </div>
            </div>

            <p className="text-[13.5px] text-zinc-500 dark:text-zinc-400 font-medium max-w-xs leading-normal mb-5">
              Any list you create becomes a filter at the top of your Chats tab.
            </p>

            {/* Create list pill button */}
            <button className="bg-[#e6f5ef] dark:bg-[#ff2d55]/15 text-[#008069] dark:text-[#ff2d55] font-bold text-[14.5px] px-6 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-transform flex items-center gap-2 cursor-pointer shadow-sm border border-[#008069]/10 dark:border-[#ff2d55]/10">
              <span className="material-symbols-outlined text-[20px] font-bold">add</span>
              Create a custom list
            </button>
          </div>

          {/* Section: Your Lists */}
          <div className="px-5 py-4">
            <h3 className="text-[13.5px] font-bold text-[#008069] dark:text-[#ff2d55] uppercase tracking-wider mb-2">Your lists</h3>
            
            {/* Unread */}
            <div className="flex flex-col py-3.5 border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:opacity-80">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Unread</span>
              <span className="text-[12.5px] text-zinc-400 dark:text-zinc-500 mt-0.5">Preset</span>
            </div>

            {/* Favourites */}
            <div className="flex flex-col py-3.5 border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:opacity-80">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Favourites</span>
              <span className="text-[12.5px] text-zinc-400 dark:text-zinc-500 mt-0.5">Add people or groups</span>
            </div>

            {/* Groups */}
            <div className="flex flex-col py-3.5 cursor-pointer hover:opacity-80">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Groups</span>
              <span className="text-[12.5px] text-zinc-400 dark:text-zinc-500 mt-0.5">Preset</span>
            </div>
          </div>

          <div className="h-2 bg-[#f8f9fa] dark:bg-[#111b21]/50 border-t border-b border-zinc-100 dark:border-zinc-800/80"></div>

          {/* Section: Available Presets */}
          <div className="px-5 py-4">
            <h3 className="text-[13.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Available presets</h3>
            
            <div className="flex justify-between items-center py-3">
              <div className="flex flex-col min-w-0 pr-4">
                <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Communities</span>
                <span className="text-[12.5px] text-zinc-400 dark:text-zinc-500 mt-0.5">Preset</span>
              </div>
              <button className="bg-[#e6f5ef] dark:bg-[#ff2d55]/15 text-[#008069] dark:text-[#ff2d55] font-bold text-[13px] px-4 py-1.5 rounded-full hover:opacity-90 active:scale-95 transition-transform cursor-pointer border border-[#008069]/10">
                Add
              </button>
            </div>
          </div>
        </main>
        <Navigation activeTab="settings" />
      </div>
    );
  }

  // 4. CHATS SUB-PAGE
  if (subPage === "chats") {
    return (
      <div className="w-full bg-[#f8f9fa] dark:bg-[#0b141a] text-[#1c2e35] dark:text-[#e9edef] antialiased min-h-screen flex flex-col pb-24 font-sans select-none transition-colors duration-200">
        <header className="sticky top-0 z-40 px-4 py-3.5 flex items-center bg-white dark:bg-[#111b21] border-b border-zinc-100 dark:border-[#222d34] shadow-sm">
          <button 
            onClick={() => setSubPage(null)}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 transition-transform text-zinc-700 dark:text-white cursor-pointer mr-4"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[25px]">arrow_back</span>
          </button>
          <h2 className="text-[19px] font-bold text-[#111b21] dark:text-white">Chats</h2>
        </header>

        <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto bg-white dark:bg-[#0b141a] py-3 overflow-y-auto">
          {/* Section: Display */}
          <div className="px-5 py-2">
            <h3 className="text-[13.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Display</h3>
            
            {/* Theme */}
            <div 
              onClick={toggleTheme}
              className="flex justify-between items-center py-3.5 hover:opacity-85 cursor-pointer"
            >
              <div className="flex items-center min-w-0">
                <span className="material-symbols-outlined text-[22px] text-zinc-400 mr-4">brightness_medium</span>
                <div className="flex flex-col">
                  <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Theme</span>
                  <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {isDarkMode ? "Dark" : "Light (System default)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Default Chat Theme */}
            <div className="flex items-center py-3.5 hover:opacity-85 cursor-pointer">
              <span className="material-symbols-outlined text-[22px] text-zinc-400 mr-4">palette</span>
              <div className="flex flex-col">
                <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Default chat theme</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-5 my-2"></div>

          {/* Section: Chat settings */}
          <div className="px-5 py-2">
            <h3 className="text-[13.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Chat settings</h3>
            
            {/* Enter is Send */}
            <div className="flex justify-between items-center py-3.5 hover:opacity-85 cursor-pointer">
              <div className="flex flex-col min-w-0 pr-4">
                <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Enter is send</span>
                <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Enter key will send your message</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                <input 
                  type="checkbox" 
                  checked={enterIsSend} 
                  onChange={(e) => setEnterIsSend(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a884] dark:peer-checked:bg-[#ff2d55]"></div>
              </label>
            </div>

            {/* Media Visibility */}
            <div className="flex justify-between items-center py-3.5 hover:opacity-85 cursor-pointer">
              <div className="flex flex-col min-w-0 pr-4">
                <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Media visibility</span>
                <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Show newly downloaded media in your device's gallery</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                <input 
                  type="checkbox" 
                  checked={mediaVisibility} 
                  onChange={(e) => setMediaVisibility(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a884] dark:peer-checked:bg-[#ff2d55]"></div>
              </label>
            </div>

            {/* Font Size */}
            <div className="flex flex-col py-3.5 hover:opacity-85 cursor-pointer">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Font size</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Medium</span>
            </div>

            {/* Voice transcripts */}
            <div className="flex flex-col py-3.5 hover:opacity-85 cursor-pointer">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Voice message transcripts</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Read new voice messages.</span>
            </div>
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-5 my-2"></div>

          {/* Section: Archived chats */}
          <div className="px-5 py-2">
            <h3 className="text-[13.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Archived chats</h3>
            
            <div className="flex justify-between items-center py-3.5 hover:opacity-85 cursor-pointer">
              <div className="flex flex-col min-w-0 pr-4">
                <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Keep chats archived</span>
                <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Archived chats will remain archived when you receive a new message</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                <input 
                  type="checkbox" 
                  checked={keepArchived} 
                  onChange={(e) => setKeepArchived(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a884] dark:peer-checked:bg-[#ff2d55]"></div>
              </label>
            </div>
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-5 my-2"></div>

          {/* List Options */}
          <div className="px-5 py-2 flex flex-col gap-4">
            <div className="flex items-center hover:opacity-85 cursor-pointer">
              <span className="material-symbols-outlined text-[23px] text-zinc-400 mr-4">cloud_upload</span>
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Chat backup</span>
            </div>
            <div className="flex items-center hover:opacity-85 cursor-pointer">
              <span className="material-symbols-outlined text-[23px] text-zinc-400 mr-4">phone_iphone</span>
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Transfer chats</span>
            </div>
            <div className="flex items-center hover:opacity-85 cursor-pointer">
              <span className="material-symbols-outlined text-[23px] text-zinc-400 mr-4">history</span>
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Chat history</span>
            </div>
          </div>
        </main>
        <Navigation activeTab="settings" />
      </div>
    );
  }

  // 5. BROADCASTS SUB-PAGE
  if (subPage === "broadcasts") {
    return (
      <div className="w-full bg-[#f8f9fa] dark:bg-[#0b141a] text-[#1c2e35] dark:text-[#e9edef] antialiased min-h-screen flex flex-col pb-24 font-sans select-none transition-colors duration-200">
        <header className="sticky top-0 z-40 px-4 py-3.5 flex items-center bg-white dark:bg-[#111b21] border-b border-zinc-100 dark:border-[#222d34] shadow-sm">
          <button 
            onClick={() => setSubPage(null)}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 transition-transform text-zinc-700 dark:text-white cursor-pointer mr-4"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[25px]">arrow_back</span>
          </button>
          <h2 className="text-[19px] font-bold text-[#111b21] dark:text-white">Broadcasts</h2>
        </header>

        <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto bg-white dark:bg-[#0b141a] py-4 relative">
          {/* Monthly Statistics Card */}
          <div className="mx-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/10 border border-zinc-100 dark:border-zinc-800/80 shadow-none">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[14px] font-bold text-[#111b21] dark:text-white">This month</span>
              <span className="text-[12px] text-zinc-400 dark:text-zinc-500 font-semibold">01 Jul - 31 Jul</span>
            </div>

            <div className="flex justify-between items-end mb-3">
              <div className="flex flex-col">
                <span className="text-[28px] font-black text-[#111b21] dark:text-white leading-none">0</span>
                <span className="text-[11.5px] text-zinc-400 dark:text-zinc-500 font-bold uppercase mt-1">Sent</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[28px] font-black text-[#111b21] dark:text-white leading-none">35</span>
                <span className="text-[11.5px] text-zinc-400 dark:text-zinc-500 font-bold uppercase mt-1">Remaining</span>
              </div>
            </div>

            {/* Gray progress bar */}
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-[#00a884] dark:bg-[#ff2d55] h-full w-0 rounded-full"></div>
            </div>

            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 mt-3 font-medium">
              Send up to 35 broadcasts per month. <span className="text-[#00a884] dark:text-[#ff2d55] font-bold cursor-pointer hover:underline">Learn more</span>
            </p>
          </div>

          {/* Empty State Centered message */}
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined text-[64px] text-zinc-300 dark:text-zinc-700/80 mb-2">podcasts</span>
            <span className="text-[15px] font-semibold text-zinc-400 dark:text-zinc-500">No broadcasts</span>
          </div>

          {/* Float Action Button (FAB) */}
          <button className="absolute bottom-6 right-6 w-[54px] h-[54px] rounded-full bg-[#00a884] dark:bg-[#ff2d55] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-[26px]">add</span>
          </button>
        </main>
        <Navigation activeTab="settings" />
      </div>
    );
  }

  // 6. NOTIFICATIONS SUB-PAGE
  if (subPage === "notifications") {
    return (
      <div className="w-full bg-[#f8f9fa] dark:bg-[#0b141a] text-[#1c2e35] dark:text-[#e9edef] antialiased min-h-screen flex flex-col pb-24 font-sans select-none transition-colors duration-200">
        <header className="sticky top-0 z-40 px-4 py-3.5 flex justify-between items-center bg-white dark:bg-[#111b21] border-b border-zinc-100 dark:border-[#222d34] shadow-sm">
          <div className="flex items-center min-w-0">
            <button 
              onClick={() => setSubPage(null)}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 transition-transform text-zinc-700 dark:text-white cursor-pointer mr-4"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[25px]">arrow_back</span>
            </button>
            <h2 className="text-[19px] font-bold text-[#111b21] dark:text-white">Notifications</h2>
          </div>
          <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-[24px]">more_vert</span>
          </button>
        </header>

        <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto bg-white dark:bg-[#0b141a] py-3 overflow-y-auto">
          {/* Conversation tones */}
          <div className="flex justify-between items-center px-5 py-3.5 hover:opacity-85 cursor-pointer">
            <div className="flex flex-col min-w-0 pr-4">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Conversation tones</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Play sounds for incoming and outgoing messages.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
              <input 
                type="checkbox" 
                checked={conversationTones} 
                onChange={(e) => setConversationTones(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a884] dark:peer-checked:bg-[#ff2d55]"></div>
            </label>
          </div>

          {/* Reminders */}
          <div className="flex justify-between items-center px-5 py-3.5 hover:opacity-85 cursor-pointer">
            <div className="flex flex-col min-w-0 pr-4">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Reminders</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Get occasional reminders about messages, calls or status updates you haven't seen</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
              <input 
                type="checkbox" 
                checked={reminders} 
                onChange={(e) => setReminders(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a884] dark:peer-checked:bg-[#ff2d55]"></div>
            </label>
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-5 my-2"></div>

          {/* Section: Messages */}
          <div className="px-5 py-2">
            <h3 className="text-[13.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Messages</h3>

            {/* Notification tone */}
            <div className="flex flex-col py-3.5 hover:opacity-85 cursor-pointer">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Notification tone</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Default (FAHHH_Sound_Effect(128k))</span>
            </div>

            {/* Vibrate */}
            <div className="flex flex-col py-3.5 hover:opacity-85 cursor-pointer">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Vibrate</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Default</span>
            </div>

            {/* Popup notification */}
            <div className="flex flex-col py-3.5 opacity-50 cursor-not-allowed">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Popup notification</span>
              <span className="text-[12.5px] text-zinc-400 dark:text-zinc-500 mt-0.5">Not available</span>
            </div>

            {/* Light */}
            <div className="flex flex-col py-3.5 hover:opacity-85 cursor-pointer">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Light</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">White</span>
            </div>

            {/* High priority */}
            <div className="flex justify-between items-center py-3.5 hover:opacity-85 cursor-pointer">
              <div className="flex flex-col min-w-0 pr-4">
                <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Use high priority notifications</span>
                <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Show previews of notifications at the top of the screen</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                <input 
                  type="checkbox" 
                  checked={highPriority} 
                  onChange={(e) => setHighPriority(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a884] dark:peer-checked:bg-[#ff2d55]"></div>
              </label>
            </div>

            {/* Reaction notifications */}
            <div className="flex justify-between items-center py-3.5 hover:opacity-85 cursor-pointer">
              <div className="flex flex-col min-w-0 pr-4">
                <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Reaction notifications</span>
                <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Show notifications for reactions to messages you send</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                <input 
                  type="checkbox" 
                  checked={reactionNotifications} 
                  onChange={(e) => setReactionNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a884] dark:peer-checked:bg-[#ff2d55]"></div>
              </label>
            </div>
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-5 my-2"></div>

          {/* Section: Groups */}
          <div className="px-5 py-2">
            <h3 className="text-[13.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Groups</h3>
            
            {/* Notification tone */}
            <div className="flex flex-col py-3.5 hover:opacity-85 cursor-pointer">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Notification tone</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Silent</span>
            </div>
          </div>
        </main>
        <Navigation activeTab="settings" />
      </div>
    );
  }

  // 7. STORAGE SUB-PAGE
  if (subPage === "storage") {
    return (
      <div className="w-full bg-[#f8f9fa] dark:bg-[#0b141a] text-[#1c2e35] dark:text-[#e9edef] antialiased min-h-screen flex flex-col pb-24 font-sans select-none transition-colors duration-200">
        <header className="sticky top-0 z-40 px-4 py-3.5 flex items-center bg-white dark:bg-[#111b21] border-b border-zinc-100 dark:border-[#222d34] shadow-sm">
          <button 
            onClick={() => setSubPage(null)}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 transition-transform text-zinc-700 dark:text-white cursor-pointer mr-4"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[25px]">arrow_back</span>
          </button>
          <h2 className="text-[19px] font-bold text-[#111b21] dark:text-white">Storage and data</h2>
        </header>

        <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto bg-white dark:bg-[#0b141a] py-3 overflow-y-auto">
          {/* Manage storage */}
          <div className="flex items-center px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer">
            <span className="material-symbols-outlined text-[22px] text-zinc-400 mr-4">folder</span>
            <div className="flex flex-col">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Manage storage</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">12.5 GB</span>
            </div>
          </div>

          {/* Network usage */}
          <div className="flex items-center px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer">
            <span className="material-symbols-outlined text-[22px] text-zinc-400 mr-4">cached</span>
            <div className="flex flex-col">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Network usage</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">1.3 GB sent · 1.2 GB received</span>
            </div>
          </div>

          {/* Use less data for calls */}
          <div className="flex justify-between items-center px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer">
            <div className="flex flex-col min-w-0 pr-4 pl-9">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Use less data for calls</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
              <input 
                type="checkbox" 
                checked={lessDataForCalls} 
                onChange={(e) => setLessDataForCalls(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a884] dark:peer-checked:bg-[#ff2d55]"></div>
            </label>
          </div>

          {/* Proxy */}
          <div className="flex flex-col px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer pl-[54px]">
            <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Proxy</span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">Off</span>
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-5 my-2"></div>

          {/* Media upload quality */}
          <div className="flex items-center px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer">
            <span className="material-symbols-outlined text-[22px] text-zinc-400 mr-4">hd</span>
            <div className="flex flex-col">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Media upload quality</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Standard quality</span>
            </div>
          </div>

          {/* Auto-download quality */}
          <div className="flex flex-col px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer pl-[54px]">
            <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Auto-download quality</span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">Auto</span>
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-5 my-2"></div>

          {/* Section: Media auto-download */}
          <div className="px-5 py-2">
            <h3 className="text-[13.5px] font-bold text-[#008069] dark:text-[#ff2d55] uppercase tracking-wider mb-0.5">Media auto-download</h3>
            <p className="text-[12px] text-zinc-400 dark:text-zinc-500 mb-3">Voice messages are always automatically downloaded</p>
            
            {/* When using mobile data */}
            <div className="flex flex-col py-3 hover:opacity-85 cursor-pointer pl-9">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">When using mobile data</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">No media</span>
            </div>

            {/* When connected on Wi-Fi */}
            <div className="flex flex-col py-3 hover:opacity-85 cursor-pointer pl-9">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">When connected on Wi-Fi</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">No media</span>
            </div>

            {/* When roaming */}
            <div className="flex flex-col py-3 hover:opacity-85 cursor-pointer pl-9">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">When roaming</span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">No media</span>
            </div>
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-5 my-2"></div>

          {/* Section: Media display */}
          <div className="px-5 py-2">
            <h3 className="text-[13.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Media display</h3>
            
            <div className="flex flex-col py-3 hover:opacity-85 cursor-pointer pl-9">
              <span className="text-[15.5px] font-medium text-[#111b21] dark:text-white">Android 11+ media migration</span>
            </div>
          </div>
        </main>
        <Navigation activeTab="settings" />
      </div>
    );
  }

  // ==========================================
  // MAIN SETTINGS VIEW
  // ==========================================
  return (
    <div className="w-full bg-[#f8f9fa] dark:bg-[#0b141a] text-[#1c2e35] dark:text-[#e9edef] antialiased min-h-screen flex flex-col pb-24 font-sans select-none transition-colors duration-200">
      
      {/* Dynamic Sticky Header */}
      <header className={`sticky top-0 z-40 px-4 py-3 flex justify-between items-center transition-all duration-300 ${
        scrolled 
          ? "bg-white dark:bg-[#111b21] shadow-md border-b border-zinc-100 dark:border-[#222d34]" 
          : "bg-white/90 dark:bg-[#111b21]/90 backdrop-blur-md"
      }`}>
        <div className="flex items-center min-w-0">
          <button 
            onClick={() => router.push("/chats")}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 transition-transform text-zinc-700 dark:text-white cursor-pointer"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[25px]">arrow_back</span>
          </button>
          
          {/* Header Title Morphs into Profile Name when scrolled */}
          <div className={`transition-all duration-300 ml-4 min-w-0 ${scrolled ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"}`}>
            <h2 className="text-[17px] font-bold text-[#111b21] dark:text-white truncate flex items-center gap-1.5 leading-none">
              {displayName}
            </h2>
            <span className="text-[11.5px] text-zinc-400 dark:text-zinc-500 font-semibold mt-0.5 inline-block">
              Settings
            </span>
          </div>
        </div>

        {/* Top Header Icons */}
        <div className="flex items-center gap-4 text-[#3b4a54] dark:text-white ml-auto">
          <button aria-label="Search" className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-[24px]">search</span>
          </button>
          <button 
            onClick={() => {
              setEditName(displayName);
              setEditUser(username);
              setShowEditModal(true);
            }}
            aria-label="Edit Profile" 
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">edit</span>
          </button>
          <button aria-label="QR Code" className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
          </button>
        </div>
      </header>

      {/* Main Settings Body */}
      <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto bg-white dark:bg-[#0b141a]">
        
        {/* Profile Card and Doodle Backdrop Area (only visible when not scrolled deep) */}
        <div className="relative w-full overflow-hidden bg-[#fafafa] dark:bg-[#111b21]/30 py-8 px-4 flex flex-col items-center border-b border-zinc-100/70 dark:border-[#222d34]/50 shrink-0">
          {/* Subtle light beige WhatsApp doodle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03] pointer-events-none bg-repeat bg-contain" style={{
            backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuDYHWykwIjaOrqQQRqBqWS2xZjKxqkWts5vC-10oJexhXhhranffnAKRQI9azZwab7K8eBjBbyQRPoqqhMNKpTcBL0iH26qd2Aqy9nli_8MiMOZZm90_Jv6J5LyI5A1mpe6CqTSBFvI3HNe8tgLQ8pe7qBmoh2oEPTc_ik8UyvmvICt-DC7p64p-FXyrAQePe7-gAfyPb_RgvPxMfijfmKoaqSZMj7QS7csIhIY6p5KEesgQd9AFfnTMIV0VCx-6Fho0I98K3MxOvU)"
          }}></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Express yourself emoji tooltip bubble */}
            <div className="relative mb-3 bg-white dark:bg-[#202c33] px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-zinc-100 dark:border-zinc-800 text-[12.5px] font-bold text-[#111b21] dark:text-[#e9edef] animate-bounce">
              Express yourself in emojis!
              {/* Tooltip little downward arrow */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-[#202c33] rotate-45 border-r border-b border-zinc-100 dark:border-zinc-800"></div>
            </div>

            {/* Profile Avatar */}
            <div className="w-28 h-28 rounded-full overflow-hidden border border-zinc-100 dark:border-zinc-800/80 shadow-md relative hover:scale-[1.02] active:scale-95 transition-transform duration-200 cursor-pointer">
              <img 
                alt="Profile" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtSTDTUitRQB5aG-ZcdFAsyFdP86mWxvW55CsH3fDZwlfJQzUR8Xav3ghPt6k07h7ujn8WjMnfUwokeODYvQGKKOm7F33aNS0EEnqaoctdIhY8ELBRO8tQR6mKm8_M0WvqegMqhtKgIxXjkXMfUbV5OAZ2iz0uoTKeVH-5FFp1KbmYjoXhls-OIQUHDnNB91KgpZba0PQ5hk-LVeGan4gFJdAzjvJk3mHfnEHBA8mO8nDZBHLChXewILCZaO_GNayQUdKeTWP5oeQ" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name + Green Add Circle Icon */}
            <h2 className="text-[21px] font-bold text-[#111b21] dark:text-white mt-4 flex items-center justify-center gap-2">
              <span>{displayName}</span>
              <span className="material-symbols-outlined text-[20px] text-[#00a884] dark:text-[#ff2d55] font-bold fill">add_circle</span>
            </h2>

            {/* Username */}
            <span className="text-[13.5px] text-[#667781] dark:text-[#8696a0] font-medium mt-1 inline-block">
              {username}
            </span>
          </div>
        </div>

        {/* Scrollable list of Settings options */}
        <div className="flex flex-col bg-white dark:bg-[#0b141a] py-1 pb-16">
          {settingsList.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => {
                if (item.name === "Appearance") {
                  toggleTheme();
                } else if (item.name === "Account") {
                  setSubPage("account");
                } else if (item.name === "Privacy") {
                  setSubPage("privacy");
                } else if (item.name === "Lists") {
                  setSubPage("lists");
                } else if (item.name === "Chats") {
                  setSubPage("chats");
                } else if (item.name === "Broadcasts") {
                  setSubPage("broadcasts");
                } else if (item.name === "Storage and data") {
                  setSubPage("storage");
                } else if (item.name === "Notifications") {
                  setSubPage("notifications");
                } else {
                  alert(`${item.name} settings are currently at default.`);
                }
              }}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center min-w-0">
                {/* Icon (colored green in light mode, gray in dark mode) */}
                <div className="w-[38px] h-[38px] flex items-center justify-start text-[#54656f] dark:text-[#8696a0] shrink-0 mr-1.5">
                  <span className="material-symbols-outlined text-[23px]">{item.icon}</span>
                </div>
                
                {/* Text */}
                <div className="flex flex-col min-w-0">
                  <span className="text-[15.5px] font-medium text-[#111b21] dark:text-[#e9edef] leading-tight">
                    {item.name}
                  </span>
                  {item.subtitle && (
                    <span className="text-[12.5px] text-[#667781] dark:text-[#8696a0] truncate mt-0.5">
                      {item.subtitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Badge / indicator */}
              <div className="flex items-center shrink-0">
                {item.hasDot && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00a884] dark:bg-[#ff2d55] mr-1"></span>
                )}
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Bottom Nav Bar */}
      <Navigation activeTab="settings" />

      {/* Edit Profile Modal Dialog */}
      {showEditModal && (
        <div className="fixed inset-0 z-[150] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111b21] rounded-2xl p-6 w-full max-w-[340px] shadow-xl animate-in zoom-in-95 duration-150 border border-zinc-100 dark:border-zinc-800">
            <h3 className="text-[17px] font-bold text-[#111b21] dark:text-white mb-4">Edit profile info</h3>
            <form onSubmit={handleEditProfileSubmit} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-[#00a884] dark:text-[#ff2d55] uppercase">Display name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#f0f2f5] dark:bg-[#202c33] border-none outline-none focus:outline-none rounded-xl py-3 px-4 text-[14.5px] text-[#111b21] dark:text-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-[#00a884] dark:text-[#ff2d55] uppercase">Username</label>
                <input 
                  type="text" 
                  value={editUser}
                  onChange={(e) => setEditUser(e.target.value)}
                  className="w-full bg-[#f0f2f5] dark:bg-[#202c33] border-none outline-none focus:outline-none rounded-xl py-3 px-4 text-[14.5px] text-[#111b21] dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="text-zinc-500 font-bold text-[14px] px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="text-[#00a884] dark:text-[#ff2d55] font-bold text-[14px] px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
