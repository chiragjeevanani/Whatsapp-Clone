"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

const INITIAL_CHATS = [
  {
    id: "appzeto-official",
    name: "Appzeto_Official",
    avatar: null,
    avatarText: "Appzeto",
    avatarBg: "bg-teal-50 text-teal-600 font-bold border border-teal-100",
    time: "15/06/2026",
    message: "appzeto hr Sir removed +91 74899 09308",
    unread: 0,
    isGroup: true,
    isPinned: true,
    doubleCheck: false,
  },
  {
    id: "chirag",
    name: "Chirag (You)",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtSTDTUitRQB5aG-ZcdFAsyFdP86mWxvW55CsH3fDZwlfJQzUR8Xav3ghPt6k07h7ujn8WjMnfUwokeODYvQGKKOm7F33aNS0EEnqaoctdIhY8ELBRO8tQR6mKm8_M0WvqegMqhtKgIxXjkXMfUbV5OAZ2iz0uoTKeVH-5FFp1KbmYjoXhls-OIQUHDnNB91KgpZba0PQ5hk-LVeGan4gFJdAzjvJk3mHfnEHBA8mO8nDZBHLChXewILCZaO_GNayQUdKeTWP5oeQ",
    time: "11:33",
    message: "Photo",
    unread: 0,
    isGroup: false,
    isPinned: true,
    doubleCheck: true,
    hasPhotoIcon: true,
    isFavourite: true,
  },
  {
    id: "kittu",
    name: "Kittu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD209t6Zin8k_HGjBSvGIRB_KONmSIL8sbz2S-MQFb6yxRje3Ge3PGp-yyOH_yZg4mCb_u8FkyApwL2yhfjFnLSiwHkH3lawFQHkpZmSRXx5D7BGsdZYSdvP6PhIeM3t9PjrvbV02NUdZMoHPGEZ-ZwJRlrv8enxQjqxirmtclZn9U_UQz7m55E9_VQNGreM6hRVv44INUgYZ7PQRf4Oct93w5plsG6f9LeRAuAOZt_QSgliP9AOs46NF7TylHhikGVRGfXyCWVFLo",
    time: "12:49",
    message: "https://youtu.be/uBotyv_TSZg",
    unread: 0,
    isGroup: false,
    isPinned: false,
    doubleCheck: false,
    isFavourite: true,
  },
  {
    id: "linkage-cocio",
    name: "Linkage Cocio mobile application devel...",
    avatar: null,
    avatarBg: "bg-orange-100 text-orange-500",
    time: "12:44",
    message: "+91 93040 31739: @all It is very sad to s...",
    unread: 7,
    isGroup: true,
    isPinned: false,
    doubleCheck: false,
    hasMention: true,
  },
  {
    id: "rydox-master",
    name: "Rydox Master Product + Franchisee M...",
    avatar: null,
    avatarBg: "bg-emerald-100 text-emerald-600",
    time: "12:10",
    message: "Sagar | Appzeto: @all",
    unread: 65,
    isGroup: true,
    isPinned: false,
    doubleCheck: false,
    hasMention: true,
  },
  {
    id: "sunil-kumar",
    name: "Sunil Kumar HS Application Developm...",
    avatar: null,
    avatarBg: "bg-amber-100 text-amber-700",
    time: "12:09",
    message: "+91 98452 96998: Pricing will be on category",
    unread: 7,
    isGroup: true,
    isPinned: false,
    doubleCheck: false,
    isArchived: true,
  },
  {
    id: "cleanzo",
    name: "Cleanzo Android+iOS mobile Applicati...",
    avatar: null,
    avatarBg: "bg-blue-100 text-blue-600",
    avatarText: "Cleanzo",
    time: "12:07",
    message: "Ujjawal appzeto: Okay sir",
    unread: 18,
    isGroup: true,
    isPinned: false,
    doubleCheck: false,
    isArchived: true,
  },
  {
    id: "sui-iac",
    name: "SUI IAC BTech CSE 2022-26 Passout",
    avatar: null,
    avatarBg: "bg-rose-100 text-rose-700",
    avatarText: "SUI",
    time: "Yesterday",
    message: "Dr Meenakshi Joshi Maam Sage: 📷 CAMPU...",
    unread: 2,
    isGroup: true,
    isPinned: false,
    doubleCheck: false,
    isArchived: true,
  },
  {
    id: "sikh-street",
    name: "Sikh Street (Android iOS)",
    avatar: null,
    avatarBg: "bg-emerald-100 text-emerald-600",
    time: "18:41",
    message: "Amit: Definitely sir",
    unread: 10,
    isGroup: true,
    isPinned: false,
    doubleCheck: false,
    isLocked: true,
  },
  {
    id: "stuti-pyarii",
    name: "Stuti Pyarii Bhnaaa✨",
    avatar: null,
    avatarBg: "bg-rose-100 text-rose-700",
    time: "17:58",
    message: "Abhi tk kuch bnaya h ya ni phle toh ye btaoo",
    unread: 0,
    isGroup: false,
    isPinned: false,
    doubleCheck: false,
    isLocked: true,
  },
  {
    id: "web-app-ankit",
    name: "Web App Ankit",
    avatar: null,
    avatarBg: "bg-orange-100 text-orange-600",
    time: "Yesterday",
    message: "+91 93019 88718: 📄 quickemart_deliver...",
    unread: 1,
    isGroup: false,
    isPinned: false,
    doubleCheck: false,
    isArchived: true,
  },
  {
    id: "appzeto-hr-sir",
    name: "appzeto hr Sir",
    avatar: null,
    avatarBg: "bg-zinc-100 text-zinc-600",
    time: "Yesterday",
    message: "ok",
    unread: 0,
    isGroup: false,
    isPinned: false,
    doubleCheck: false,
    isArchived: true,
  },
  {
    id: "app-store-deployment",
    name: "App Store Deployment (IOS)",
    avatar: null,
    avatarBg: "bg-indigo-100 text-indigo-700",
    time: "18:04",
    message: "+91 83499 36670: @Prachi Porwal Appzeto",
    unread: 6,
    isGroup: true,
    isPinned: false,
    doubleCheck: false,
  },
  {
    id: "sagar-appzeto",
    name: "Sagar Appzeto",
    avatar: null,
    avatarBg: "bg-rose-100 text-rose-700",
    time: "15:20",
    message: "Please check the build",
    unread: 0,
    isGroup: false,
    isPinned: false,
    doubleCheck: true,
  },
  {
    id: "rahul-sharma",
    name: "Rahul Sharma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80",
    time: "14:15",
    message: "Will meet tomorrow at 10 AM",
    unread: 2,
    isGroup: false,
    isPinned: false,
    doubleCheck: false,
    isFavourite: true,
  },
  {
    id: "hr-recruiter",
    name: "HR Recruiter Zetto",
    avatar: null,
    avatarBg: "bg-teal-100 text-teal-700",
    time: "Yesterday",
    message: "Welcome to the team!",
    unread: 0,
    isGroup: false,
    isPinned: false,
    doubleCheck: true,
  },
];

const CONTACTS_LIST = [
  {
    id: "chirag-you",
    name: "Chirag (You)",
    subtext: "Message yourself",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtSTDTUitRQB5aG-ZcdFAsyFdP86mWxvW55CsH3fDZwlfJQzUR8Xav3ghPt6k07h7ujn8WjMnfUwokeODYvQGKKOm7F33aNS0EEnqaoctdIhY8ELBRO8tQR6mKm8_M0WvqegMqhtKgIxXjkXMfUbV5OAZ2iz0uoTKeVH-5FFp1KbmYjoXhls-OIQUHDnNB91KgpZba0PQ5hk-LVeGan4gFJdAzjvJk3mHfnEHBA8mO8nDZBHLChXewILCZaO_GNayQUdKeTWP5oeQ",
  },
  {
    id: "c1",
    name: "******8547",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&fit=crop&q=80",
  },
  {
    id: "c2",
    name: "+91 95105 91925",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&fit=crop&q=80",
  },
  {
    id: "c3",
    name: "~Mahi Tanpure Sage",
    avatarBg: "bg-purple-100 text-purple-700",
    avatarIcon: "person",
  },
  {
    id: "c4",
    name: "Aakash Sage",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&q=80",
  },
  {
    id: "c5",
    name: "Aashay",
    avatarBg: "bg-blue-100 text-blue-700",
    avatarText: "A",
  },
  {
    id: "c6",
    name: "Aashutosh Malviya Sage",
    avatarBg: "bg-orange-100 text-orange-700",
    avatarText: "AM",
  },
  {
    id: "c7",
    name: "Aayushi Sage",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80",
  },
  {
    id: "c8",
    name: "Abhay",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&fit=crop&q=80",
  },
];

export default function ChatsPage() {
  const router = useRouter();
  const [showSelectContact, setShowSelectContact] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickProfileChat, setQuickProfileChat] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [isPinError, setIsPinError] = useState(false);
  const [showLockedChatsList, setShowLockedChatsList] = useState(false);
  const [showArchivedChatsList, setShowArchivedChatsList] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const { isDarkMode, toggleTheme } = useTheme();

  const [chats, setChats] = useState(() => INITIAL_CHATS);
  const [hasProcessedScan, setHasProcessedScan] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined" || hasProcessedScan) return;
    const urlParams = new URLSearchParams(window.location.search);
    const scanPhone = urlParams.get("scanPhone");
    if (scanPhone) {
      setHasProcessedScan(true);
      const formattedPhone = decodeURIComponent(scanPhone).trim();
      // Check if chat already exists
      const existing = chats.find(c => c.name.includes(formattedPhone) || c.id === formattedPhone);
      if (existing) {
        router.push(`/chats/${existing.id}`);
      } else {
        // Create new dynamic chat and redirect
        const newId = `chat_${Date.now()}`;
        const newChat = {
          id: newId,
          name: formattedPhone,
          avatar: null,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          message: "Scan code successful! Say Hello 👋",
          unread: 0,
          isGroup: false,
          isPinned: false,
          doubleCheck: false,
        };
        setChats(prev => [newChat, ...prev]);
        router.push(`/chats/${newId}`);
      }
    }
  }, [router, chats, hasProcessedScan]);

  useEffect(() => {
    const shouldHide = !!(showLockedChatsList || showArchivedChatsList);
    window.dispatchEvent(new CustomEvent("hide-bottom-nav", { detail: shouldHide }));
    return () => {
      window.dispatchEvent(new CustomEvent("hide-bottom-nav", { detail: false }));
    };
  }, [showLockedChatsList, showArchivedChatsList]);

  const handleChatClick = useCallback((id) => {
    router.push(`/chats/${id}`);
  }, [router]);

  const handlePinSubmit = useCallback((e) => {
    e.preventDefault();
    if (pinValue === "1234") {
      setIsPinError(false);
      setShowPinModal(false);
      setShowLockedChatsList(true);
    } else {
      setIsPinError(true);
    }
  }, [pinValue]);

  const archivedChatsCount = useMemo(() => {
    return chats.filter(c => c.isArchived).length;
  }, [chats]);

  const filteredChats = useMemo(() => {
    return chats
      .filter(chat => !chat.isLocked && !chat.isArchived)
      .filter((chat) => {
        if (activeFilter === "unread") return chat.unread > 0;
        if (activeFilter === "favourites") return chat.isFavourite;
        if (activeFilter === "groups") return chat.isGroup;
        return true;
      });
  }, [chats, activeFilter]);

  const lockedChats = useMemo(() => {
    return chats.filter(chat => chat.isLocked);
  }, [chats]);

  const archivedChats = useMemo(() => {
    return chats.filter(chat => chat.isArchived);
  }, [chats]);

  // 1. SELECT CONTACT OVERLAY VIEW (NEW CHAT FAB)
  if (showSelectContact) {
    return (
      <div className="w-full bg-white text-[#1c2e35] antialiased min-h-screen flex flex-col font-sans select-none relative">
        {/* Header */}
        <header className="px-4 py-3 flex justify-between items-center sticky top-0 bg-white z-40 border-b border-zinc-50">
          <div className="flex items-center">
            <button
              onClick={() => {
                setShowSelectContact(false);
                setSearchQuery("");
              }}
              aria-label="Back"
              className="p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="flex flex-col ml-4 leading-tight">
              <span className="text-[17px] font-semibold text-[#1c2e35] tracking-wide">
                Select contact
              </span>
              <span className="text-[11.5px] text-[#667781] font-medium mt-0.5">
                759 contacts
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[#54656f]">
            <button aria-label="Search" className="p-1.5 hover:bg-zinc-100 rounded-full active:scale-95">
              <span className="material-symbols-outlined text-[24px]">search</span>
            </button>
            <button aria-label="More" className="p-1.5 hover:bg-zinc-100 rounded-full active:scale-95">
              <span className="material-symbols-outlined text-[24px]">more_vert</span>
            </button>
          </div>
        </header>

        {/* List scroll container */}
        <main className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {/* Option: New Group */}
          <div className="flex items-center py-3.5 cursor-pointer hover:bg-zinc-50 active:bg-zinc-100 transition-colors rounded-lg">
            <div className="w-[44px] h-[44px] rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0 mr-4">
              <span className="material-symbols-outlined text-[22px]">group_add</span>
            </div>
            <span className="text-[15.5px] font-bold text-[#1c2e35]">New group</span>
          </div>

          {/* Option: New Contact */}
          <div className="flex items-center justify-between py-3.5 cursor-pointer hover:bg-zinc-50 active:bg-zinc-100 transition-colors rounded-lg">
            <div className="flex items-center">
              <div className="w-[44px] h-[44px] rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0 mr-4">
                <span className="material-symbols-outlined text-[22px]">person_add</span>
              </div>
              <span className="text-[15.5px] font-bold text-[#1c2e35]">New contact</span>
            </div>
            <span className="material-symbols-outlined text-[22px] text-[#667781] mr-1">qr_code_2</span>
          </div>

          {/* Option: New Community */}
          <div className="flex items-center py-3.5 cursor-pointer hover:bg-zinc-50 active:bg-zinc-100 transition-colors rounded-lg">
            <div className="w-[44px] h-[44px] rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0 mr-4">
              <span className="material-symbols-outlined text-[22px] fill">groups</span>
            </div>
            <span className="text-[15.5px] font-bold text-[#1c2e35]">New community</span>
          </div>

          {/* Section: Contacts on AppMetaChat */}
          <div className="text-[13.5px] font-bold text-[#667781] pt-4 pb-2">
            Contacts on AppMetaChat
          </div>
          <div className="flex flex-col pb-10">
            {CONTACTS_LIST.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setShowSelectContact(false);
                  router.push(`/chats/${c.id}`);
                }}
                className="flex items-center gap-3.5 py-3 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer"
              >
                {c.avatar ? (
                  <div className="w-[48px] h-[48px] rounded-full overflow-hidden shrink-0">
                    <img className="w-full h-full object-cover" alt={c.name} src={c.avatar} loading="lazy" decoding="async" />
                  </div>
                ) : (
                  <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 text-[15.5px] font-bold ${c.avatarBg || "bg-teal-50 text-teal-600 border border-teal-100"}`}>
                    {c.avatarText || c.name.charAt(0)}
                  </div>
                )}

                <div className="flex-grow min-w-0 border-b border-zinc-100 pb-3 flex flex-col justify-center">
                  <span className="text-[15.5px] font-bold text-[#1c2e35] truncate leading-snug">{c.name}</span>
                  {c.subtext && <span className="text-[12.5px] text-[#667781] truncate mt-0.5">{c.subtext}</span>}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // 2. MAIN CHATS LIST VIEW
  return (
    <div className="w-full bg-white text-[#1c2e35] antialiased min-h-screen flex flex-col pb-24 font-sans select-none">
      {/* Top Header */}
      <header className="sticky top-0 bg-white z-40 px-4 pt-3 pb-2 flex justify-between items-center">
        <div className="h-[38px] overflow-hidden flex items-center select-none cursor-pointer">
          <img
            src={isDarkMode ? "/darklogo.png" : "/image.png"}
            alt="AppMetaChat"
            className={`w-auto max-w-none object-contain ${
              isDarkMode ? "h-[200px] -translate-x-[5px] translate-y-[5px]" : "h-[190px] translate-y-[6px]"
            }`}
          />
        </div>
        <div className="flex items-center gap-5 text-[#3b4a54]">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-1 hover:bg-zinc-100 rounded-full transition-colors active:scale-95 cursor-pointer text-[#3b4a54] dark:text-white"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isDarkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              aria-label="More options"
              className={`p-1 hover:bg-zinc-100 rounded-full transition-colors active:scale-95 cursor-pointer ${showMoreMenu ? "bg-zinc-100" : ""}`}
            >
              <span className="material-symbols-outlined text-[24px]">more_vert</span>
            </button>

            {showMoreMenu && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setShowMoreMenu(false)}
                />
                <div className="absolute right-0 top-9 w-[205px] bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] py-1.5 z-50 text-[#111b21] animate-in fade-in zoom-in-95 duration-100 origin-top-right border border-zinc-100">
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowSelectContact(true);
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-zinc-50 transition-colors font-medium text-[15px] cursor-pointer"
                  >
                    New group
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      router.push("/communities?action=new");
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-zinc-50 transition-colors font-medium text-[15px] cursor-pointer"
                  >
                    New community
                  </button>
                  <button
                    onClick={() => setShowMoreMenu(false)}
                    className="w-full text-left px-5 py-3 hover:bg-zinc-50 transition-colors font-medium text-[15px] cursor-pointer"
                  >
                    Broadcast lists
                  </button>
                  <button
                    onClick={() => setShowMoreMenu(false)}
                    className="w-full text-left px-5 py-3 hover:bg-zinc-50 transition-colors font-medium text-[15px] cursor-pointer"
                  >
                    Linked devices
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setActiveFilter("favourites");
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-zinc-50 transition-colors font-medium text-[15px] cursor-pointer"
                  >
                    Starred
                  </button>
                  <button
                    onClick={() => setShowMoreMenu(false)}
                    className="w-full text-left px-5 py-3 hover:bg-zinc-50 transition-colors font-medium text-[15px] cursor-pointer"
                  >
                    Payments
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setChats(prev => prev.map(c => ({ ...c, unread: 0 })));
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-zinc-50 transition-colors font-medium text-[15px] cursor-pointer"
                  >
                    Read all
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      router.push("/settings");
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-zinc-50 transition-colors font-medium text-[15px] flex items-center justify-between cursor-pointer"
                  >
                    <span>Settings</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00a884]"></span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Search / Meta AI Bar */}
      <div className="px-4 pt-0.5 pb-1.5">
        <div className="w-full bg-[#f0f2f5] rounded-full flex items-center px-4 py-2.5 gap-3 shadow-none border border-transparent focus-within:border-zinc-200">
          <span className="material-symbols-outlined text-[#667781] text-[20px]">search</span>
          <span className="text-[#667781] text-[14.5px] font-normal">Ask Meta AI or Search</span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3.5 py-1.5 rounded-full shrink-0 active:scale-95 transition-all text-[13.5px] cursor-pointer ${activeFilter === "all" ? "bg-[#e6f5ef] text-[#0f8b5d] font-semibold" : "bg-[#f0f2f5] text-[#54656f] font-medium hover:bg-zinc-200"
            }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter("unread")}
          className={`px-3.5 py-1.5 rounded-full shrink-0 active:scale-95 transition-all text-[13.5px] cursor-pointer flex items-center gap-1 ${activeFilter === "unread" ? "bg-[#e6f5ef] text-[#0f8b5d] font-semibold" : "bg-[#f0f2f5] text-[#54656f] font-medium hover:bg-zinc-200"
            }`}
        >
          Unread <span className="text-xs bg-[#e1e3e6] px-1 rounded-full text-zinc-600">99+</span>
        </button>
        <button
          onClick={() => setActiveFilter("favourites")}
          className={`px-3.5 py-1.5 rounded-full shrink-0 active:scale-95 transition-all text-[13.5px] cursor-pointer ${activeFilter === "favourites" ? "bg-[#e6f5ef] text-[#0f8b5d] font-semibold" : "bg-[#f0f2f5] text-[#54656f] font-medium hover:bg-zinc-200"
            }`}
        >
          Favourites
        </button>
        <button
          onClick={() => setActiveFilter("groups")}
          className={`px-3.5 py-1.5 rounded-full shrink-0 active:scale-95 transition-all text-[13.5px] cursor-pointer flex items-center gap-1 ${activeFilter === "groups" ? "bg-[#e6f5ef] text-[#0f8b5d] font-semibold" : "bg-[#f0f2f5] text-[#54656f] font-medium hover:bg-zinc-200"
            }`}
        >
          Groups <span className="text-xs bg-[#e1e3e6] px-1 rounded-full text-zinc-600">95</span>
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-[#f0f2f5] text-[#54656f] rounded-full shrink-0 active:scale-95 cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
      </div>

      {/* Locked Chats Row */}
      <div
        onClick={() => {
          setPinValue("");
          setIsPinError(false);
          setShowPinModal(true);
        }}
        className="px-5 py-3.5 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer active:bg-zinc-100"
      >
        <div className="flex items-center gap-6">
          <span className="material-symbols-outlined text-[#667781] text-[22px]">lock</span>
          <span className="text-[16px] font-semibold text-[#1c2e35] tracking-wide">Locked chats</span>
        </div>
      </div>

      {/* Archived Row */}
      <div
        onClick={() => setShowArchivedChatsList(true)}
        className="px-5 py-3.5 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer active:bg-zinc-100"
      >
        <div className="flex items-center gap-6">
          <span className="material-symbols-outlined text-[#667781] text-[22px]">archive</span>
          <span className="text-[16px] font-semibold text-[#1c2e35] tracking-wide">Archived</span>
        </div>
        <span className="text-[12.5px] font-bold text-[#00a884] mr-1">
          {archivedChatsCount}
        </span>
      </div>

      {/* Chat List */}
      <main className="flex-1 w-full">
        <ul className="flex flex-col">
          {filteredChats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className="flex items-center px-4 py-3 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer"
            >
              {/* Avatar Column */}
              <div
                className="relative shrink-0 mr-3.5 cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuickProfileChat(chat);
                }}
              >
                {chat.avatar ? (
                  <div className="w-[52px] h-[52px] rounded-full overflow-hidden border border-zinc-100">
                    <img alt={chat.name} className="w-full h-full object-cover" src={chat.avatar} loading="lazy" decoding="async" />
                  </div>
                ) : (
                  <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center ${chat.avatarBg || "bg-[#dfe5e7] text-[#54656f]"} font-semibold text-sm overflow-hidden`}>
                    {chat.avatarText ? (
                      <span className="text-[11px] font-bold leading-none tracking-tight text-center px-1 truncate w-full">{chat.avatarText}</span>
                    ) : (
                      <span className="material-symbols-outlined text-[30px] fill opacity-80">groups</span>
                    )}
                  </div>
                )}
              </div>

              {/* Chat info column */}
              <div className="flex-1 min-w-0 flex flex-col justify-center border-none">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h2 className="text-[16px] font-bold text-[#1c2e35] truncate tracking-wide max-w-[75%]">
                    {chat.name}
                  </h2>
                  <span className={`text-[12px] shrink-0 font-medium ${chat.unread > 0 ? "text-[#00a884] font-bold" : "text-[#667781]"}`}>
                    {chat.time}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 min-w-0 text-[14px]">
                    {chat.doubleCheck && (
                      <span className="material-symbols-outlined text-[17px] text-[#53bdeb] shrink-0">
                        done_all
                      </span>
                    )}
                    {chat.hasPhotoIcon && (
                      <span className="material-symbols-outlined text-[17px] text-[#667781] shrink-0">
                        photo
                      </span>
                    )}
                    <span className="text-[#667781] truncate font-normal">
                      {chat.message}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {chat.hasMention && (
                      <span className="material-symbols-outlined text-[18px] text-[#00a884] font-bold">
                        alternate_email
                      </span>
                    )}
                    {chat.unread > 0 && (
                      <span className="inline-flex items-center justify-center bg-[#00a884] text-white text-[11px] font-bold w-[21px] h-[21px] rounded-full">
                        {chat.unread}
                      </span>
                    )}
                    {chat.isPinned && (
                      <span className="material-symbols-outlined text-[18px] text-[#667781] rotate-45 transform scale-x-[-1]">
                        push_pin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
          <li className="h-10"></li>
          <li className="h-10"></li>
        </ul>
      </main>

      {/* Floating Action Button */}
      <div className="absolute bottom-24 right-4 z-40">
        <button
          onClick={() => setShowSelectContact(true)}
          aria-label="New Message"
          className="w-[54px] h-[54px] bg-[#00a884] text-white rounded-[16px] shadow-lg flex items-center justify-center hover:bg-[#008f70] transition-colors duration-150 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">chat_add_on</span>
        </button>
      </div>

      {/* Quick Profile Modal */}
      <AnimatePresence>
        {quickProfileChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setQuickProfileChat(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="bg-white w-[250px] overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Layer (layered over image) */}
              <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/50 to-transparent p-3 text-white z-10 flex items-start pointer-events-none">
                <span className="text-[17px] font-medium truncate w-full tracking-wide">
                  {quickProfileChat.name}
                </span>
              </div>

              {/* Avatar / Image Box */}
              <div className="w-[250px] h-[250px] bg-zinc-100 flex items-center justify-center overflow-hidden relative">
                {quickProfileChat.avatar ? (
                  <img
                    src={quickProfileChat.avatar}
                    alt={quickProfileChat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${quickProfileChat.avatarBg || "bg-[#dfe5e7] text-[#54656f]"} font-semibold text-lg`}>
                    {quickProfileChat.avatarText ? (
                      <span className="text-4xl font-bold leading-none tracking-tight text-center px-2 truncate w-full">
                        {quickProfileChat.avatarText}
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[100px] fill opacity-80">
                        groups
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex justify-around items-center h-12 bg-white border-t border-zinc-100 py-1">
                <button
                  onClick={() => {
                    setQuickProfileChat(null);
                    router.push(`/chats/${quickProfileChat.id}`);
                  }}
                  className="flex items-center justify-center w-12 h-10 hover:bg-zinc-50 active:bg-zinc-100 rounded-full transition-colors cursor-pointer text-[#0b805c]"
                  aria-label="Send Message"
                >
                  <span className="material-symbols-outlined text-[22px]">chat</span>
                </button>
                <button
                  onClick={() => {
                    setQuickProfileChat(null);
                    router.push(`/calls`);
                  }}
                  className="flex items-center justify-center w-12 h-10 hover:bg-zinc-50 active:bg-zinc-100 rounded-full transition-colors cursor-pointer text-[#0b805c]"
                  aria-label="Voice Call"
                >
                  <span className="material-symbols-outlined text-[22px]">call</span>
                </button>
                <button
                  onClick={() => {
                    setQuickProfileChat(null);
                    router.push(`/calls`);
                  }}
                  className="flex items-center justify-center w-12 h-10 hover:bg-zinc-50 active:bg-zinc-100 rounded-full transition-colors cursor-pointer text-[#0b805c]"
                  aria-label="Video Call"
                >
                  <span className="material-symbols-outlined text-[22px]">videocam</span>
                </button>
                <button
                  onClick={() => {
                    setQuickProfileChat(null);
                    router.push(`/chats/${quickProfileChat.id}/profile`);
                  }}
                  className="flex items-center justify-center w-12 h-10 hover:bg-zinc-50 active:bg-zinc-100 rounded-full transition-colors cursor-pointer text-[#0b805c]"
                  aria-label="Info"
                >
                  <span className="material-symbols-outlined text-[22px]">info</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PIN Verification Modal Overlay */}
      {showPinModal && (
        <div className="absolute inset-0 z-[150] bg-black/60 flex items-center justify-center p-4 transition-all duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-[24px] overflow-hidden text-[#111b21] shadow-2xl flex flex-col font-sans select-none animate-in fade-in zoom-in-95 duration-150 p-6">
            <h3 className="text-[18px] font-bold text-[#111b21]">Locked Chats</h3>
            <p className="text-[13.5px] text-[#667781] mt-2 mb-4 leading-relaxed">
              Enter your passcode to view locked chats. <br />
              <span className="text-zinc-400 text-[12px] font-medium">(Hint PIN: 1234)</span>
            </p>

            <form onSubmit={handlePinSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                maxLength={4}
                pattern="[0-9]*"
                inputMode="numeric"
                value={pinValue}
                onChange={(e) => {
                  setPinValue(e.target.value);
                  setIsPinError(false);
                }}
                placeholder="••••"
                className="w-full bg-[#f0f2f5] border-none focus:outline-none rounded-xl py-3 px-4 text-center text-[22px] tracking-[8px] font-bold text-[#111b21]"
                autoFocus
              />

              {isPinError && (
                <span className="text-[12.5px] text-rose-500 font-semibold text-center">
                  Incorrect PIN. Please try again.
                </span>
              )}

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="text-zinc-600 hover:text-zinc-800 font-bold text-[14px] px-3 py-2 cursor-pointer active:scale-95 transition-transform"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-[#00a884] hover:text-[#008f70] font-bold text-[14px] px-3 py-2 cursor-pointer active:scale-95 transition-transform"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Locked Chats List Overlay */}
      {showLockedChatsList && (
        <div className="absolute inset-0 z-[150] bg-white flex flex-col font-sans select-none animate-in slide-in-from-right duration-250">
          {/* Header */}
          <header className="px-4 py-3 flex items-center bg-white border-b border-zinc-100 shrink-0">
            <button
              onClick={() => setShowLockedChatsList(false)}
              className="p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform text-[#1c2e35]"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="flex items-center gap-2 ml-4">
              <span className="material-symbols-outlined text-[20px] text-[#008069] fill">lock</span>
              <span className="text-[17px] font-bold text-[#1c2e35] tracking-wide">Locked chats</span>
            </div>
          </header>

          {/* List of Locked Chats */}
          <main className="flex-1 overflow-y-auto">
            <ul className="flex flex-col">
              {lockedChats.map((chat) => (
                <li
                  key={chat.id}
                  onClick={() => {
                    setShowLockedChatsList(false);
                    handleChatClick(chat.id);
                  }}
                  className="flex items-center px-4 py-3 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0 mr-3.5">
                    {chat.avatar ? (
                      <div className="w-[52px] h-[52px] rounded-full overflow-hidden border border-zinc-100">
                        <img alt={chat.name} className="w-full h-full object-cover" src={chat.avatar} loading="lazy" decoding="async" />
                      </div>
                    ) : (
                      <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center ${chat.avatarBg || "bg-[#dfe5e7] text-[#54656f]"} font-semibold text-sm overflow-hidden`}>
                        {chat.avatarText ? (
                          <span className="text-[11px] font-bold leading-none tracking-tight text-center px-1 truncate w-full">{chat.avatarText}</span>
                        ) : (
                          <span className="material-symbols-outlined text-[30px] fill opacity-80">person</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center border-none">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h2 className="text-[16px] font-bold text-[#1c2e35] truncate tracking-wide max-w-[75%]">
                        {chat.name}
                      </h2>
                      <span className="text-[12px] shrink-0 font-medium text-[#667781]">
                        {chat.time}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#667781] text-[14px] truncate font-normal">
                        {chat.message}
                      </span>
                      {chat.unread > 0 && (
                        <span className="inline-flex items-center justify-center bg-[#00a884] text-white text-[11px] font-bold w-[21px] h-[21px] rounded-full">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </main>
        </div>
      )}

      {/* Archived Chats List Overlay */}
      {showArchivedChatsList && (
        <div className="absolute inset-0 z-[150] bg-white flex flex-col font-sans select-none animate-in slide-in-from-right duration-250">
          {/* Header */}
          <header className="px-4 py-3 flex items-center bg-white border-b border-zinc-100 shrink-0">
            <button
              onClick={() => setShowArchivedChatsList(false)}
              className="p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform text-[#1c2e35] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="flex items-center gap-2 ml-4">
              <span className="material-symbols-outlined text-[20px] text-[#667781]">archive</span>
              <span className="text-[17px] font-bold text-[#1c2e35] tracking-wide">Archived chats</span>
            </div>
          </header>

          {/* List of Archived Chats */}
          <main className="flex-1 overflow-y-auto">
            <ul className="flex flex-col">
              {archivedChats.map((chat) => (
                <li
                  key={chat.id}
                  onClick={() => {
                    setShowArchivedChatsList(false);
                    handleChatClick(chat.id);
                  }}
                  className="flex items-center px-4 py-3 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0 mr-3.5">
                    {chat.avatar ? (
                      <div className="w-[52px] h-[52px] rounded-full overflow-hidden border border-zinc-100">
                        <img alt={chat.name} className="w-full h-full object-cover" src={chat.avatar} loading="lazy" decoding="async" />
                      </div>
                    ) : (
                      <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center ${chat.avatarBg || "bg-[#dfe5e7] text-[#54656f]"} font-semibold text-sm overflow-hidden`}>
                        {chat.avatarText ? (
                          <span className="text-[11px] font-bold leading-none tracking-tight text-center px-1 truncate w-full">{chat.avatarText}</span>
                        ) : (
                          <span className="material-symbols-outlined text-[30px] fill opacity-80">person</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center border-none">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h2 className="text-[16px] font-bold text-[#1c2e35] truncate tracking-wide max-w-[75%]">
                        {chat.name}
                      </h2>
                      <span className="text-[12px] shrink-0 font-medium text-[#667781]">
                        {chat.time}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#667781] text-[14px] truncate font-normal">
                        {chat.message}
                      </span>
                      {chat.unread > 0 && (
                        <span className="inline-flex items-center justify-center bg-[#00a884] text-white text-[11px] font-bold w-[21px] h-[21px] rounded-full">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </main>
        </div>
      )}
    </div>
  );
}
