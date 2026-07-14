"use client";

import { use, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getConversationDetails, favouriteConversation, clearConversation } from "@/services/chat/conversations";
import { blockUser, unblockUser } from "@/services/user/contacts";
import { getUserProfileById } from "@/services/user/profile";
import { lockChat } from "@/services/chat/chatActions";

const getAvatarUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const gatewayBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1").replace("/api/v1", "");
  return `${gatewayBase}${path}`;
};

const renderAvatar = (avatarUrl, name, sizeClass = "w-[115px] h-[115px]", iconSize = "text-[48px]") => {
  const resolvedUrl = getAvatarUrl(avatarUrl);
  if (resolvedUrl) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden border border-zinc-100 shrink-0`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="w-full h-full object-cover" alt={name} src={resolvedUrl} loading="lazy" decoding="async" />
      </div>
    );
  }

  const cleanName = name && name.startsWith("+") ? name.substring(1) : (name || "");
  const firstChar = cleanName.trim().charAt(0);
  const isNumber = !firstChar || /\d/.test(firstChar);

  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center shrink-0 bg-teal-50 text-[#00a884] border border-teal-100 font-bold`}>
      {isNumber ? (
        <span className={`material-symbols-outlined ${iconSize} fill`}>person</span>
      ) : (
        <span className="text-[28px] uppercase">{firstChar}</span>
      )}
    </div>
  );
};

export default function ContactProfilePage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const id = params.id;

  const [chatLock, setChatLock] = useState(false);
  const [translateMsg, setTranslateMsg] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [targetUserId, setTargetUserId] = useState(null);
  const [disappearingTimer, setDisappearingTimer] = useState("Off");
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (id) {
      setDisappearingTimer(localStorage.getItem("disappearingTimer_" + id) || "Off");
    }
  }, [id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    if (id) {
      const favIds = JSON.parse(localStorage.getItem("favouriteChatIds") || "[]");
      setIsFavourite(favIds.includes(id));
    }
  }, [id]);

  const handleToggleFavouriteProfile = async () => {
    const nextVal = !isFavourite;
    const favIds = JSON.parse(localStorage.getItem("favouriteChatIds") || "[]");
    if (nextVal) {
      if (!favIds.includes(id)) favIds.push(id);
    } else {
      const index = favIds.indexOf(id);
      if (index > -1) favIds.splice(index, 1);
    }
    localStorage.setItem("favouriteChatIds", JSON.stringify(favIds));
    setIsFavourite(nextVal);
    showToast(nextVal ? "Added to Favourites" : "Removed from Favourites");

    try {
      await favouriteConversation(id, nextVal);
    } catch (err) {
      console.error("Failed to sync favourite state to backend:", err);
    }
  };

  const handleToggleChatLock = async (checked) => {
    try {
      await lockChat(id, checked);
      setChatLock(checked);
      showToast(checked ? "Chat locked" : "Chat unlocked");
    } catch (err) {
      console.error("Failed to toggle chat lock:", err);
      showToast(err.message || "Failed to toggle chat lock");
    }
  };

  const handleToggleBlock = async () => {
    if (!targetUserId) return;
    const nextVal = !isBlocked;
    try {
      if (nextVal) {
        await blockUser(targetUserId);
        showToast(`${profileDetails.name} has been blocked.`);
      } else {
        await unblockUser(targetUserId);
        showToast(`${profileDetails.name} has been unblocked.`);
      }
      setIsBlocked(nextVal);
    } catch (err) {
      console.error("Failed to toggle block status:", err);
      showToast(err.message || "Failed to update block status.");
    }
  };

  const handleClearChat = async () => {
    const confirmClear = confirm("Are you sure you want to clear all messages in this chat?");
    if (!confirmClear) return;
    try {
      await clearConversation(id);
      showToast("Chat cleared successfully!");
      setTimeout(() => {
        router.push(`/chats/${id}`);
      }, 1000);
    } catch (err) {
      console.error("Failed to clear chat:", err);
      showToast(err.message || "Failed to clear chat.");
    }
  };

  const handleAddToList = () => {
    const listName = prompt("Enter list name to add this contact to (e.g. Work, Family):");
    if (!listName) return;
    const cleanName = listName.trim();
    if (!cleanName) return;
    
    const lists = JSON.parse(localStorage.getItem("customLists") || "{}");
    if (!lists[cleanName]) {
      lists[cleanName] = [];
    }
    if (!lists[cleanName].includes(id)) {
      lists[cleanName].push(id);
      localStorage.setItem("customLists", JSON.stringify(lists));
      showToast(`Contact added to list "${cleanName}"!`);
    } else {
      showToast(`Contact is already in list "${cleanName}".`);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const res = await getConversationDetails(id);
        if (res && res.success && res.data) {
          setConversation(res.data);
          
          const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
          let currentUserId = "";
          if (storedUser) {
            try {
              const parsed = JSON.parse(storedUser);
              currentUserId = parsed.id || parsed._id || "";
            } catch (_) {}
          }
          if (res.data.locked) {
            const isChatLocked = res.data.locked instanceof Map
              ? res.data.locked.get(currentUserId)
              : (res.data.locked[currentUserId] || (typeof res.data.locked.get === "function" && res.data.locked.get(currentUserId)));
            setChatLock(!!isChatLocked);
          }
          const otherParticipant = res.data.participants.find(p => p._id !== currentUserId) || {};
          if (otherParticipant._id) {
            setTargetUserId(otherParticipant._id);
            const pRes = await getUserProfileById(otherParticipant._id);
            if (pRes && pRes.success && pRes.data) {
              setIsBlocked(!!pRes.data.isBlocked);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load profile details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadProfile();
    }
  }, [id]);

  const profileDetails = useMemo(() => {
    if (!conversation) {
      return {
        name: "Loading...",
        phoneNumber: "",
        avatarUrl: null,
        about: "Available for chat...",
      };
    }
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    let currentUserId = "";
    if (storedUser) {
      try {
        currentUserId = JSON.parse(storedUser).id;
      } catch (_) {}
    }
    const otherParticipant = conversation.participants.find(p => p._id !== currentUserId) || {};
    return {
      name: otherParticipant.displayName || otherParticipant.phoneNumber || "Unknown User",
      phoneNumber: otherParticipant.phoneNumber || "",
      avatarUrl: otherParticipant.avatarUrl || null,
      about: otherParticipant.about || "Available for chat...",
    };
  }, [conversation]);

  const handleBack = () => {
    router.push(`/chats/${id}`);
  };

  const handleMediaClick = () => {
    router.push(`/chats/${id}/media`);
  };

  const isGroup = !(id === "kittu" || id === "chirag" || id === "c1" || id === "c2" || id === "c3" || id === "c4" || id === "c5" || !id.startsWith("group"));

  const members = [
    {
      id: "you",
      name: "You",
      subtext: "Add member tag",
      isAdmin: false,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtSTDTUitRQB5aG-ZcdFAsyFdP86mWxvW55CsH3fDZwlfJQzUR8Xav3ghPt6k07h7ujn8WjMnfUwokeODYvQGKKOm7F33aNS0EEnqaoctdIhY8ELBRO8tQR6mKm8_M0WvqegMqhtKgIxXjkXMfUbV5OAZ2iz0uoTKeVH-5FFp1KbmYjoXhls-OIQUHDnNB91KgpZba0PQ5hk-LVeGan4gFJdAzjvJk3mHfnEHBA8mO8nDZBHLChXewILCZaO_GNayQUdKeTWP5oeQ"
    },
    {
      id: "ravi",
      name: "Ravi Appzeto",
      isAdmin: true,
      avatarBg: "bg-teal-50 text-teal-600 border border-teal-100",
      avatarText: "Cleanzo",
      isCleanzo: true
    },
    {
      id: "ankit",
      name: "Ankit sir appzeto",
      isAdmin: false,
      avatarBg: "bg-orange-100 text-orange-700",
      avatarText: "A"
    },
    {
      id: "priyank",
      name: "Priyank Appzeto",
      subtext: "Priyank4u Subscribe now 😄",
      isAdmin: false,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&fit=crop&q=80"
    },
    {
      id: "raj",
      name: "Raj Sir Project Manager Appzeto",
      subtext: "जय श्री राम🙏",
      isAdmin: false,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80"
    },
    {
      id: "shivam",
      name: "Shivam Lovevanshi Tester Appzeto",
      subtext: "Shivam..",
      isAdmin: false,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&q=80"
    },
    {
      id: "swati",
      name: "Swati Ma'am Appzeto",
      isAdmin: false,
      avatarBg: "bg-pink-100 text-pink-600",
      avatarText: "S"
    },
    {
      id: "ujjawal",
      name: "Ujjawal appzeto",
      subtext: "If it is textable then text, Don't call!",
      isAdmin: false,
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&fit=crop&q=80"
    },
    {
      id: "vipin",
      name: "Vipin Aanjna Sir Appzeto",
      isAdmin: false,
      avatarBg: "bg-blue-100 text-blue-600",
      avatarText: "V"
    },
    {
      id: "cleanzo-member",
      name: "~ Cleanzo",
      subtext: "+91 95558 60362",
      isAdmin: false,
      avatarBg: "bg-sky-50 text-sky-600 border border-sky-100",
      avatarText: "Cleanzo",
      isCleanzo: true
    }
  ];

  return (
    <div className="bg-[#f7f8fa] dark:bg-[#0b141a] text-[#1c2e35] dark:text-[#e9edef] min-h-screen flex flex-col items-center font-sans antialiased">
      {/* Mobile Shell Container */}
      <main className="w-full max-w-md bg-white dark:bg-[#0b141a] flex flex-col relative shadow-2xl min-h-screen pb-16">
        
        {/* Sticky Header */}
        <header className="sticky top-0 bg-white dark:bg-[#111b21] z-40 flex justify-between items-center h-[56px] px-3 border-b border-zinc-100/80 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              aria-label="Back"
              className="w-9 h-9 flex items-center justify-center text-[#1c2e35] dark:text-[#e9edef] active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-[#54656f] dark:text-[#8696a0]">
            {isGroup && (
              <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer">
                <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
              </button>
            )}
            <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer">
              <span className="material-symbols-outlined text-[22px]">more_vert</span>
            </button>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pb-safe">
          
          {/* Hero Header Card */}
          <div className="bg-white dark:bg-[#0b141a] px-4 pt-6 pb-4 flex flex-col items-center border-b border-zinc-100 dark:border-zinc-800">
            {isGroup ? (
              <>
                {/* Cleanzo Big Logo */}
                <div className="w-[110px] h-[110px] rounded-full bg-[#f4fbfc] dark:bg-[#111b21] border border-blue-100 dark:border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden shadow-sm mb-4">
                  <span className="material-symbols-outlined text-[#00a884] dark:text-[#ff2d55] text-[36px] absolute top-2 right-6">sparkles</span>
                  <span className="material-symbols-outlined text-[#0b805c] dark:text-[#ff2d55] text-[48px] fill">local_car_wash</span>
                  <span className="text-[12px] font-black uppercase text-[#0b805c] dark:text-[#ff2d55] tracking-widest mt-1">Cleanzo</span>
                </div>

                {/* Group Name & Members */}
                <h1 className="text-[20px] font-bold text-[#1c2e35] dark:text-[#e9edef] text-center leading-tight tracking-wide px-2 max-w-[320px]">
                  Cleanzo Android+iOS mobile Application development
                </h1>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                  Group <span className="text-[#0b805c] dark:text-[#ff2d55] font-semibold">· 13 members</span>
                </p>

                {/* Custom Description */}
                <div className="text-center mt-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl px-4 py-2.5 max-w-[320px] border border-zinc-100/50 dark:border-zinc-800">
                  <p className="text-[13.5px] font-bold text-zinc-700 dark:text-zinc-300 leading-none">Custom</p>
                  <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-1 leading-normal">Daily Exterior car cleaning Services</p>
                </div>
              </>
            ) : (
              <>
                {/* Dynamic Big Avatar */}
                <div className="mb-3">
                  {renderAvatar(profileDetails.avatarUrl, profileDetails.name, "w-[115px] h-[115px]", "text-[48px]")}
                </div>

                {/* Contact Name & Number */}
                <h1 className="text-[22px] font-bold text-[#1c2e35] dark:text-[#e9edef] text-center leading-none tracking-wide truncate max-w-[320px]">
                  {profileDetails.name}
                </h1>
                <p className="text-[14.5px] text-zinc-600 dark:text-zinc-400 mt-2 font-medium">
                  {profileDetails.phoneNumber}
                </p>
              </>
            )}

            {/* Bento Quick Actions Grid */}
            <div className={`grid gap-3 w-full mt-6 px-1 ${isGroup ? "grid-cols-4" : "grid-cols-3"}`}>
              <button className="flex flex-col items-center justify-center gap-1.5 py-3.5 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl active:bg-zinc-50 dark:active:bg-zinc-900 cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[#0b805c] dark:text-[#ff2d55] text-[22px]">call</span>
                <span className="text-[12.5px] font-bold text-zinc-700 dark:text-zinc-300">Audio</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-1.5 py-3.5 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl active:bg-zinc-50 dark:active:bg-zinc-900 cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[#0b805c] dark:text-[#ff2d55] text-[22px]">videocam</span>
                <span className="text-[12.5px] font-bold text-zinc-700 dark:text-zinc-300">Video</span>
              </button>
              
              {isGroup && (
                <button className="flex flex-col items-center justify-center gap-1.5 py-3.5 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl active:bg-zinc-50 dark:active:bg-zinc-900 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-[#0b805c] dark:text-[#ff2d55] text-[22px]">person_add</span>
                  <span className="text-[12.5px] font-bold text-zinc-700 dark:text-zinc-300">Add</span>
                </button>
              )}

              <button className="flex flex-col items-center justify-center gap-1.5 py-3.5 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl active:bg-zinc-50 dark:active:bg-zinc-900 cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[#0b805c] dark:text-[#ff2d55] text-[22px]">search</span>
                <span className="text-[12.5px] font-bold text-zinc-700 dark:text-zinc-300">Search</span>
              </button>
            </div>
          </div>

          {/* About and phone number Section */}
          {!isGroup && (
            <div className="bg-white dark:bg-[#0b141a] border-y border-zinc-100 dark:border-zinc-800 mt-2.5 px-4 py-3.5">
              <span className="block text-[13px] text-[#00a884] dark:text-[#8696a0] font-bold uppercase tracking-wide mb-2">About and phone number</span>
              <span className="block text-[15.5px] font-semibold text-[#1c2e35] dark:text-[#e9edef] leading-snug">{profileDetails.about}</span>
              <span className="block text-[12px] text-zinc-400 dark:text-zinc-500 mt-1">Available status</span>
              <hr className="my-3 border-zinc-100 dark:border-zinc-800" />
              <span className="block text-[15.5px] font-semibold text-[#1c2e35] dark:text-[#e9edef]">{profileDetails.phoneNumber}</span>
              <span className="block text-[12px] text-zinc-400 dark:text-zinc-500 mt-1">Mobile</span>
            </div>
          )}

          {/* Media, links, and docs Section */}
          <div className="bg-white dark:bg-[#0b141a] border-y border-zinc-100 dark:border-zinc-800 mt-2.5 py-3.5">
            <div 
              onClick={handleMediaClick}
              className="flex justify-between items-center px-4 mb-3 cursor-pointer active:opacity-80"
            >
              <span className="text-[14.5px] font-bold text-[#1c2e35] dark:text-[#e9edef] tracking-wide">Media, links, and docs</span>
              <button 
                onClick={(e) => { e.stopPropagation(); handleMediaClick(); }}
                className="flex items-center text-zinc-500 dark:text-zinc-400 font-bold text-[13px] hover:underline cursor-pointer"
              >
                {isGroup ? "19" : "774"}
                <span className="material-symbols-outlined text-[18px] ml-0.5">chevron_right</span>
              </button>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto gap-2 px-4 pb-1 no-scrollbar scroll-smooth">
              {isGroup ? (
                <>
                  {/* Group Media */}
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 cursor-pointer hover:opacity-90">
                    <img alt="Receipt" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=150&fit=crop&q=80" />
                  </div>
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 cursor-pointer hover:opacity-90">
                    <img alt="Cleanzo member" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&fit=crop&q=80" />
                  </div>
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 cursor-pointer hover:opacity-90">
                    <img alt="T-shirt back" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&fit=crop&q=80" />
                  </div>
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 cursor-pointer hover:opacity-90">
                    <img alt="Car wash" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=150&fit=crop&q=80" />
                  </div>
                </>
              ) : (
                <>
                  {/* Individual Media */}
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 relative flex items-center justify-center cursor-pointer hover:opacity-90">
                    <img alt="Thumbnail 1" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&fit=crop&q=80" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[28px] fill">play_circle</span>
                    </div>
                  </div>
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 cursor-pointer hover:opacity-90">
                    <img alt="Thumbnail 2" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&fit=crop&q=80" />
                  </div>
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 cursor-pointer hover:opacity-90">
                    <img alt="Thumbnail 3" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=150&fit=crop&q=80" />
                  </div>
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 cursor-pointer hover:opacity-90">
                    <img alt="Thumbnail 4" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&fit=crop&q=80" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* List Options */}
          <div className="bg-white dark:bg-[#0b141a] border-y border-zinc-100 dark:border-zinc-800 mt-2.5 divide-y divide-zinc-100/60 dark:divide-zinc-800/60">
            {/* Manage storage */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 active:bg-zinc-100 dark:active:bg-zinc-800 cursor-pointer">
              <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400 mr-4 text-[22px]">folder_open</span>
              <div className="flex-1">
                <span className="block text-[15px] font-semibold text-[#1c2e35] dark:text-[#e9edef]">Manage storage</span>
                <span className="block text-[12px] text-zinc-500 dark:text-zinc-400">{isGroup ? "4.3 MB" : "1.2 GB"}</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 active:bg-zinc-100 dark:active:bg-zinc-800 cursor-pointer">
              <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400 mr-4 text-[22px]">notifications</span>
              <div className="flex-1">
                <span className="block text-[15px] font-semibold text-[#1c2e35] dark:text-[#e9edef]">Notifications</span>
              </div>
            </div>

            {/* Media visibility */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 active:bg-zinc-100 dark:active:bg-zinc-800 cursor-pointer">
              <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400 mr-4 text-[22px]">image</span>
              <div className="flex-1">
                <span className="block text-[15px] font-semibold text-[#1c2e35] dark:text-[#e9edef]">Media visibility</span>
              </div>
            </div>
          </div>

          {/* Options Group 2 */}
          <div className="bg-white dark:bg-[#0b141a] border-y border-zinc-100 dark:border-zinc-800 mt-2.5 divide-y divide-zinc-100/60 dark:divide-zinc-800/60">
            {/* Disappearing messages */}
            <div 
              onClick={() => router.push(`/chats/${id}?action=disappearing`)}
              className="flex items-center px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 active:bg-zinc-100 dark:active:bg-zinc-800 cursor-pointer"
            >
              <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400 mr-4 text-[22px]">pace</span>
              <div className="flex-1">
                <span className="block text-[15px] font-semibold text-[#1c2e35] dark:text-[#e9edef]">Disappearing messages</span>
                <span className="block text-[12px] text-zinc-500 dark:text-zinc-400">{disappearingTimer}</span>
              </div>
            </div>

            {/* Chat Lock toggle */}
            <div className="flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 active:bg-zinc-100 dark:active:bg-zinc-800 cursor-pointer">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400 mr-4 text-[22px]">lock_person</span>
                <div>
                  <span className="block text-[15px] font-semibold text-[#1c2e35] dark:text-[#e9edef]">Chat lock</span>
                  <span className="block text-[12px] text-zinc-500 dark:text-zinc-400">Lock and hide this chat on this device.</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={chatLock} 
                  onChange={(e) => handleToggleChatLock(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a884]"></div>
              </label>
            </div>
          </div>

          {isGroup ? (
            <>
              {/* Group Creation Link */}
              <div className="bg-white dark:bg-[#0b141a] border-y border-zinc-100 dark:border-zinc-800 mt-2.5">
                <div className="flex items-center px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 active:bg-zinc-100 dark:active:bg-zinc-800 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mr-4">
                    <span className="material-symbols-outlined text-[22px]">groups</span>
                  </div>
                  <div className="flex-1">
                    <span className="block text-[15px] font-bold text-[#00a884] dark:text-[#ff2d55]">Create a similar group</span>
                    <span className="block text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Start with the same members that you can add or remove.
                    </span>
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div className="bg-white dark:bg-[#0b141a] border-y border-zinc-100 dark:border-zinc-800 mt-2.5 pb-4">
                <div className="flex justify-between items-center px-4 py-3.5 border-b border-zinc-100/60 dark:border-zinc-800/60">
                  <span className="text-[14.5px] font-bold text-zinc-700 dark:text-zinc-300">13 members</span>
                  <button className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer text-zinc-500 dark:text-zinc-400">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </button>
                </div>

                {/* Quick Actions (Green Buttons) */}
                <div className="flex flex-col mt-1">
                  <div className="flex items-center px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#00a884] dark:bg-[#ff2d55] text-white flex items-center justify-center mr-3.5 shrink-0">
                      <span className="material-symbols-outlined text-[22px]">person_add</span>
                    </div>
                    <span className="text-[15.5px] font-bold text-zinc-800 dark:text-zinc-200">Add members</span>
                  </div>
                  <div className="flex items-center px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#00a884] dark:bg-[#ff2d55] text-white flex items-center justify-center mr-3.5 shrink-0">
                      <span className="material-symbols-outlined text-[22px]">link</span>
                    </div>
                    <span className="text-[15.5px] font-bold text-zinc-800 dark:text-zinc-200">Invite via link or QR code</span>
                  </div>
                  <div className="flex items-center px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#00a884] dark:bg-[#ff2d55] text-white flex items-center justify-center mr-3.5 shrink-0">
                      <span className="material-symbols-outlined text-[22px]">person_pin</span>
                    </div>
                    <span className="text-[15.5px] font-bold text-zinc-800 dark:text-zinc-200">Add members to contacts</span>
                  </div>
                </div>

                {/* Members Rows */}
                <div className="flex flex-col mt-2">
                  {members.map((member) => (
                    <div 
                      key={member.id}
                      className="flex items-center px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 active:bg-zinc-100 dark:active:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <div className="relative shrink-0 mr-3.5">
                        {member.avatar ? (
                          <div className="w-[44px] h-[44px] rounded-full overflow-hidden border border-zinc-100 dark:border-zinc-800">
                            <img alt={member.name} className="w-full h-full object-cover" src={member.avatar} />
                          </div>
                        ) : (
                          <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center ${member.avatarBg || "bg-[#dfe5e7] dark:bg-[#202c33] text-[#54656f] dark:text-[#8696a0]"} font-semibold text-sm overflow-hidden`}>
                            {member.isCleanzo ? (
                              <div className="flex flex-col items-center justify-center text-center p-0.5 leading-none">
                                <span className="text-[6px] font-black uppercase text-emerald-600 dark:text-[#ff2d55] leading-none">Cleanzo</span>
                                <span className="material-symbols-outlined text-[11px] text-emerald-500 dark:text-[#ff2d55] fill leading-none mt-0.5">local_car_wash</span>
                              </div>
                            ) : (
                              <span>{member.avatarText}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div className="flex flex-col min-w-0">
                          <span className="text-[15px] font-bold text-[#1c2e35] dark:text-[#e9edef] truncate tracking-wide">
                            {member.name}
                          </span>
                          {member.subtext && (
                            <span className="text-[12px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                              {member.subtext}
                            </span>
                          )}
                        </div>

                        {member.isAdmin && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-[#ff2d55] bg-emerald-50 dark:bg-[#ff2d55]/10 border border-emerald-200/50 dark:border-[#ff2d55]/20 px-2 py-0.5 rounded-[4px] shrink-0 uppercase tracking-wide">
                            Group Admin
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  <button className="text-left px-4 py-2.5 text-[#00a884] dark:text-[#ff2d55] font-bold text-[14.5px] hover:underline cursor-pointer">
                    View all (3 more)
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Groups in Common (Kittu / Individual) */}
              <div className="bg-white dark:bg-[#0b141a] border-y border-zinc-100 dark:border-zinc-800 mt-2.5 pb-2">
                <div className="px-4 py-3.5 border-b border-zinc-100/60 dark:border-zinc-800/60">
                  <span className="text-[14px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wide">No groups in common</span>
                </div>
                <div className="flex flex-col mt-2">
                  <div className="flex items-center px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#00a884] dark:bg-[#ff2d55] text-white flex items-center justify-center mr-3.5 shrink-0">
                      <span className="material-symbols-outlined text-[22px]">groups</span>
                    </div>
                    <span className="text-[15.5px] font-bold text-zinc-800 dark:text-zinc-200">Create group with {profileDetails.name}</span>
                  </div>
                  <div className="flex items-start px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#00a884] dark:bg-[#ff2d55] text-white flex items-center justify-center mr-3.5 shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[22px]">group_add</span>
                    </div>
                    <div>
                      <span className="block text-[15.5px] font-bold text-zinc-800 dark:text-zinc-200">Add to groups</span>
                      <span className="block text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">Add this contact to groups you're in.</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action List Section 3 */}
          <div className="bg-white dark:bg-[#0b141a] border-y border-zinc-100 dark:border-zinc-800 mt-2.5 divide-y divide-zinc-100/60 dark:divide-zinc-800/60">
            {isGroup && (
              <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 active:bg-zinc-100 dark:active:bg-zinc-800 cursor-pointer">
                <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400 mr-4 text-[22px]">format_list_bulleted</span>
                <span className="text-[15px] font-bold text-zinc-700 dark:text-zinc-300">View member changes</span>
              </div>
            )}

            {/* Add to Favourites */}
            <div 
              onClick={handleToggleFavouriteProfile}
              className="flex items-center px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 active:bg-zinc-100 dark:active:bg-zinc-800 cursor-pointer"
            >
              <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400 mr-4 text-[22px] fill">
                {isFavourite ? "favorite" : "favorite_border"}
              </span>
              <span className="text-[15px] font-bold text-zinc-700 dark:text-zinc-300">
                {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
              </span>
            </div>

            {/* Add to list */}
            <div 
              onClick={handleAddToList}
              className="flex items-center px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 active:bg-zinc-100 dark:active:bg-zinc-800 cursor-pointer"
            >
              <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400 mr-4 text-[22px]">label</span>
              <span className="text-[15px] font-bold text-zinc-700 dark:text-zinc-300">Add to list</span>
            </div>

            {/* Clear chat */}
            <div 
              onClick={handleClearChat}
              className="flex items-center px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 active:bg-zinc-100 dark:active:bg-zinc-800 cursor-pointer"
            >
              <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400 mr-4 text-[22px]">block</span>
              <span className="text-[15px] font-bold text-zinc-700 dark:text-zinc-300">Clear chat</span>
            </div>

            {/* Block / Exit */}
            <div 
              onClick={isGroup ? null : handleToggleBlock}
              className="flex items-center px-4 py-3.5 hover:bg-red-50/50 dark:hover:bg-red-950/20 active:bg-red-100/30 dark:active:bg-red-900/30 cursor-pointer text-red-500"
            >
              <span className="material-symbols-outlined mr-4 text-[22px]">
                {isGroup ? "logout" : "block"}
              </span>
              <span className="text-[15px] font-bold">
                {isGroup ? "Exit group" : (isBlocked ? `Unblock ${profileDetails.name}` : `Block ${profileDetails.name}`)}
              </span>
            </div>

            {/* Report */}
            <div className="flex items-center px-4 py-3.5 hover:bg-red-50/50 dark:hover:bg-red-950/20 active:bg-red-100/30 dark:active:bg-red-900/30 cursor-pointer text-red-500">
              <span className="material-symbols-outlined mr-4 text-[22px]">thumb_down</span>
              <span className="text-[#ff2d55] text-[15px] font-bold">
                {isGroup ? "Report group" : `Report ${profileDetails.name}`}
              </span>
            </div>
          </div>

        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#111b21] dark:bg-[#202c33] text-white dark:text-[#e9edef] px-5 py-3 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.15)] text-[14px] font-semibold tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-300 flex items-center gap-2 border border-zinc-200/10 select-none">
          <span className="material-symbols-outlined text-[18px] text-[#00a884]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
