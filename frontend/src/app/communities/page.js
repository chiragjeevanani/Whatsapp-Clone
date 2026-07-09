"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

// SVG Illustration for the Intro Screen
const CommunityIllustration = () => (
  <div className="w-[200px] h-[150px] mx-auto my-6 flex items-center justify-center bg-[#fdfdfd]">
    <svg viewBox="0 0 200 150" className="w-[180px] h-[135px]" xmlns="http://www.w3.org/2000/svg">
      {/* Main Board */}
      <rect x="40" y="25" width="120" height="90" rx="12" fill="#ebf7ed" stroke="#00a884" strokeWidth="2.5" />
      
      {/* Board Headers */}
      <rect x="52" y="37" width="22" height="18" rx="4" fill="#8cd9b3" opacity="0.6" />
      {/* Small community people in top left of board */}
      <path d="M57,48 C57,45 59,44 63,44 C67,44 69,45 69,48" fill="none" stroke="#008f70" strokeWidth="1.5" />
      <circle cx="63" cy="40" r="2.5" fill="none" stroke="#008f70" strokeWidth="1.5" />
      
      {/* Board Pencil Area */}
      <rect x="82" y="37" width="66" height="18" rx="4" fill="#ffffff" stroke="#c2ebd4" strokeWidth="1.5" />
      {/* Pencil */}
      <g transform="translate(115, 30) rotate(-15)">
        <path d="M0,0 L18,0 L22,4 L18,8 L0,8 Z" fill="#25d366" stroke="#008f70" strokeWidth="1" />
        <polygon points="22,4 18,0 18,8" fill="#ffbc00" />
      </g>

      {/* Board Content Lines */}
      <rect x="82" y="62" width="66" height="10" rx="3" fill="#25d366" />
      <rect x="82" y="78" width="66" height="10" rx="3" fill="#25d366" />
      
      {/* Calculator (floating in middle) */}
      <rect x="68" y="60" width="22" height="24" rx="4" fill="#ffffff" stroke="#1c2e35" strokeWidth="1.5" />
      <line x1="72" y1="66" x2="86" y2="66" stroke="#1c2e35" strokeWidth="1.5" />
      <line x1="72" y1="71" x2="86" y2="71" stroke="#1c2e35" strokeWidth="1.5" />
      <line x1="72" y1="76" x2="86" y2="76" stroke="#1c2e35" strokeWidth="1.5" />
      
      {/* Apple */}
      <circle cx="78" cy="98" r="9" fill="#a3e2c9" stroke="#008f70" strokeWidth="1.5" />
      <path d="M78,89 Q80,87 78,85 Q77,87 78,89 Z" fill="#008f70" />

      {/* Big Megaphone Speaker on Left */}
      <g transform="translate(18, 72) rotate(-10)">
        {/* Speaker Handle */}
        <rect x="10" y="24" width="7" height="14" rx="2.5" fill="#008f70" stroke="#008f70" strokeWidth="1.5" />
        {/* Speaker Cone */}
        <path d="M6,10 L30,2 L35,32 L6,24 Z" fill="#25d366" stroke="#008f70" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Loudspeaker rim */}
        <ellipse cx="35" cy="17" rx="4" ry="15" fill="#00a884" stroke="#008f70" strokeWidth="1.5" />
        {/* Back cap */}
        <circle cx="6" cy="17" r="7" fill="#008f70" />
      </g>
    </svg>
  </div>
);

export default function CommunitiesPage() {
  const router = useRouter();
  
  // Step navigation: null = List, "intro" = Screen 1, "form" = Screen 2, "success" = Screen 3, "info" = Screen 4 (Info Page)
  const [step, setStep] = useState(null);
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const isDark = theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const shouldHide = step !== null;
    window.dispatchEvent(new CustomEvent("hide-bottom-nav", { detail: shouldHide }));
    return () => {
      window.dispatchEvent(new CustomEvent("hide-bottom-nav", { detail: false }));
    };
  }, [step]);

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
  
  // Form State
  const [communityName, setCommunityName] = useState("");
  const [communityDesc, setCommunityDesc] = useState(
    "Hi everyone! This community is for members to chat in topic-based groups and get important announcements."
  );
  
  // Input fields focus state for green border styling
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isDescFocused, setIsDescFocused] = useState(false);

  // Dynamic user-created communities stored in local state
  const [userCommunities, setUserCommunities] = useState([]);
  
  // State for Add Group dialog
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [currentCommunityGroups, setCurrentCommunityGroups] = useState(["General"]);

  // Info Page State
  const [activeInfoComm, setActiveInfoComm] = useState(null); // Stores current community context for info page
  const [infoTab, setInfoTab] = useState("community"); // "community" or "announcements"
  const [chatLockEnabled, setChatLockEnabled] = useState(false);
  const [showEditInfoModal, setShowEditInfoModal] = useState(false);
  const [editCommName, setEditCommName] = useState("");
  const [editCommDesc, setEditCommDesc] = useState("");

  // Detect URL parameter to trigger flow
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("action") === "new") {
        setStep("intro");
        router.replace("/communities");
      }
    }
  }, [router]);

  const handleStartFlow = () => {
    setStep("intro");
  };

  const handleGetStarted = () => {
    setStep("form");
  };

  const handleCreateCommunitySubmit = (e) => {
    if (e) e.preventDefault();
    if (!communityName.trim()) return;
    
    // Add default group General
    setCurrentCommunityGroups(["General"]);
    setStep("success");
  };

  const handleFinishFlow = () => {
    // Save to userCommunities list before exiting
    const newComm = {
      id: "user-comm-" + Date.now(),
      name: communityName,
      description: communityDesc,
      groups: [...currentCommunityGroups]
    };
    setUserCommunities([newComm, ...userCommunities]);
    
    // Reset form and return to list
    setCommunityName("");
    setCommunityDesc("Hi everyone! This community is for members to chat in topic-based groups and get important announcements.");
    setShowCommunityMenu(false);
    setStep(null);
  };

  const handleAddGroupSubmit = (e) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      const updated = [...currentCommunityGroups, newGroupName.trim()];
      setCurrentCommunityGroups(updated);
      
      // If we are currently viewing the success step/info step, keep context updated
      if (activeInfoComm) {
        setActiveInfoComm({
          ...activeInfoComm,
          groups: updated
        });
      }
      
      setNewGroupName("");
      setShowAddGroupModal(false);
    }
  };

  // Edit community info submit
  const handleEditInfoSubmit = (e) => {
    e.preventDefault();
    if (editCommName.trim()) {
      const updatedComm = {
        ...activeInfoComm,
        name: editCommName.trim(),
        description: editCommDesc.trim()
      };
      
      setActiveInfoComm(updatedComm);
      
      // Also update the creation wizard variables if it is a new creation flow
      if (activeInfoComm.isNewFlow) {
        setCommunityName(editCommName.trim());
        setCommunityDesc(editCommDesc.trim());
      } else {
        // Update userCommunities state list
        setUserCommunities(userCommunities.map(c => 
          c.id === activeInfoComm.id ? { ...c, name: editCommName.trim(), description: editCommDesc.trim() } : c
        ));
      }
      
      setShowEditInfoModal(false);
    }
  };

  // ==========================================
  // VIEW 1: INTRO SCREEN (Create a new community)
  // ==========================================
  if (step === "intro") {
    return (
      <div className="w-full bg-white text-[#1c2e35] antialiased min-h-screen flex flex-col font-sans select-none justify-between p-6">
        {/* Header */}
        <header className="flex items-center justify-start shrink-0">
          <button 
            onClick={() => setStep(null)}
            className="p-1 hover:bg-zinc-100 rounded-full transition-transform active:scale-95 cursor-pointer text-zinc-500"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[28px]">close</span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-md mx-auto">
          {/* Illustration */}
          <CommunityIllustration />

          <h2 className="text-[23px] font-bold text-[#111b21] leading-tight mb-3">
            Create a new community
          </h2>
          
          <p className="text-[14.5px] text-[#667781] leading-relaxed mb-6 font-normal">
            Bring together a neighborhood, school or more. Create topic-based groups for members, and easily send them admin announcements.
          </p>

          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            className="text-[15.5px] font-bold text-[#0066cc] hover:underline flex items-center gap-1.5"
          >
            See example communities
            <span className="material-symbols-outlined text-[15px] font-bold mt-0.5">chevron_right</span>
          </a>
        </main>

        {/* Bottom Button */}
        <footer className="w-full max-w-md mx-auto shrink-0 pb-4">
          <button 
            onClick={handleGetStarted}
            className="w-full py-3.5 bg-[#00a884] hover:bg-[#008f70] text-white rounded-full font-bold text-[16px] transition-colors shadow-md active:scale-[0.98] cursor-pointer"
          >
            Get started
          </button>
        </footer>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: FORM SCREEN (New community inputs)
  // ==========================================
  if (step === "form") {
    return (
      <div className="w-full bg-white text-[#1c2e35] antialiased min-h-screen flex flex-col font-sans select-none justify-between p-5 relative">
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
          {/* Header */}
          <header className="flex items-center py-2 shrink-0">
            <button 
              onClick={() => setStep("intro")}
              className="p-1 hover:bg-zinc-100 rounded-full transition-transform active:scale-95 cursor-pointer text-zinc-700"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[26px]">arrow_back</span>
            </button>
            <h1 className="text-[19px] font-bold text-[#111b21] ml-6">New community</h1>
          </header>

          <main className="flex-1 mt-6 flex flex-col gap-6">
            <div className="text-center">
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="text-[14.5px] font-bold text-[#0066cc] hover:underline"
              >
                See examples of different communities
              </a>
            </div>

            {/* Photo Picker */}
            <div className="flex flex-col items-center gap-2 mt-2">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-[22px] bg-[#e1e3e6] flex items-center justify-center overflow-hidden border border-transparent hover:border-zinc-300 transition-colors">
                  <span className="material-symbols-outlined text-[48px] text-zinc-400">groups</span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#00a884] text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-md">
                  <span className="material-symbols-outlined text-[18px] fill">photo_camera</span>
                </div>
              </div>
              <span className="text-[13px] font-semibold text-zinc-500 mt-1">Change photo</span>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCommunitySubmit} className="flex flex-col gap-5 mt-4">
              {/* Community Name Input */}
              <div className="flex flex-col gap-1">
                <div 
                  className={`relative border-2 rounded-[12px] px-3.5 py-3 transition-colors duration-200 ${
                    isNameFocused ? "border-[#00a884]" : "border-zinc-200"
                  }`}
                >
                  <label 
                    className={`absolute -top-2.5 left-3 bg-white px-1.5 text-[12px] font-bold transition-colors duration-200 ${
                      isNameFocused ? "text-[#00a884]" : "text-[#667781]"
                    }`}
                  >
                    Community name
                  </label>
                  <input 
                    type="text" 
                    maxLength={100}
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    onFocus={() => setIsNameFocused(true)}
                    onBlur={() => setIsNameFocused(false)}
                    className="w-full bg-transparent border-none outline-none focus:outline-none text-[15.5px] text-[#111b21] placeholder-zinc-300"
                    placeholder="Enter community name"
                    required
                    autoFocus
                  />
                </div>
                <div className="text-right text-[11px] text-zinc-400 font-semibold px-1">
                  {communityName.length}/100
                </div>
              </div>

              {/* Description Input */}
              <div className="flex flex-col gap-1">
                <div 
                  className={`relative border rounded-[12px] p-3.5 transition-colors duration-200 ${
                    isDescFocused ? "border-[#00a884] border-2" : "border-zinc-200"
                  }`}
                >
                  <textarea 
                    maxLength={2048}
                    value={communityDesc}
                    onChange={(e) => setCommunityDesc(e.target.value)}
                    onFocus={() => setIsDescFocused(true)}
                    onBlur={() => setIsDescFocused(false)}
                    rows={4}
                    className="w-full bg-transparent border-none outline-none focus:outline-none text-[14.5px] text-[#111b21] resize-none leading-relaxed"
                    placeholder="Describe your community"
                  />
                </div>
                <div className="text-right text-[11px] text-zinc-400 font-semibold px-1">
                  {communityDesc.length}/2048
                </div>
              </div>
            </form>
          </main>
        </div>

        {/* Floating Green Action Button on bottom right */}
        <div className="absolute bottom-6 right-6">
          <button 
            onClick={handleCreateCommunitySubmit}
            disabled={!communityName.trim()}
            className="w-14 h-14 bg-[#00a884] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#008f70] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
            aria-label="Next"
          >
            <span className="material-symbols-outlined text-[26px]">arrow_forward</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: SUCCESS & COMMUNITY VIEW
  // ==========================================
  if (step === "success") {
    return (
      <div className="w-full bg-[#f8f9fa] text-[#1c2e35] antialiased min-h-screen flex flex-col font-sans select-none justify-between">
        <div className="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-sm relative pb-24">
          {/* Header */}
          <header className="px-4 py-3 flex justify-between items-center bg-white border-b border-zinc-100 shrink-0">
            <button 
              onClick={handleFinishFlow}
              className="p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform text-[#1c2e35] cursor-pointer"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowCommunityMenu(!showCommunityMenu)}
                className={`p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform text-[#3b4a54] cursor-pointer ${showCommunityMenu ? "bg-zinc-100" : ""}`}
              >
                <span className="material-symbols-outlined text-[24px]">more_vert</span>
              </button>
              
              {showCommunityMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setShowCommunityMenu(false)}
                  />
                  <div className="absolute right-0 top-9 w-[205px] bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] py-1.5 z-50 text-[#111b21] animate-in fade-in zoom-in-95 duration-100 origin-top-right border border-zinc-100">
                    <button 
                      onClick={() => {
                        setShowCommunityMenu(false);
                        setActiveInfoComm({
                          name: communityName,
                          description: communityDesc,
                          groups: currentCommunityGroups,
                          isNewFlow: true
                        });
                        setInfoTab("community");
                        setStep("info");
                      }}
                      className="w-full text-left px-5 py-3 hover:bg-zinc-50 transition-colors font-medium text-[15px] cursor-pointer"
                    >
                      Community info
                    </button>
                    <button 
                      onClick={() => {
                        setShowCommunityMenu(false);
                        alert("Invite Link Copied: https://zetto.im/join/community-" + Date.now().toString(36));
                      }}
                      className="w-full text-left px-5 py-3 hover:bg-zinc-50 transition-colors font-medium text-[15px] cursor-pointer"
                    >
                      Invite members
                    </button>
                    <button 
                      onClick={() => {
                        setShowCommunityMenu(false);
                        setActiveInfoComm({
                          name: communityName,
                          description: communityDesc,
                          groups: currentCommunityGroups,
                          isNewFlow: true
                        });
                        setInfoTab("community");
                        setStep("info");
                      }}
                      className="w-full text-left px-5 py-3 hover:bg-zinc-50 transition-colors font-medium text-[15px] cursor-pointer"
                    >
                      Community settings
                    </button>
                  </div>
                </>
              )}
            </div>
          </header>

          <main className="flex-1 flex flex-col">
            {/* Banner/Profile Header */}
            <div 
              onClick={() => {
                setActiveInfoComm({
                  name: communityName,
                  description: communityDesc,
                  groups: currentCommunityGroups,
                  isNewFlow: true
                });
                setInfoTab("community");
                setStep("info");
              }}
              className="bg-[#f0f2f5] p-5 flex items-center gap-4 shrink-0 border-b border-zinc-100 hover:bg-[#e6e8eb] transition-colors cursor-pointer"
            >
              <div className="w-[52px] h-[52px] rounded-[14px] bg-[#008069]/10 text-[#008069] flex items-center justify-center shrink-0 shadow-sm border border-[#008069]/15">
                <span className="material-symbols-outlined text-[28px] fill">groups</span>
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="text-[18px] font-bold text-[#111b21] truncate">{communityName}</h2>
                <span className="text-[13px] text-zinc-500 font-semibold mt-0.5">
                  Community · {currentCommunityGroups.length + 1} groups
                </span>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 bg-white flex flex-col">
              {/* Announcements Group Row */}
              <div className="flex items-center px-5 py-4 border-b border-zinc-100 hover:bg-zinc-50 transition-colors cursor-pointer">
                <div className="w-11 h-11 rounded-[12px] bg-[#e6f5ef] text-[#0f8b5d] flex items-center justify-center shrink-0 mr-4">
                  <span className="material-symbols-outlined text-[22px] fill">campaign</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[15px] font-bold text-[#111b21] truncate">Announcements</h4>
                    <span className="text-[12px] text-zinc-400 font-medium">13:06</span>
                  </div>
                  <p className="text-[13px] text-zinc-500 truncate mt-0.5">Add members to start chatting</p>
                </div>
              </div>

              {/* Title Section: Groups you're in */}
              <div className="text-[13px] font-bold text-[#667781] px-5 pt-5 pb-2.5 bg-white uppercase tracking-wider shrink-0">
                Groups you&apos;re in
              </div>

              {/* Dynamic Group list */}
              <div className="flex flex-col">
                {currentCommunityGroups.map((group, idx) => (
                  <div key={idx} className="flex items-center px-5 py-3.5 border-b border-zinc-100 hover:bg-zinc-50 transition-colors cursor-pointer">
                    <div className="w-11 h-11 rounded-full bg-[#dfe5e7] text-[#54656f] flex items-center justify-center shrink-0 mr-4">
                      <span className="material-symbols-outlined text-[22px] opacity-75">chat_bubble</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-[15px] font-bold text-[#111b21] truncate">{group}</h4>
                        <span className="text-[12px] text-zinc-400 font-medium">13:06</span>
                      </div>
                      <p className="text-[13px] text-zinc-500 truncate mt-0.5">Add members to start chatting</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty placeholder banner helper text */}
              <div className="p-8 text-center max-w-xs mx-auto flex flex-col items-center justify-center gap-2 mt-4 text-[#667781]">
                <p className="text-[13px] leading-relaxed">
                  Other groups added to the community will appear here. Community members can join these groups.
                </p>
              </div>
            </div>
          </main>

          {/* Bottom Green Add Group Button bar */}
          <div className="absolute bottom-6 left-0 right-0 px-5">
            <button 
              onClick={() => setShowAddGroupModal(true)}
              className="w-full py-3.5 bg-[#00a884] hover:bg-[#008f70] text-white rounded-full font-bold text-[15px] transition-colors shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] font-bold">add</span>
              <span>Add group</span>
            </button>
          </div>
        </div>

        {/* Simple Add Group Modal */}
        {showAddGroupModal && (
          <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-[320px] shadow-xl animate-in zoom-in-95 duration-150">
              <h3 className="text-[17px] font-bold text-[#111b21] mb-4">Add new group</h3>
              <form onSubmit={handleAddGroupSubmit} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Group name"
                  className="w-full bg-[#f0f2f5] border-none outline-none focus:outline-none rounded-xl py-3 px-4 text-[15px] text-[#111b21]"
                  autoFocus
                  required
                />
                <div className="flex justify-end gap-3 mt-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      setNewGroupName("");
                      setShowAddGroupModal(false);
                    }}
                    className="text-zinc-500 font-bold text-[14px] px-3 py-2 hover:bg-zinc-50 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="text-[#00a884] font-bold text-[14px] px-3 py-2 hover:bg-zinc-50 rounded-lg cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 4: COMMUNITY INFO & ANNOUNCEMENTS TABS
  // ==========================================
  if (step === "info" && activeInfoComm) {
    const isNew = activeInfoComm.isNewFlow;
    const totalGroupsCount = activeInfoComm.groups.length + 1; // groups list + announcements group

    return (
      <div className="w-full bg-[#f0f2f5] text-[#1c2e35] antialiased min-h-screen flex flex-col font-sans select-none justify-between">
        <div className="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-sm relative pb-10">
          
          {/* Custom Header */}
          <header className="px-4 py-3 flex items-center bg-white shrink-0 sticky top-0 z-40 border-b border-zinc-100">
            <button 
              onClick={() => setStep(isNew ? "success" : null)}
              className="p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform text-[#1c2e35] cursor-pointer"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            
            {/* Show small avatar/name in header if tab is Announcements */}
            {infoTab === "announcements" ? (
              <div className="flex items-center gap-2.5 ml-4 min-w-0">
                <div className="w-9 h-9 rounded-[8px] bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] fill">groups</span>
                </div>
                <div className="flex flex-col min-w-0 leading-none">
                  <span className="text-[15.5px] font-bold text-[#111b21] truncate">{activeInfoComm.name}</span>
                  <span className="text-[11.5px] text-zinc-400 font-semibold mt-0.5">Community · {totalGroupsCount} groups</span>
                </div>
              </div>
            ) : (
              <div className="flex-1"></div>
            )}
            
            <button className="p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform text-[#3b4a54] ml-auto">
              <span className="material-symbols-outlined text-[24px]">more_vert</span>
            </button>
          </header>

          <main className="flex-1 flex flex-col overflow-y-auto">
            
            {/* Banner Section (Only visible on Community tab) */}
            {infoTab === "community" && (
              <div className="bg-white pt-6 pb-4 flex flex-col items-center border-b border-zinc-100 shrink-0">
                {/* Big Avatar */}
                <div className="w-24 h-24 rounded-[26px] bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mb-4 shadow-sm border border-amber-200/40">
                  <span className="material-symbols-outlined text-[54px] fill opacity-80">groups</span>
                </div>
                {/* Name */}
                <h2 className="text-[21px] font-bold text-[#111b21] tracking-wide">{activeInfoComm.name}</h2>
                <span className="text-[13.5px] text-[#667781] font-semibold mt-1">
                  Community · {totalGroupsCount} groups
                </span>

                {/* Triple Action Buttons: Invite, Add members, Add groups */}
                <div className="grid grid-cols-3 gap-3.5 w-full px-6 mt-6">
                  <button 
                    onClick={() => alert("Invite Link Copied: https://zetto.im/join/community-" + Date.now().toString(36))}
                    className="flex flex-col items-center justify-center py-2.5 px-2 border border-zinc-100 hover:bg-zinc-50 active:scale-[0.97] transition-all rounded-[12px] text-[#00a884] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[22px] font-bold">link</span>
                    <span className="text-[12px] font-bold text-[#00a884] mt-1.5">Invite</span>
                  </button>

                  <button 
                    onClick={() => alert("Simulating select contacts to add to community...")}
                    className="flex flex-col items-center justify-center py-2.5 px-2 border border-zinc-100 hover:bg-zinc-50 active:scale-[0.97] transition-all rounded-[12px] text-[#00a884] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[22px] fill">person_add</span>
                    <span className="text-[12px] font-bold text-[#00a884] mt-1.5">Add members</span>
                  </button>

                  <button 
                    onClick={() => setShowAddGroupModal(true)}
                    className="flex flex-col items-center justify-center py-2.5 px-2 border border-zinc-100 hover:bg-zinc-50 active:scale-[0.97] transition-all rounded-[12px] text-[#00a884] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[22px] fill">group_add</span>
                    <span className="text-[12px] font-bold text-[#00a884] mt-1.5">Add groups</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB SELECTOR HEADER */}
            <div className="flex border-b border-zinc-100 bg-white sticky top-12 z-35">
              <button 
                onClick={() => setInfoTab("community")}
                className={`flex-1 text-center py-3.5 font-bold text-[14.5px] border-b-2 relative transition-colors duration-150 hover:bg-zinc-50 cursor-pointer ${
                  infoTab === "community" ? "border-[#00a884] text-[#00a884]" : "border-transparent text-[#667781]"
                }`}
              >
                Community
              </button>
              <button 
                onClick={() => setInfoTab("announcements")}
                className={`flex-1 text-center py-3.5 font-bold text-[14.5px] border-b-2 relative transition-colors duration-150 hover:bg-zinc-50 cursor-pointer ${
                  infoTab === "announcements" ? "border-[#00a884] text-[#00a884]" : "border-transparent text-[#667781]"
                }`}
              >
                Announcements
              </button>
            </div>

            {/* CONTENT BASED ON TABS */}
            {infoTab === "community" ? (
              // COMMUNITY TAB BODY
              <div className="flex flex-col">
                
                {/* Description card */}
                <div className="bg-white p-5 border-b border-zinc-100/60 leading-relaxed text-[14.5px] text-[#111b21] font-normal">
                  {activeInfoComm.description}
                </div>

                {/* Section Gap */}
                <div className="h-2.5 bg-[#f0f2f5] border-t border-b border-zinc-200/20"></div>

                {/* Options List */}
                <div className="bg-white flex flex-col border-b border-zinc-100">
                  <div 
                    onClick={() => {
                      setEditCommName(activeInfoComm.name);
                      setEditCommDesc(activeInfoComm.description);
                      setShowEditInfoModal(true);
                    }}
                    className="flex items-center gap-6 px-5 py-4 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors border-b border-zinc-100"
                  >
                    <span className="material-symbols-outlined text-zinc-500 text-[23px]">edit</span>
                    <span className="text-[15.5px] font-medium text-[#111b21]">Edit community info</span>
                  </div>

                  <div 
                    onClick={() => setShowAddGroupModal(true)}
                    className="flex items-center gap-6 px-5 py-4 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors border-b border-zinc-100"
                  >
                    <span className="material-symbols-outlined text-zinc-500 text-[23px] fill">group_add</span>
                    <span className="text-[15.5px] font-medium text-[#111b21]">Manage groups</span>
                  </div>

                  <div 
                    onClick={() => alert("Community settings are standard for admins.")}
                    className="flex items-center gap-6 px-5 py-4 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors border-b border-zinc-100"
                  >
                    <span className="material-symbols-outlined text-zinc-500 text-[23px]">settings</span>
                    <span className="text-[15.5px] font-medium text-[#111b21]">Community settings</span>
                  </div>

                  <div 
                    onClick={() => alert(`This community has ${totalGroupsCount} active groups.`)}
                    className="flex items-center gap-6 px-5 py-4 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-zinc-500 text-[23px] fill">groups</span>
                    <span className="text-[15.5px] font-medium text-[#111b21]">View groups ({totalGroupsCount})</span>
                  </div>
                </div>

                {/* Section Gap */}
                <div className="h-2.5 bg-[#f0f2f5] border-t border-b border-zinc-200/20"></div>

                {/* Members Section */}
                <div className="bg-white flex flex-col border-b border-zinc-100">
                  <div className="text-[13px] font-bold text-zinc-500 px-5 pt-4 pb-2">
                    1 community member
                  </div>

                  {/* Add members row */}
                  <div 
                    onClick={() => alert("Select contact to invite...")}
                    className="flex items-center px-5 py-3.5 hover:bg-zinc-50 cursor-pointer transition-colors border-b border-zinc-100"
                  >
                    <div className="w-[40px] h-[40px] rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0 mr-4 shadow-sm">
                      <span className="material-symbols-outlined text-[20px] fill">person_add</span>
                    </div>
                    <span className="text-[15.5px] font-bold text-[#111b21]">Add members</span>
                  </div>

                  {/* You member item */}
                  <div className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50 transition-colors">
                    <div className="flex items-center">
                      <div className="w-[40px] h-[40px] rounded-full overflow-hidden shrink-0 mr-4 border border-zinc-100">
                        <img 
                          alt="You" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtSTDTUitRQB5aG-ZcdFAsyFdP86mWxvW55CsH3fDZwlfJQzUR8Xav3ghPt6k07h7ujn8WjMnfUwokeODYvQGKKOm7F33aNS0EEnqaoctdIhY8ELBRO8tQR6mKm8_M0WvqegMqhtKgIxXjkXMfUbV5OAZ2iz0uoTKeVH-5FFp1KbmYjoXhls-OIQUHDnNB91KgpZba0PQ5hk-LVeGan4gFJdAzjvJk3mHfnEHBA8mO8nDZBHLChXewILCZaO_GNayQUdKeTWP5oeQ" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-[#111b21]">You</span>
                      </div>
                    </div>
                    <span className="bg-[#e6f5ef] text-[#0f8b5d] text-[11px] font-bold px-2.5 py-1 rounded-[6px] uppercase tracking-wide">
                      Community Owner
                    </span>
                  </div>
                </div>

                {/* Section Gap */}
                <div className="h-2.5 bg-[#f0f2f5] border-t border-b border-zinc-200/20"></div>

                {/* Bottom Footer Actions (Assign, Exit, Report, Deactivate) */}
                <div className="bg-white flex flex-col border-b border-zinc-100 pb-8">
                  <div 
                    onClick={() => alert("Select a member to assign ownership.")}
                    className="flex items-center gap-5 px-5 py-3.5 hover:bg-zinc-50 cursor-pointer text-[#111b21]"
                  >
                    <span className="material-symbols-outlined text-zinc-500 text-[22px]">arrow_forward</span>
                    <span className="text-[15px] font-semibold">Assign new owner</span>
                  </div>

                  <div 
                    onClick={() => {
                      if (confirm("Are you sure you want to exit the community?")) {
                        setStep(null);
                      }
                    }}
                    className="flex items-center gap-5 px-5 py-3.5 hover:bg-zinc-50 cursor-pointer text-rose-600 font-semibold"
                  >
                    <span className="material-symbols-outlined text-[22px]">logout</span>
                    <span className="text-[15px]">Exit community</span>
                  </div>

                  <div 
                    onClick={() => alert("Community reported. Thank you for keeping Zetto safe.")}
                    className="flex items-center gap-5 px-5 py-3.5 hover:bg-zinc-50 cursor-pointer text-rose-600 font-semibold"
                  >
                    <span className="material-symbols-outlined text-[22px]">thumb_down</span>
                    <span className="text-[15px]">Report community</span>
                  </div>

                  <div 
                    onClick={() => {
                      if (confirm("Deactivating this community will close all its groups. This cannot be undone. Proceed?")) {
                        setStep(null);
                      }
                    }}
                    className="flex items-center gap-5 px-5 py-3.5 hover:bg-zinc-50 cursor-pointer text-rose-600 font-semibold"
                  >
                    <span className="material-symbols-outlined text-[22px]">cancel</span>
                    <span className="text-[15px]">Deactivate community</span>
                  </div>
                </div>

              </div>
            ) : (
              // ANNOUNCEMENTS TAB BODY
              <div className="flex flex-col">
                {/* Options List */}
                <div className="bg-white flex flex-col border-b border-zinc-100">
                  
                  {/* Notifications */}
                  <div 
                    onClick={() => alert("Notifications preferences updated.")}
                    className="flex items-center gap-6 px-5 py-4 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors border-b border-zinc-100"
                  >
                    <span className="material-symbols-outlined text-zinc-500 text-[23px]">notifications</span>
                    <span className="text-[15.5px] font-medium text-[#111b21]">Notifications</span>
                  </div>

                  {/* Media Visibility */}
                  <div 
                    onClick={() => alert("Media visibility settings loaded.")}
                    className="flex items-center gap-6 px-5 py-4 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors border-b border-zinc-100/60"
                  >
                    <span className="material-symbols-outlined text-zinc-500 text-[23px]">image</span>
                    <span className="text-[15.5px] font-medium text-[#111b21]">Media visibility</span>
                  </div>

                  {/* Encryption */}
                  <div className="flex items-start gap-6 px-5 py-4 border-b border-zinc-100/60">
                    <span className="material-symbols-outlined text-zinc-500 text-[23px] shrink-0 mt-0.5">lock</span>
                    <div className="flex flex-col">
                      <span className="text-[15.5px] font-medium text-[#111b21]">Encryption</span>
                      <span className="text-[12.5px] text-zinc-400 leading-normal mt-0.5">
                        Messages and calls are end-to-end encrypted. Tap to learn more.
                      </span>
                    </div>
                  </div>

                  {/* Disappearing Messages */}
                  <div 
                    onClick={() => alert("Disappearing messages toggle loaded.")}
                    className="flex items-start gap-6 px-5 py-4 border-b border-zinc-100/60 cursor-pointer hover:bg-zinc-50"
                  >
                    <span className="material-symbols-outlined text-zinc-500 text-[23px] shrink-0 mt-0.5">history</span>
                    <div className="flex flex-col">
                      <span className="text-[15.5px] font-medium text-[#111b21]">Disappearing messages</span>
                      <span className="text-[12.5px] text-zinc-400 mt-0.5">Off</span>
                    </div>
                  </div>

                  {/* Chat Lock with Toggle Switch */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100/60">
                    <div className="flex items-start gap-6 mr-4">
                      <span className="material-symbols-outlined text-zinc-500 text-[23px] shrink-0 mt-0.5">lock_person</span>
                      <div className="flex flex-col">
                        <span className="text-[15.5px] font-medium text-[#111b21]">Chat lock</span>
                        <span className="text-[12.5px] text-zinc-400 mt-0.5">Lock and hide this chat on this device.</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={chatLockEnabled} 
                        onChange={() => setChatLockEnabled(!chatLockEnabled)} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a884]"></div>
                    </label>
                  </div>

                  {/* Phone Number Privacy */}
                  <div className="flex items-start gap-6 px-5 py-4 border-b border-zinc-100/60">
                    <span className="material-symbols-outlined text-zinc-500 text-[23px] shrink-0 mt-0.5">dialpad</span>
                    <div className="flex flex-col">
                      <span className="text-[15.5px] font-medium text-[#111b21]">Phone number privacy</span>
                      <span className="text-[12.5px] text-zinc-400 leading-normal mt-0.5">
                        Your phone number is visible in this chat. Tap to learn more.
                      </span>
                    </div>
                  </div>

                  {/* Report Announcements */}
                  <div 
                    onClick={() => alert("Announcements reported.")}
                    className="flex items-center gap-6 px-5 py-4 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer text-rose-600 font-semibold"
                  >
                    <span className="material-symbols-outlined text-rose-600 text-[23px]">thumb_down</span>
                    <span className="text-[15px]">Report announcements</span>
                  </div>

                </div>

                {/* Disclaimer text at bottom */}
                <div className="p-6 text-center text-[13px] text-zinc-500 leading-relaxed font-normal">
                  If you don&apos;t want to receive announcements, you must exit the community.{" "}
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[#00a884] font-bold hover:underline">
                    Learn more
                  </a>
                </div>
              </div>
            )}

          </main>

        </div>

        {/* Modal: Edit Community Info (Name & Description) */}
        {showEditInfoModal && (
          <div className="absolute inset-0 z-[150] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-[340px] shadow-xl animate-in zoom-in-95 duration-150">
              <h3 className="text-[17px] font-bold text-[#111b21] mb-4">Edit community info</h3>
              <form onSubmit={handleEditInfoSubmit} className="flex flex-col gap-4">
                
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#00a884] uppercase">Community name</label>
                  <input 
                    type="text" 
                    value={editCommName}
                    onChange={(e) => setEditCommName(e.target.value)}
                    className="w-full bg-[#f0f2f5] border-none outline-none focus:outline-none rounded-xl py-3 px-4 text-[14.5px] text-[#111b21]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#00a884] uppercase">Description</label>
                  <textarea 
                    value={editCommDesc}
                    onChange={(e) => setEditCommDesc(e.target.value)}
                    rows={4}
                    className="w-full bg-[#f0f2f5] border-none outline-none focus:outline-none rounded-xl py-3 px-4 text-[14.5px] text-[#111b21] resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowEditInfoModal(false)}
                    className="text-zinc-500 font-bold text-[14px] px-3 py-2 hover:bg-zinc-50 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="text-[#00a884] font-bold text-[14px] px-3 py-2 hover:bg-zinc-50 rounded-lg cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Simple Add Group */}
        {showAddGroupModal && (
          <div className="absolute inset-0 z-[150] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-[320px] shadow-xl animate-in zoom-in-95 duration-150">
              <h3 className="text-[17px] font-bold text-[#111b21] mb-4">Add new group</h3>
              <form onSubmit={handleAddGroupSubmit} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Group name"
                  className="w-full bg-[#f0f2f5] border-none outline-none focus:outline-none rounded-xl py-3 px-4 text-[15px] text-[#111b21]"
                  autoFocus
                  required
                />
                <div className="flex justify-end gap-3 mt-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      setNewGroupName("");
                      setShowAddGroupModal(false);
                    }}
                    className="text-zinc-500 font-bold text-[14px] px-3 py-2 hover:bg-zinc-50 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="text-[#00a884] font-bold text-[14px] px-3 py-2 hover:bg-zinc-50 rounded-lg cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 5: DEFAULT COMMUNITIES LIST VIEW
  // ==========================================
  return (
    <div className="w-full bg-white text-[#1c2e35] antialiased min-h-screen flex flex-col pb-24 font-sans select-none">
      {/* Top Header */}
      <header className="sticky top-0 bg-white z-40 px-4 py-3.5 flex justify-between items-center">
        <h1 className="text-[22px] font-bold text-[#1c2e35] font-sans">Communities</h1>
        <div className="flex items-center gap-4 text-[#3b4a54] dark:text-white">
          <button 
            onClick={toggleTheme}
            aria-label="Toggle Theme" 
            className="p-1 hover:bg-zinc-100 rounded-full transition-colors active:scale-95 cursor-pointer text-[#3b4a54] dark:text-white"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isDarkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>
          
          <button aria-label="More options" className="p-1 hover:bg-zinc-100 rounded-full transition-colors active:scale-95">
            <span className="material-symbols-outlined text-[24px]">more_vert</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-3xl mx-auto">
        {/* New Community Row */}
        <div 
          onClick={handleStartFlow}
          className="flex items-center px-4 py-3 cursor-pointer hover:bg-zinc-50 active:bg-zinc-100 transition-colors"
        >
          <div className="relative shrink-0 mr-4">
            <div className="w-[48px] h-[48px] rounded-[12px] bg-[#dfe5e7] text-[#54656f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] fill">groups</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#00a884] text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
              <span className="material-symbols-outlined text-[12px] font-bold">add</span>
            </div>
          </div>
          <span className="text-[16px] font-bold text-[#1c2e35]">New community</span>
        </div>

        {/* User created communities list */}
        {userCommunities.map((comm) => (
          <div key={comm.id}>
            {/* Thick Divider */}
            <div className="h-3 bg-[#f5f6f6] border-t border-b border-zinc-100/80"></div>
            
            <section className="flex flex-col">
              {/* Community Header */}
              <div 
                onClick={() => {
                  setActiveInfoComm({
                    id: comm.id,
                    name: comm.name,
                    description: comm.description || "No description provided.",
                    groups: comm.groups || [],
                    isNewFlow: false
                  });
                  setInfoTab("community");
                  setStep("info");
                }}
                className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer border-b border-zinc-100"
              >
                <div className="w-[48px] h-[48px] rounded-[12px] shrink-0 mr-4 border border-[#00a884]/20 bg-[#00a884]/5 flex items-center justify-center text-[#008069]">
                  <span className="material-symbols-outlined text-[28px] fill">groups</span>
                </div>
                <span className="text-[16.5px] font-bold text-[#1c2e35]">{comm.name}</span>
              </div>

              {/* Sub-items */}
              <div className="flex flex-col">
                {/* Announcements */}
                <div className="flex items-start px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer">
                  <div className="w-[48px] h-[48px] rounded-[12px] bg-[#e6f5ef] text-[#0f8b5d] flex items-center justify-center shrink-0 mr-4">
                    <span className="material-symbols-outlined text-[24px]">campaign</span>
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-[15.5px] font-bold text-[#1c2e35] truncate">Announcements</h4>
                      <span className="text-[12px] text-[#667781] shrink-0 font-medium">13:06</span>
                    </div>
                    <p className="text-[13.5px] text-[#667781] truncate font-normal">
                      Add members to start chatting
                    </p>
                  </div>
                </div>

                {/* Sub groups */}
                {comm.groups.map((group, gIdx) => (
                  <div key={gIdx} className="flex items-start px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer">
                    <div className="w-[48px] h-[48px] rounded-full bg-[#dfe5e7] text-[#54656f] flex items-center justify-center shrink-0 mr-4">
                      <span className="material-symbols-outlined text-[26px] fill opacity-80">groups</span>
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="text-[15.5px] font-bold text-[#1c2e35] truncate">{group}</h4>
                        <span className="text-[12px] text-[#667781] shrink-0 font-medium">13:06</span>
                      </div>
                      <p className="text-[13.5px] text-[#667781] truncate font-normal">
                        Add members to start chatting
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ))}

        {/* Thick Divider */}
        <div className="h-3 bg-[#f5f6f6] border-t border-b border-zinc-100/80"></div>

        {/* Zara Ali Community */}
        <section className="flex flex-col">
          {/* Community Header */}
          <div 
            onClick={() => {
              setActiveInfoComm({
                id: "zara-ali",
                name: "Zara Ali",
                description: "Hi everyone! This community is for Zara Ali members to stay updated on event schedules, meetings, and important notifications.",
                groups: ["earning house", "Linkedin Agent"],
                isNewFlow: false
              });
              setInfoTab("community");
              setStep("info");
            }}
            className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer border-b border-zinc-100"
          >
            <div className="w-[48px] h-[48px] rounded-[12px] overflow-hidden shrink-0 mr-4 border border-zinc-100 bg-zinc-100 flex items-center justify-center">
              <img
                className="w-full h-full object-cover"
                alt="Zara Ali Community avatar"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80"
              />
            </div>
            <span className="text-[16.5px] font-bold text-[#1c2e35]">Zara Ali</span>
          </div>

          {/* Sub-items */}
          <div className="flex flex-col">
            {/* New Group LinkedIn Agent added */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer">
              <div className="w-[48px] h-[48px] rounded-full bg-[#e6f5ef] text-[#0f8b5d] flex items-center justify-center shrink-0 mr-4">
                <span className="material-symbols-outlined text-[24px]">notifications</span>
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-[14.5px] text-[#667781] truncate font-normal">
                  New group &quot;Linkedin Agent&quot; added
                </p>
              </div>
              <div className="shrink-0 mr-1">
                <span className="w-2.5 h-2.5 bg-[#00a884] rounded-full inline-block"></span>
              </div>
            </div>

            {/* Announcements */}
            <div className="flex items-start px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer">
              <div className="w-[48px] h-[48px] rounded-[12px] bg-[#e6f5ef] text-[#0f8b5d] flex items-center justify-center shrink-0 mr-4">
                <span className="material-symbols-outlined text-[24px]">campaign</span>
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="text-[15.5px] font-bold text-[#1c2e35] truncate">Announcements</h4>
                  <span className="text-[12px] text-[#667781] shrink-0 font-medium">Yesterday</span>
                </div>
                <p className="text-[13.5px] text-[#667781] truncate font-normal">
                  +92 306 0969860: Kesi k pas number...
                </p>
              </div>
              <div className="shrink-0 self-end mr-1 text-[#8696a0]">
                <span className="inline-block text-[11px] font-semibold text-zinc-500 border border-zinc-200 rounded px-1.5 py-0.5 bg-zinc-50 leading-none">
                  Archived
                </span>
              </div>
            </div>

            {/* earning house */}
            <div className="flex items-start px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer">
              <div className="w-[48px] h-[48px] rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 mr-4 border border-zinc-100">
                <span className="text-[9px] font-bold tracking-tight text-center leading-tight uppercase p-1">Earning House</span>
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="text-[15.5px] font-bold text-[#1c2e35] truncate">earning house</h4>
                  <span className="text-[12px] text-[#667781] shrink-0 font-medium">11:57</span>
                </div>
                <p className="text-[13.5px] text-[#667781] truncate font-normal">
                  +91 97830 06665 joined using a group link.
                </p>
              </div>
            </div>

            {/* View all */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer text-[#54656f]">
              <span className="material-symbols-outlined text-[20px] shrink-0 mr-7 ml-3.5">chevron_right</span>
              <span className="text-[15px] font-semibold">View all</span>
            </div>
          </div>
        </section>

        {/* Thick Divider */}
        <div className="h-3 bg-[#f5f6f6] border-t border-b border-zinc-100/80"></div>

        {/* GDG OnCampus Community */}
        <section className="flex flex-col">
          {/* Community Header */}
          <div 
            onClick={() => {
              setActiveInfoComm({
                id: "gdg",
                name: "GDG OnCampus, Sunstone, Sage University",
                description: "Official community for GDG OnCampus at Sage University. Connect with student developers, get event announcements, workshop links, and resource drives.",
                groups: ["Frontend Dev Debugshala"],
                isNewFlow: false
              });
              setInfoTab("community");
              setStep("info");
            }}
            className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer border-b border-zinc-100"
          >
            {/* GDG Colorful Bracket Logo SVG */}
            <div className="w-[48px] h-[48px] rounded-[12px] overflow-hidden shrink-0 mr-4 border border-zinc-100 bg-[#f8f9fa] flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                <path d="M7.5 18L3 12L7.5 6" stroke="#4285F4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5 6L21 12L16.5 18" stroke="#EA4335" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 19L14 5" stroke="#FBBC05" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="2" fill="#34A853" />
              </svg>
            </div>
            <span className="text-[16.5px] font-bold text-[#1c2e35] truncate max-w-[80%]">
              GDG OnCampus, Sunstone, Sage University I...
            </span>
          </div>

          {/* Sub-items */}
          <div className="flex flex-col">
            {/* Announcements */}
            <div className="flex items-start px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer">
              <div className="w-[48px] h-[48px] rounded-[12px] bg-[#e6f5ef] text-[#0f8b5d] flex items-center justify-center shrink-0 mr-4">
                <span className="material-symbols-outlined text-[24px]">campaign</span>
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="text-[15.5px] font-bold text-[#1c2e35] truncate">Announcements</h4>
                  <span className="text-[12px] text-[#667781] shrink-0 font-medium">19/06/2026</span>
                </div>
                <p className="text-[13.5px] text-[#667781] truncate font-normal">
                  +91 88897 01865: Odoo India is hosting its...
                </p>
              </div>
              <div className="shrink-0 self-end mr-1 text-[#8696a0]">
                <span className="material-symbols-outlined text-[19px]">notifications_off</span>
              </div>
            </div>

            {/* Frontend Dev Debugshala */}
            <div className="flex items-start px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer">
              <div className="w-[48px] h-[48px] rounded-full bg-[#dfe5e7] text-[#54656f] flex items-center justify-center shrink-0 mr-4">
                <span className="material-symbols-outlined text-[26px] fill opacity-80">groups</span>
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="text-[15.5px] font-bold text-[#1c2e35] truncate">
                    Frontend Dev Debugshala X GDG...
                  </h4>
                  <span className="text-[12px] text-[#667781] shrink-0 font-medium">13/06/2026</span>
                </div>
                <p className="text-[13.5px] text-[#667781] truncate font-normal">
                  +91 89570 71248 joined from the community
                </p>
              </div>
              <div className="shrink-0 self-end mr-1 text-[#8696a0]">
                <span className="material-symbols-outlined text-[19px]">notifications_off</span>
              </div>
            </div>

            {/* View all */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer text-[#54656f]">
              <span className="material-symbols-outlined text-[20px] shrink-0 mr-7 ml-3.5">chevron_right</span>
              <span className="text-[15px] font-semibold">View all</span>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
