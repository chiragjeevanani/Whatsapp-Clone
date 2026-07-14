"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { getContacts, addContact } from "@/services/user/contacts";
import { getConversations, createConversation } from "@/services/chat/conversations";
import { deleteChat, archiveChat, muteChat, lockChat } from "@/services/chat/chatActions";
import { getProfile } from "@/services/user/getProfile";
import { setupSecretCode, verifySecretCode } from "@/services/user/secretCode";
import { useSocket } from "@/contexts/SocketContext";
import { initFcmNotifications } from "@/services/firebase/firebase";

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

const getAvatarUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const gatewayBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1").replace("/api/v1", "");
  return `${gatewayBase}${path}`;
};

const renderAvatar = (avatarUrl, name, sizeClass = "w-[48px] h-[48px]", iconSize = "text-[24px]") => {
  const resolvedUrl = getAvatarUrl(avatarUrl);
  if (resolvedUrl) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden shrink-0 border border-zinc-100`}>
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
        <span className="text-[16px] uppercase">{firstChar}</span>
      )}
    </div>
  );
};

export default function ChatsPage() {
  const router = useRouter();
  const { socket } = useSocket();
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
  const [chatContextMenu, setChatContextMenu] = useState(null);
  const [longPressTimeout, setLongPressTimeout] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const isLongPressActiveRef = useRef(false);
  const [hasProcessedScan, setHasProcessedScan] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMuteModal, setShowMuteModal] = useState(false);
  const [showLockIntroModal, setShowLockIntroModal] = useState(false);

  // Secret code verification/setup states
  const [currentUser, setCurrentUser] = useState(null);
  const [showSecretSetup, setShowSecretSetup] = useState(false);
  const [showSecretVerify, setShowSecretVerify] = useState(false);
  const [secretCodeStep, setSecretCodeStep] = useState(1);
  const [secretCodeValue, setSecretCodeValue] = useState("");
  const [secretCodeConfirmValue, setSecretCodeConfirmValue] = useState("");
  const [secretVerifyValue, setSecretVerifyValue] = useState("");
  const [secretError, setSecretError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const userId = parsed.id || parsed._id;
          if (userId) {
            const res = await getProfile(userId);
            if (res && res.success && res.data) {
              setCurrentUser(res.data);
              // Trigger FCM token generation and backend registration
              initFcmNotifications();
            }
          }
        } catch (err) {
          console.error("Failed to load user profile:", err);
        }
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleConversationUpdate = ({ conversationId, lastMessage }) => {
      console.log("WebSocket: Received conversation_update event:", { conversationId, lastMessage });
      const storedUser = localStorage.getItem("user");
      let currentUserId = "";
      if (storedUser) {
        try {
          currentUserId = JSON.parse(storedUser).id;
        } catch (_) {}
      }

      setChats((prevChats) => {
        const existingChatIdx = prevChats.findIndex((c) => c.id === conversationId);

        if (existingChatIdx !== -1) {
          const updatedChats = [...prevChats];
          const chat = { ...updatedChats[existingChatIdx] };
          chat.message = lastMessage.text;
          chat.time = new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
          chat.lastMessageStatus = lastMessage.senderId === currentUserId ? lastMessage.status || "sent" : null;
          
          if (lastMessage.senderId !== currentUserId) {
            chat.unread = (chat.unread || 0) + 1;
          }

          // Move updated chat to top
          updatedChats.splice(existingChatIdx, 1);
          return [chat, ...updatedChats];
        } else {
          // If conversation is new, refresh list
          getConversations().then((res) => {
            if (res && res.success && res.data) {
              const formattedChats = res.data.map((chat) => {
                const otherParticipant = chat.participants.find(p => p._id !== currentUserId) || {};
                const displayName = otherParticipant.displayName || otherParticipant.phoneNumber || "Unknown User";
                return {
                  id: chat._id,
                  name: displayName,
                  avatar: otherParticipant.avatarUrl || null,
                  avatarText: displayName.charAt(0).toUpperCase(),
                  avatarBg: "bg-teal-50 text-teal-600 font-bold border border-teal-100",
                  time: chat.lastMessage && chat.lastMessage.timestamp 
                    ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) 
                    : "",
                  message: chat.lastMessage ? chat.lastMessage.text : "No messages yet",
                  unread: chat.unreadCount || 0,
                  isGroup: chat.isGroup,
                  isPinned: false,
                  lastMessageStatus: chat.lastMessage && chat.lastMessage.senderId === currentUserId ? chat.lastMessage.status || "sent" : null,
                };
              });
              setChats(formattedChats);
            }
          });
          return prevChats;
        }
      });
    };

    const handleMessagesRead = ({ conversationId, readerId }) => {
      const storedUser = localStorage.getItem("user");
      let currentUserId = "";
      if (storedUser) {
        try {
          currentUserId = JSON.parse(storedUser).id;
        } catch (_) {}
      }
      if (readerId !== currentUserId) {
        setChats(prev => prev.map(c => c.id === conversationId ? { ...c, lastMessageStatus: "read" } : c));
      }
    };

    const handleMessageStatus = ({ conversationId, status }) => {
      setChats(prev => prev.map(c => c.id === conversationId ? { ...c, lastMessageStatus: status } : c));
    };

    socket.on("conversation_update", handleConversationUpdate);
    socket.on("messages_read", handleMessagesRead);
    socket.on("message_status", handleMessageStatus);

    return () => {
      socket.off("conversation_update", handleConversationUpdate);
      socket.off("messages_read", handleMessagesRead);
      socket.off("message_status", handleMessageStatus);
    };
  }, [socket]);

  useEffect(() => {
    if (showSelectContact) {
      const fetchContacts = async () => {
        setLoadingContacts(true);
        try {
          const res = await getContacts();
          if (res && res.success && res.data && res.data.contacts) {
            setContacts(res.data.contacts);
          }
        } catch (err) {
          console.error("Failed to fetch contacts:", err);
        } finally {
          setLoadingContacts(false);
        }
      };
      fetchContacts();
    }
  }, [showSelectContact]);

  const handleContactClick = async (contactUserId) => {
    try {
      const res = await createConversation(contactUserId);
      if (res && res.success && res.data) {
        setShowSelectContact(false);
        router.push(`/chats/${res.data._id}`);
      }
    } catch (err) {
      console.error("Failed to start conversation:", err);
      alert(err.message || "Failed to start conversation");
    }
  };

  useEffect(() => {
    // Redirect to login if not authenticated
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchConversations = async () => {
      setLoadingChats(true);
      try {
        const res = await getConversations();
        if (res && res.success && res.data) {
          const storedUser = localStorage.getItem("user");
          let currentUserId = "";
          if (storedUser) {
            try {
              currentUserId = JSON.parse(storedUser).id;
            } catch (_) {}
          }
          const pinnedIds = JSON.parse(localStorage.getItem("pinnedChatIds") || "[]");
          const formattedChats = res.data.map((chat) => {
            const otherParticipant = chat.participants.find(p => p._id !== currentUserId) || {};
            const displayName = otherParticipant.displayName || otherParticipant.phoneNumber || "Unknown User";
            const isPinned = pinnedIds.includes(chat._id);
            return {
              id: chat._id,
              name: displayName,
              avatar: otherParticipant.avatarUrl || null,
              avatarText: displayName.charAt(0).toUpperCase(),
              avatarBg: "bg-teal-50 text-teal-600 font-bold border border-teal-100",
              time: chat.lastMessage && chat.lastMessage.timestamp 
                ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) 
                : "",
              message: chat.lastMessage ? chat.lastMessage.text : "No messages yet",
              unread: chat.unreadCount || 0,
              isGroup: chat.isGroup,
              isPinned,
              isLocked: !!(chat.locked && (chat.locked[currentUserId] || chat.locked.get?.(currentUserId))),
              lastMessageStatus: chat.lastMessage && chat.lastMessage.senderId === currentUserId ? chat.lastMessage.status || "sent" : null,
            };
          });
          setChats(formattedChats);
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        setLoadingChats(false);
      }
    };

    fetchConversations();
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

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    const pinnedIds = JSON.parse(localStorage.getItem("pinnedChatIds") || "[]");
    if (pinnedIds.length > 0) {
      setChats(prev => prev.map(c => ({
        ...c,
        isPinned: pinnedIds.includes(c.id) || c.isPinned
      })));
    }
  }, []);

  const handleChatStartPress = (e, chatId) => {
    if (e.type === "mousedown" && e.button !== 0) return;
    isLongPressActiveRef.current = false;
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);
    
    const timeout = setTimeout(() => {
      isLongPressActiveRef.current = true;
      if (!selectionMode) {
        setSelectionMode(true);
        setSelectedChatIds([chatId]);
      } else {
        toggleChatSelection(chatId);
      }
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 600);
    setLongPressTimeout(timeout);
  };

  const handleChatEndPress = () => {
    if (longPressTimeout) {
      clearTimeout(longPressTimeout);
      setLongPressTimeout(null);
    }
  };

  const handleChatContextMenu = (e, chatId) => {
    e.preventDefault();
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedChatIds([chatId]);
    } else {
      toggleChatSelection(chatId);
    }
  };

  const handleTogglePin = (chatId) => {
    setChats(prevChats => {
      const chat = prevChats.find(c => c.id === chatId);
      if (!chat) return prevChats;
      
      const isCurrentlyPinned = chat.isPinned;
      
      if (!isCurrentlyPinned) {
        const pinnedCount = prevChats.filter(c => c.isPinned).length;
        if (pinnedCount >= 3) {
          showToast("You can only pin up to 3 chats");
          return prevChats;
        }
      }
      
      const updated = prevChats.map(c => c.id === chatId ? { ...c, isPinned: !isCurrentlyPinned } : c);
      const pinnedIds = updated.filter(c => c.isPinned).map(c => c.id);
      localStorage.setItem("pinnedChatIds", JSON.stringify(pinnedIds));
      
      showToast(isCurrentlyPinned ? "Chat unpinned" : "Chat pinned");
      return updated;
    });
    setChatContextMenu(null);
  };

  const toggleChatSelection = useCallback((chatId) => {
    setSelectedChatIds(prev => {
      const next = prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId];
      if (next.length === 0) {
        setSelectionMode(false);
      }
      return next;
    });
  }, []);

  const exitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedChatIds([]);
  }, []);

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedChatIds.map(id => deleteChat(id)));
      setChats(prev => prev.filter(c => !selectedChatIds.includes(c.id)));
      showToast(`${selectedChatIds.length} chat${selectedChatIds.length > 1 ? "s" : ""} deleted`);
    } catch (err) {
      console.error("Failed to delete chats:", err);
      showToast("Failed to delete chats");
    }
    setShowDeleteConfirm(false);
    exitSelectionMode();
  };

  const handleBulkArchive = async (archive = true) => {
    try {
      await Promise.all(selectedChatIds.map(id => archiveChat(id, archive)));
      setChats(prev => prev.map(c => selectedChatIds.includes(c.id) ? { ...c, isArchived: archive } : c));
      showToast(`${selectedChatIds.length} chat${selectedChatIds.length > 1 ? "s" : ""} ${archive ? "archived" : "unarchived"}`);
    } catch (err) {
      console.error("Failed to archive/unarchive chats:", err);
      showToast(`Failed to ${archive ? "archive" : "unarchive"} chats`);
    }
    exitSelectionMode();
  };

  const handleBulkMute = async (duration) => {
    try {
      if (duration === "unmute") {
        await Promise.all(selectedChatIds.map(id => muteChat(id, false)));
        setChats(prev => prev.map(c => selectedChatIds.includes(c.id) ? { ...c, isMuted: false } : c));
        showToast("Notifications unmuted");
      } else {
        await Promise.all(selectedChatIds.map(id => muteChat(id, true, duration)));
        setChats(prev => prev.map(c => selectedChatIds.includes(c.id) ? { ...c, isMuted: true } : c));
        const labels = { "8h": "8 hours", "1w": "1 week", "always": "Always" };
        showToast(`Muted for ${labels[duration] || duration}`);
      }
    } catch (err) {
      console.error("Failed to mute chats:", err);
      showToast("Failed to update notifications");
    }
    setShowMuteModal(false);
    exitSelectionMode();
  };

  const handleBulkLock = async (locked) => {
    if (locked && currentUser && !currentUser.hasSecretCode) {
      setShowLockIntroModal(true);
      return;
    }

    try {
      await Promise.all(selectedChatIds.map(id => lockChat(id, locked)));
      setChats(prev => prev.map(c => selectedChatIds.includes(c.id) ? { ...c, isLocked: locked } : c));
      showToast(locked ? `${selectedChatIds.length} chat${selectedChatIds.length > 1 ? "s" : ""} locked` : `${selectedChatIds.length} chat${selectedChatIds.length > 1 ? "s" : ""} unlocked`);
    } catch (err) {
      console.error("Failed to lock/unlock chats:", err);
      showToast("Failed to lock/unlock chats");
    }
    exitSelectionMode();
  };

  const handleChatClick = useCallback((id) => {
    if (isLongPressActiveRef.current) {
      isLongPressActiveRef.current = false;
      return;
    }
    if (selectionMode) {
      toggleChatSelection(id);
      return;
    }
    setChats(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    router.push(`/chats/${id}`);
  }, [router, selectionMode, toggleChatSelection]);

  const handleSecretSetupNext = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(secretCodeValue)) {
      setSecretError("Code must be exactly 6 numeric digits");
      return;
    }
    setSecretError("");
    setSecretCodeStep(2);
  };

  const handleSecretSetupConfirm = async (e) => {
    e.preventDefault();
    if (secretCodeValue !== secretCodeConfirmValue) {
      setSecretError("Codes do not match. Try again.");
      return;
    }
    setSecretError("");
    try {
      const res = await setupSecretCode(secretCodeValue);
      if (res && res.success) {
        showToast("Secret Code Created Successfully");
        setCurrentUser(prev => prev ? { ...prev, hasSecretCode: true } : null);
        setShowSecretSetup(false);
        setSecretCodeValue("");
        setSecretCodeConfirmValue("");
        setSecretCodeStep(1);

        // Auto-lock selected chats if any are currently selected
        if (selectedChatIds.length > 0) {
          try {
            await Promise.all(selectedChatIds.map(id => lockChat(id, true)));
            setChats(prev => prev.map(c => selectedChatIds.includes(c.id) ? { ...c, isLocked: true } : c));
            showToast(`${selectedChatIds.length} chat${selectedChatIds.length > 1 ? "s" : ""} locked`);
          } catch (err) {
            console.error("Failed to auto-lock chats after setup:", err);
          }
          exitSelectionMode();
        }
      }
    } catch (err) {
      console.error("Failed to setup secret code:", err);
      setSecretError(err.message || "Failed to setup secret code");
    }
  };

  const handleSecretVerify = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(secretVerifyValue)) {
      setSecretError("Incorrect Secret Code");
      return;
    }
    setSecretError("");
    try {
      const res = await verifySecretCode(secretVerifyValue);
      if (res && res.success) {
        setShowSecretVerify(false);
        setSecretVerifyValue("");
        setShowLockedChatsList(true);
      }
    } catch (err) {
      console.error("Failed to verify secret code:", err);
      setSecretError("Incorrect Secret Code");
    }
  };

  const archivedChatsCount = useMemo(() => {
    return chats.filter(c => c.isArchived).length;
  }, [chats]);

  const allSelectedPinned = useMemo(() => {
    if (selectedChatIds.length === 0) return false;
    return selectedChatIds.every(id => chats.find(c => c.id === id)?.isPinned);
  }, [selectedChatIds, chats]);

  const allSelectedLocked = useMemo(() => {
    if (selectedChatIds.length === 0) return false;
    return selectedChatIds.every(id => chats.find(c => c.id === id)?.isLocked);
  }, [selectedChatIds, chats]);

  const allSelectedArchived = useMemo(() => {
    if (selectedChatIds.length === 0) return false;
    return selectedChatIds.every(id => chats.find(c => c.id === id)?.isArchived);
  }, [selectedChatIds, chats]);

  const filteredChats = useMemo(() => {
    const list = chats
      .filter(chat => !chat.isLocked && !chat.isArchived)
      .filter((chat) => {
        if (activeFilter === "unread") return chat.unread > 0;
        if (activeFilter === "favourites") return chat.isFavourite;
        if (activeFilter === "groups") return chat.isGroup;
        return true;
      });
    return [...list].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
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
                {loadingContacts ? "Loading..." : `${contacts.length} contacts`}
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
          <div
            onClick={async () => {
              const phone = prompt("Enter phone number to add:");
              if (!phone) return;
              const name = prompt("Enter custom name (optional):") || "";
              try {
                const res = await addContact(phone.trim(), name.trim());
                if (res && res.success) {
                  alert("Contact added successfully!");
                  const updatedRes = await getContacts();
                  if (updatedRes && updatedRes.data && updatedRes.data.contacts) {
                    setContacts(updatedRes.data.contacts);
                  }
                }
              } catch (err) {
                alert(err.message || "Failed to add contact");
              }
            }}
            className="flex items-center justify-between py-3.5 cursor-pointer hover:bg-zinc-50 active:bg-zinc-100 transition-colors rounded-lg"
          >
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
          {loadingContacts ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-t-transparent border-[#00a884] rounded-full animate-spin"></div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center text-zinc-500 py-10 text-[14px]">
              No contacts found. Add some contacts to start chatting!
            </div>
          ) : (
            <div className="flex flex-col pb-10">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleContactClick(c.id)}
                  className="flex items-center gap-3.5 py-3 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer"
                >
                  {renderAvatar(c.avatarUrl, c.displayName, "w-[48px] h-[48px]", "text-[22px]")}

                  <div className="flex-grow min-w-0 border-b border-zinc-100 pb-3 flex flex-col justify-center">
                    <span className="text-[15.5px] font-bold text-[#1c2e35] truncate leading-snug">{c.displayName}</span>
                    <span className="text-[12.5px] text-[#667781] truncate mt-0.5">{c.about || "Available"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // 2. MAIN CHATS LIST VIEW
  return (
    <div className="w-full bg-white text-[#1c2e35] antialiased min-h-screen flex flex-col pb-24 font-sans select-none">
      {/* Top Header */}
      {selectionMode ? (
        <header className="sticky top-0 bg-[#008069] z-[200] px-2 pt-3 pb-2 flex justify-between items-center text-white animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <button
              onClick={exitSelectionMode}
              className="p-1.5 hover:bg-white/10 rounded-full active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <span className="text-[18px] font-bold">{selectedChatIds.length}</span>
          </div>
          <div className="flex items-center gap-1">
             {/* Pin / Unpin */}
            <button
              onClick={() => {
                selectedChatIds.forEach(id => handleTogglePin(id));
                exitSelectionMode();
              }}
              className="p-2.5 hover:bg-white/10 rounded-full active:scale-95 transition-all cursor-pointer"
              title={allSelectedPinned ? "Unpin chat" : "Pin chat"}
            >
              <span className="material-symbols-outlined text-[22px] rotate-45 transform scale-x-[-1]">
                {allSelectedPinned ? "keep_off" : "push_pin"}
              </span>
            </button>

            {/* Lock / Unlock */}
            <button
              onClick={() => handleBulkLock(!allSelectedLocked)}
              className="p-2.5 hover:bg-white/10 rounded-full active:scale-95 transition-all cursor-pointer"
              title={allSelectedLocked ? "Unlock chat" : "Lock chat"}
            >
              <span className="material-symbols-outlined text-[22px]">
                {allSelectedLocked ? "lock_open" : "lock"}
              </span>
            </button>

            {/* Delete */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2.5 hover:bg-white/10 rounded-full active:scale-95 transition-all cursor-pointer"
              title="Delete chat"
            >
              <span className="material-symbols-outlined text-[22px]">delete</span>
            </button>

            {/* Mute */}
            <button
              onClick={() => setShowMuteModal(true)}
              className="p-2.5 hover:bg-white/10 rounded-full active:scale-95 transition-all cursor-pointer"
              title="Mute notifications"
            >
              <span className="material-symbols-outlined text-[22px]">
                {selectedChatIds.length === 1 && chats.find(c => c.id === selectedChatIds[0])?.isMuted
                  ? "notifications_active"
                  : "notifications_off"}
              </span>
            </button>

            {/* Archive / Unarchive */}
            <button
              onClick={() => handleBulkArchive(!allSelectedArchived)}
              className="p-2.5 hover:bg-white/10 rounded-full active:scale-95 transition-all cursor-pointer"
              title={allSelectedArchived ? "Unarchive chat" : "Archive chat"}
            >
              <span className="material-symbols-outlined text-[22px]">
                {allSelectedArchived ? "unarchive" : "archive"}
              </span>
            </button>
          </div>
        </header>
      ) : (
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

                  {/* Locked Chats Verification */}
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setSecretError("");
                      setSecretVerifyValue("");
                      setShowSecretVerify(true);
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-zinc-50 transition-colors font-medium text-[15px] cursor-pointer text-[#111b21] border-t border-zinc-100"
                  >
                    Continue
                  </button>

                  {/* Create Secret Code */}
                  {currentUser && !currentUser.hasSecretCode && (
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        setSecretError("");
                        setSecretCodeValue("");
                        setSecretCodeConfirmValue("");
                        setSecretCodeStep(1);
                        setShowSecretSetup(true);
                      }}
                      className="w-full text-left px-5 py-3 hover:bg-zinc-50 transition-colors font-medium text-[15px] cursor-pointer text-[#111b21]"
                    >
                      Create Secret Code
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      )}

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
          setSecretError("");
          setSecretVerifyValue("");
          setShowSecretVerify(true);
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
        {loadingChats ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-3 border-t-transparent border-[#00a884] rounded-full animate-spin"></div>
            <span className="text-[14px] text-zinc-500 font-medium">Loading chats...</span>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <span className="material-symbols-outlined text-[48px] text-zinc-300 mb-2">chat_bubble</span>
            <span className="text-[14.5px] text-zinc-500 font-medium max-w-[250px] leading-relaxed">
              No conversations yet. Tap the + button to start chatting!
            </span>
          </div>
        ) : (
          <ul className="flex flex-col">
            {filteredChats.map((chat) => (
              <li
                key={chat.id}
                onClick={() => handleChatClick(chat.id)}
                onTouchStart={(e) => handleChatStartPress(e, chat.id)}
                onTouchEnd={handleChatEndPress}
                onTouchMove={handleChatEndPress}
                onMouseDown={(e) => handleChatStartPress(e, chat.id)}
                onMouseUp={handleChatEndPress}
                onMouseLeave={handleChatEndPress}
                onContextMenu={(e) => handleChatContextMenu(e, chat.id)}
                className={`flex items-center px-4 py-3 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer select-none ${
                  selectionMode && selectedChatIds.includes(chat.id) ? "bg-[#e7f8f0]" : ""
                }`}
              >
                {/* Avatar Column */}
                <div
                  className="relative shrink-0 mr-3.5 cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectionMode) {
                      toggleChatSelection(chat.id);
                    } else {
                      setQuickProfileChat(chat);
                    }
                  }}
                >
                  {renderAvatar(chat.avatar, chat.name, "w-[52px] h-[52px]", "text-[24px]")}
                  {/* Selection checkmark */}
                  {selectionMode && selectedChatIds.includes(chat.id) && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] bg-[#00a884] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>
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
                    {chat.lastMessageStatus && (
                      <span className={`material-symbols-outlined text-[17px] shrink-0 ${
                        chat.lastMessageStatus === "read" ? "text-[#53bdeb]" : "text-[#8696a0]"
                      }`}>
                        {chat.lastMessageStatus === "sent" ? "done" : "done_all"}
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
      )}
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

      {/* Secret Code Setup Modal Overlay */}
      {showSecretSetup && (
        <div className="absolute inset-0 z-[150] bg-black/60 flex items-center justify-center p-4 transition-all duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-[24px] overflow-hidden text-[#111b21] shadow-2xl flex flex-col font-sans select-none animate-in fade-in zoom-in-95 duration-150 p-6">
            <h3 className="text-[18px] font-bold text-[#111b21]">
              {secretCodeStep === 1 ? "Create secret code" : "Confirm secret code"}
            </h3>
            <p className="text-[13.5px] text-[#667781] mt-2 mb-4 leading-relaxed">
              {secretCodeStep === 1
                ? "Enter a 6-digit numeric code to find and unlock your locked chats."
                : "Enter your 6-digit numeric code again to confirm."}
            </p>

            <form
              onSubmit={secretCodeStep === 1 ? handleSecretSetupNext : handleSecretSetupConfirm}
              className="flex flex-col gap-4"
            >
              <input
                type="password"
                maxLength={6}
                pattern="[0-9]*"
                inputMode="numeric"
                value={secretCodeStep === 1 ? secretCodeValue : secretCodeConfirmValue}
                onChange={(e) => {
                  setSecretError("");
                  if (secretCodeStep === 1) {
                    setSecretCodeValue(e.target.value);
                  } else {
                    setSecretCodeConfirmValue(e.target.value);
                  }
                }}
                placeholder="••••••"
                className="w-full bg-[#f0f2f5] border-none focus:outline-none rounded-xl py-3 px-4 text-center text-[22px] tracking-[8px] font-bold text-[#111b21]"
                autoFocus
              />

              {secretError && (
                <span className="text-[12.5px] text-rose-500 font-semibold text-center">
                  {secretError}
                </span>
              )}

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowSecretSetup(false)}
                  className="text-zinc-600 hover:text-zinc-800 font-bold text-[14px] px-3 py-2 cursor-pointer active:scale-95 transition-transform"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-[#00a884] hover:text-[#008f70] font-bold text-[14px] px-3 py-2 cursor-pointer active:scale-95 transition-transform"
                >
                  {secretCodeStep === 1 ? "Next" : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Secret Code Verification Modal Overlay */}
      {showSecretVerify && (
        <div className="absolute inset-0 z-[150] bg-black/60 flex items-center justify-center p-4 transition-all duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-[24px] overflow-hidden text-[#111b21] shadow-2xl flex flex-col font-sans select-none animate-in fade-in zoom-in-95 duration-150 p-6">
            <h3 className="text-[18px] font-bold text-[#111b21]">Locked Chats</h3>
            <p className="text-[13.5px] text-[#667781] mt-2 mb-4 leading-relaxed">
              Enter your 6-digit secret code to view locked chats.
            </p>

            <form onSubmit={handleSecretVerify} className="flex flex-col gap-4">
              <input
                type="password"
                maxLength={6}
                pattern="[0-9]*"
                inputMode="numeric"
                value={secretVerifyValue}
                onChange={(e) => {
                  setSecretError("");
                  setSecretVerifyValue(e.target.value);
                }}
                placeholder="••••••"
                className="w-full bg-[#f0f2f5] border-none focus:outline-none rounded-xl py-3 px-4 text-center text-[22px] tracking-[8px] font-bold text-[#111b21]"
                autoFocus
              />

              {secretError && (
                <span className="text-[12.5px] text-rose-500 font-semibold text-center">
                  {secretError}
                </span>
              )}

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowSecretVerify(false)}
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

      {/* Lock Chat Onboarding / Intro Modal Overlay */}
      {showLockIntroModal && (
        <div className="absolute inset-0 z-[150] bg-black/60 flex items-center justify-center p-4 transition-all duration-200" onClick={() => setShowLockIntroModal(false)}>
          <div 
            className="w-full max-w-[340px] bg-[#111b21] rounded-[24px] overflow-hidden text-white shadow-2xl flex flex-col font-sans select-none animate-in fade-in zoom-in-95 duration-150 p-6 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowLockIntroModal(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors p-1"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Circular Illustration */}
            <div className="w-[120px] h-[120px] bg-[#1d2a30] rounded-full flex items-center justify-center relative mx-auto mt-4 mb-6">
              {/* Phone Mockup */}
              <div className="w-[45px] h-[75px] bg-[#2a3942] border border-zinc-600 rounded-lg p-1.5 flex flex-col gap-1.5 justify-start">
                <div className="w-full h-1.5 bg-[#00a884]/40 rounded-full"></div>
                <div className="w-[85%] h-1 bg-[#00a884] rounded-full"></div>
                <div className="w-[70%] h-1 bg-zinc-500 rounded-full"></div>
                <div className="w-full h-1.5 bg-[#00a884]/40 rounded-full"></div>
                <div className="w-[85%] h-1 bg-[#00a884] rounded-full"></div>
              </div>
              {/* Lock Badge */}
              <div className="absolute -bottom-1 -right-1 w-[38px] h-[38px] bg-[#00a884] border-2 border-[#1d2a30] rounded-full flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-[18px]">lock</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-[18px] font-bold text-white tracking-wide">
              Keep this chat locked and hidden
            </h3>
            
            {/* Description */}
            <p className="text-[13px] text-[#8696a0] mt-3 mb-6 leading-relaxed px-1">
              Use your secret code to open this chat and read notifications on this device. For even more privacy, locked chats will be kept separate from other chats. <a href="#" className="text-[#00a884] hover:underline font-semibold" onClick={(e) => e.preventDefault()}>Learn more</a>
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowLockIntroModal(false);
                  setSecretError("");
                  setSecretCodeValue("");
                  setSecretCodeConfirmValue("");
                  setSecretCodeStep(1);
                  setShowSecretSetup(true);
                }}
                className="w-full py-3 bg-[#00a884] hover:bg-[#008f70] active:scale-[0.98] transition-all rounded-full text-[14.5px] font-bold text-white cursor-pointer"
              >
                Continue
              </button>
            </div>
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
                    if (selectionMode) {
                      toggleChatSelection(chat.id);
                    } else {
                      setShowLockedChatsList(false);
                      handleChatClick(chat.id);
                    }
                  }}
                  onTouchStart={(e) => handleChatStartPress(e, chat.id)}
                  onTouchEnd={handleChatEndPress}
                  onTouchMove={handleChatEndPress}
                  onMouseDown={(e) => handleChatStartPress(e, chat.id)}
                  onMouseUp={handleChatEndPress}
                  onMouseLeave={handleChatEndPress}
                  onContextMenu={(e) => handleChatContextMenu(e, chat.id)}
                  className={`flex items-center px-4 py-3 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer select-none ${
                    selectionMode && selectedChatIds.includes(chat.id) ? "bg-[#e7f8f0]" : ""
                  }`}
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
                    {/* Selection checkmark */}
                    {selectionMode && selectedChatIds.includes(chat.id) && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] bg-[#00a884] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>
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
                    if (selectionMode) {
                      toggleChatSelection(chat.id);
                    } else {
                      setShowArchivedChatsList(false);
                      handleChatClick(chat.id);
                    }
                  }}
                  onTouchStart={(e) => handleChatStartPress(e, chat.id)}
                  onTouchEnd={handleChatEndPress}
                  onTouchMove={handleChatEndPress}
                  onMouseDown={(e) => handleChatStartPress(e, chat.id)}
                  onMouseUp={handleChatEndPress}
                  onMouseLeave={handleChatEndPress}
                  onContextMenu={(e) => handleChatContextMenu(e, chat.id)}
                  className={`flex items-center px-4 py-3 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer select-none ${
                    selectionMode && selectedChatIds.includes(chat.id) ? "bg-[#e7f8f0]" : ""
                  }`}
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
                    {/* Selection checkmark */}
                    {selectionMode && selectedChatIds.includes(chat.id) && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] bg-[#00a884] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>
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



      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#323232] text-white text-[13.5px] px-6 py-2.5 rounded-full shadow-lg z-[200] animate-in fade-in slide-in-from-bottom-4 duration-200 select-none">
          {toastMessage}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-6" onClick={() => setShowDeleteConfirm(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[320px] p-5 animate-in zoom-in-95 fade-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[16px] font-bold text-[#111b21] mb-2">
              Delete {selectedChatIds.length > 1 ? `${selectedChatIds.length} chats` : "chat"}?
            </h3>
            <p className="text-[13.5px] text-[#667781] mb-5 leading-relaxed">
              Messages will be removed from this device. Other participants will still be able to see them.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2 text-[14px] text-[#00a884] font-bold hover:bg-[#e7f8f0] rounded-full transition-colors cursor-pointer active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-5 py-2 text-[14px] text-[#e53935] font-bold hover:bg-red-50 rounded-full transition-colors cursor-pointer active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mute Options Modal */}
      {showMuteModal && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-6" onClick={() => setShowMuteModal(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[300px] overflow-hidden animate-in zoom-in-95 fade-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-5 pb-3">
              <h3 className="text-[16px] font-bold text-[#111b21]">Mute notifications</h3>
            </div>
            {[
              { label: "8 hours", value: "8h" },
              { label: "1 week", value: "1w" },
              { label: "Always", value: "always" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleBulkMute(opt.value)}
                className="w-full text-left px-5 py-3.5 hover:bg-zinc-50 transition-colors text-[14.5px] text-[#111b21] font-medium cursor-pointer active:bg-zinc-100 flex items-center gap-4"
              >
                <span className="material-symbols-outlined text-[20px] text-[#54656f]">notifications_off</span>
                {opt.label}
              </button>
            ))}
            <div className="border-t border-zinc-100">
              <button
                onClick={() => handleBulkMute("unmute")}
                className="w-full text-left px-5 py-3.5 hover:bg-zinc-50 transition-colors text-[14.5px] text-[#00a884] font-bold cursor-pointer active:bg-zinc-100 flex items-center gap-4"
              >
                <span className="material-symbols-outlined text-[20px] text-[#00a884]">notifications_active</span>
                Unmute
              </button>
            </div>
            <div className="px-5 py-3 flex justify-end border-t border-zinc-100">
              <button
                onClick={() => setShowMuteModal(false)}
                className="px-5 py-2 text-[14px] text-[#00a884] font-bold hover:bg-[#e7f8f0] rounded-full transition-colors cursor-pointer active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
