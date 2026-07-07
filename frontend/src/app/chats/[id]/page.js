"use client";

import { useState, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function ChatConversationPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const id = params.id;
  const chatsData = {
    "appzeto-official": {
      name: "Appzeto_Official",
      avatar: null,
      avatarText: "Appzeto",
      avatarBg: "bg-teal-50 text-teal-600 font-bold border border-teal-100",
      subtext: "appzeto hr Sir, Sagar | Appzeto, Ujjawal...",
      messages: [
        { id: 1, sender: "incoming", text: "There isn't any fixed number sir.\nBut it will handle around 15000 to 20000 daily visitors\nAnd under 200 concurrent users", time: "11:32" },
        { id: 2, sender: "incoming", text: "We will handle the new build server setup today.", time: "12:00" }
      ]
    },
    "chirag": {
      name: "Chirag (You)",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtSTDTUitRQB5aG-ZcdFAsyFdP86mWxvW55CsH3fDZwlfJQzUR8Xav3ghPt6k07h7ujn8WjMnfUwokeODYvQGKKOm7F33aNS0EEnqaoctdIhY8ELBRO8tQR6mKm8_M0WvqegMqhtKgIxXjkXMfUbV5OAZ2iz0uoTKeVH-5FFp1KbmYjoXhls-OIQUHDnNB91KgpZba0PQ5hk-LVeGan4gFJdAzjvJk3mHfnEHBA8mO8nDZBHLChXewILCZaO_GNayQUdKeTWP5oeQ",
      subtext: "Message yourself",
      messages: [
        { id: 1, sender: "outgoing", text: "Design assets list:\n- Background gradient HSL tokens\n- Framer Motion nav bar\n- Auto-advancing updates status timer", time: "10:00" },
        { id: 2, sender: "outgoing", text: "Completed updates timeline UI replication.", time: "11:30" }
      ]
    },
    "kittu": {
      name: "Kittu",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD209t6Zin8k_HGjBSvGIRB_KONmSIL8sbz2S-MQFb6yxRje3Ge3PGp-yyOH_yZg4mCb_u8FkyApwL2yhfjFnLSiwHkH3lawFQHkpZmSRXx5D7BGsdZYSdvP6PhIeM3t9PjrvbV02NUdZMoHPGEZ-ZwJRlrv8enxQjqxirmtclZn9U_UQz7m55E9_VQNGreM6hRVv44INUgYZ7PQRf4Oct93w5plsG6f9LeRAuAOZt_QSgliP9AOs46NF7TylHhikGVRGfXyCWVFLo",
      subtext: "",
      messages: [
        { id: 1, sender: "incoming", text: "Nehru place me mil", time: "12:28" },
        { id: 2, sender: "incoming", text: "Toh bech du kya?", time: "12:28" },
        { id: 3, sender: "incoming", text: "Mere hisaab se indore mein zyada mil jayega", time: "12:28" },
        { id: 4, sender: "outgoing", replyTo: { name: "Kittu", text: "1 harddisk 800 mein bikri hai yaha" }, text: "1-2 chd k baaki sb bech de", time: "15:06" },
        { id: 5, sender: "incoming", text: "sab kharaab hai batare", time: "15:07" },
        { id: 6, sender: "incoming", text: "gye 4000🙂", time: "15:07" },
        { id: "div-today", isDivider: true, text: "Today" },
        { 
          id: 7, 
          sender: "incoming", 
          isLinkCard: true,
          linkTitle: "Lifelong 3-in-1 Foldable Electric Mosquito Racket...",
          linkDescription: "The Lifelong 3-in-1 Foldable ...",
          linkDomain: "amzn.in",
          linkImage: "https://images.unsplash.com/photo-1598418037929-e6ab485675d2?w=120&fit=crop&q=80",
          showShare: true,
          text: "Lifelong 3-in-1 Foldable Electric Mosquito Racket | Mosquito Killer Racket | Fly Swatter | Stand & Hang Design | Mosquito Trap & UV Light | Rechargeable 1200mAh Battery | Type-C Charging\nhttps://amzn.in/d/0dpdAi7W", 
          time: "12:21" 
        },
        { id: 8, sender: "incoming", text: "Ye order krdena be kisi k se", time: "12:21" },
        { 
          id: 9, 
          sender: "outgoing", 
          replyTo: { 
            name: "Kittu", 
            text: "Lifelong 3-in-1 Foldable Electric Mosquito Racket | Mosquito Killer Racket | Fly Swatter | Stand & Hang Design | Mosquit...",
            image: "https://images.unsplash.com/photo-1598418037929-e6ab485675d2?w=120&fit=crop&q=80"
          }, 
          text: "Hao..", 
          time: "12:38" 
        },
        { id: 10, sender: "incoming", text: "https://youtu.be/uBotyv_TSZg", time: "12:49" }
      ]
    },
    "cleanzo": {
      name: "Cleanzo Android+iOS mobile Application development",
      isCleanzo: true,
      subtext: "Ankit sir appzeto, Priyank Appzeto, Raj Sir...",
      messages: [
        { id: 1, sender: "incoming", text: "There isn't any fixed number sir.\nBut it will handle around 15000 to 20000 daily visitors\nAnd under 200 concurrent users\nThis isn't fixes numbers sir these are approz can be high and also can be low.", time: "11:32", reaction: "👍" },
        { id: 2, sender: "incoming", text: "For kvm4 it can handle upto 2500 concurrent requests per minute\nApprox 10k to 30k registered users can be active simultaneously.\nSince it has 16gb ram jt can be easily manage all that.", time: "11:35" },
        { id: 3, sender: "incoming", senderName: "~ Devesh Yadav", senderColor: "text-[#d91a5f]", senderPhone: "+91 70179 88607", replyTo: { name: "Ujjawal appzeto", text: "For kvm4 it can handle upto 2500 concurrent requests per minute\nApprox 10k to 30k registered users can be act..." }, text: "Okay i will discuss about it and get back to you", time: "11:37" },
        { id: 4, sender: "incoming", text: "@~Vijendra Singh @~Rahees ^^", isTagsOnly: true, time: "11:37" },
        { id: 5, sender: "incoming", senderName: "Ujjawal appzeto", senderColor: "text-[#027eb5]", text: "Okay sir", time: "11:37" },
        { id: 6, sender: "incoming", senderName: "Ujjawal appzeto", senderColor: "text-[#027eb5]", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=450&auto=format&fit=crop&q=60", imageSize: "55 kB", text: "Sir server is verging when I restarted it but even in mnormal usage its cpu usage and memory spikes.", time: "13:15", reaction: "😢" }
      ]
    }
  };

  const chatKey = chatsData[id] ? id : "cleanzo";
  const activeChat = chatsData[chatKey];

  const [messages, setMessages] = useState(activeChat.messages);
  const [selectedMessageIds, setSelectedMessageIds] = useState([]);
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);
  const [infoMessage, setInfoMessage] = useState(null);
  const [showAttachSheet, setShowAttachSheet] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const galleryInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const [replyingMessage, setReplyingMessage] = useState(null);
  const longPressTimeoutRef = useRef(null);
  const isLongPressActiveRef = useRef(false);

  const handleStartPress = (e, msgId) => {
    if (e.type === "mousedown" && e.button !== 0) return;
    isLongPressActiveRef.current = false;
    longPressTimeoutRef.current = setTimeout(() => {
      isLongPressActiveRef.current = true;
      setSelectedMessageIds([msgId]);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
  };

  const handleEndPress = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  const handleReact = (msgId, emoji) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, reaction: emoji } : m));
    setSelectedMessageIds([]);
  };

  const handleHeaderReply = () => {
    if (selectedMessageIds.length !== 1) return;
    const msg = messages.find(m => m.id === selectedMessageIds[0]);
    if (msg) {
      setReplyingMessage(msg);
    }
    setSelectedMessageIds([]);
  };

  const handleHeaderStar = () => {
    if (selectedMessageIds.length === 0) return;
    showToast(selectedMessageIds.length === 1 ? "Message starred" : "Messages starred");
    setSelectedMessageIds([]);
  };

  const handleHeaderDelete = () => {
    if (selectedMessageIds.length === 0) return;
    setMessages(prev => prev.filter(m => !selectedMessageIds.includes(m.id)));
    showToast(selectedMessageIds.length === 1 ? "Message deleted" : `${selectedMessageIds.length} messages deleted`);
    setSelectedMessageIds([]);
  };

  const handleHeaderCopy = () => {
    if (selectedMessageIds.length === 0) return;
    const textToCopy = messages
      .filter(m => selectedMessageIds.includes(m.id) && m.text)
      .map(m => m.text)
      .join("\n\n");
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      showToast(selectedMessageIds.length === 1 ? "Message copied to clipboard" : "Messages copied to clipboard");
    }
    setSelectedMessageIds([]);
  };

  const handleHeaderForward = () => {
    if (selectedMessageIds.length === 0) return;
    showToast("Forward option coming soon!");
    setSelectedMessageIds([]);
  };

  useEffect(() => {
    setMessages(activeChat.messages);
    setSelectedMessageIds([]);
    setShowSelectionMenu(false);
    setInfoMessage(null);
    setShowAttachSheet(false);
    setShowContactPicker(false);
    setShowPollCreator(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setShowCamera(false);
    setCapturedPhoto(null);
    setReplyingMessage(null);
  }, [id]);

  useEffect(() => {
    if (showCamera) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        })
        .catch(() => {
          showToast("Failed to access camera");
          setShowCamera(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showCamera]);

  const [inputText, setInputText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // States for search, group creation, and mute
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState(["vini"]); // Vini Sage selected by default to match reference image
  const [newGroupSearch, setNewGroupSearch] = useState("");
  
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showMuteModal, setShowMuteModal] = useState(false);
  const [muteDuration, setMuteDuration] = useState("Always"); // Defaults to Always to match screenshot
  const [isMuted, setIsMuted] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // States for disappearing messages and chat themes
  const [showDisappearing, setShowDisappearing] = useState(false);
  const [disappearingTimer, setDisappearingTimer] = useState("Off"); // Defaults to Off
  const [showChatTheme, setShowChatTheme] = useState(false);
  const [activeTheme, setActiveTheme] = useState("default"); // Defaults to default (green)

  // States for report, block, clear, export, and blocked status
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportBlockCheckbox, setReportBlockCheckbox] = useState(false);

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReportCheckbox, setBlockReportCheckbox] = useState(false);

  const [showClearModal, setShowClearModal] = useState(false);
  const [clearOption, setClearOption] = useState("all"); // "all" | "media"
  const [clearStarred, setClearStarred] = useState(false);

  const [showExportModal, setShowExportModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2000);
  };

  const newGroupContacts = [
    { id: "meta-ai", name: "Meta AI", isAI: true, avatar: null, avatarBg: "bg-[#201138] text-purple-400 border border-purple-900/40", avatarText: "AI", logo: "meta" },
    { id: "ankit", name: "Ankit sir appzeto", avatar: null, avatarBg: "bg-amber-600/20 text-amber-400 border border-amber-800/30", avatarText: "A" },
    { id: "vini", name: "Vini Sage", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80" },
    { id: "sapna", name: "Sapna Tale Tester Appzeto", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop&q=80" },
    { id: "airtel", name: "Airtel Payments Bank", avatar: null, avatarBg: "bg-red-600 text-white font-bold", avatarText: "APB" }
  ];

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={index} className="bg-yellow-300 text-black px-0.5 rounded">{part}</mark>
        : part
    );
  };

  const renderTextWithLinks = (text, query) => {
    if (!text) return "";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="text-[#027eb5] hover:underline cursor-pointer break-all"
          >
            {part}
          </a>
        );
      }
      return highlightText(part, query);
    });
  };

  const handleGalleryChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    const newMessage = {
      id: Date.now(),
      sender: "outgoing",
      text: "",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
      status: "read",
      image: fileUrl,
      imageSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    };
    setMessages((prev) => [...prev, newMessage]);
    setShowAttachSheet(false);
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newMessage = {
      id: Date.now(),
      sender: "outgoing",
      text: "",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
      status: "read",
      isDocumentCard: true,
      documentName: file.name,
      documentSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    };
    setMessages((prev) => [...prev, newMessage]);
    setShowAttachSheet(false);
  };

  const handleSendLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
          sendLocationMsg(mapUrl);
        },
        () => {
          sendLocationMsg("https://maps.google.com/?q=28.6139,77.2090");
        }
      );
    } else {
      sendLocationMsg("https://maps.google.com/?q=28.6139,77.2090");
    }
    setShowAttachSheet(false);
  };

  const sendLocationMsg = (url) => {
    const newMessage = {
      id: Date.now(),
      sender: "outgoing",
      text: `📍 My Location:\n${url}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
      status: "read"
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleShareContact = (contact) => {
    const newMessage = {
      id: Date.now(),
      sender: "outgoing",
      text: "",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
      status: "read",
      isContactCard: true,
      contactName: contact.name,
      contactAvatar: contact.avatar || null,
      contactAvatarBg: contact.avatarBg || "bg-[#00a884] text-white",
      contactAvatarText: contact.avatarText || contact.name.charAt(0).toUpperCase()
    };
    setMessages((prev) => [...prev, newMessage]);
    setShowContactPicker(false);
    setShowAttachSheet(false);
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setCapturedPhoto(dataUrl);
        // Stop video tracks for static preview
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      }
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      })
      .catch(() => {
        showToast("Failed to access camera");
        setShowCamera(false);
      });
  };

  const handleSendCapturedPhoto = () => {
    if (capturedPhoto) {
      const newMessage = {
        id: Date.now(),
        sender: "outgoing",
        text: "",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
        status: "read",
        image: capturedPhoto,
        imageSize: "120 KB"
      };
      setMessages((prev) => [...prev, newMessage]);
    }
    setCapturedPhoto(null);
    setShowCamera(false);
  };

  const handleCreatePoll = () => {
    if (!pollQuestion.trim()) {
      showToast("Please enter a question");
      return;
    }
    const filledOptions = pollOptions.filter(opt => opt.trim() !== "");
    if (filledOptions.length < 2) {
      showToast("Please enter at least 2 options");
      return;
    }
    const newMessage = {
      id: Date.now(),
      sender: "outgoing",
      text: "",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
      status: "read",
      isPollCard: true,
      pollQuestion: pollQuestion.trim(),
      pollOptions: filledOptions.map(opt => ({
        text: opt.trim(),
        voters: []
      }))
    };
    setMessages((prev) => [...prev, newMessage]);
    setShowPollCreator(false);
    setShowAttachSheet(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
  };

  const updatePollOptionValue = (index, val) => {
    setPollOptions((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions((prev) => prev.filter((_, idx) => idx !== index));
    } else {
      setPollOptions((prev) => {
        const copy = [...prev];
        copy[index] = "";
        return copy;
      });
    }
  };

  const handlePollVote = (msgId, optionIndex) => {
    setMessages((prev) => 
      prev.map((msg) => {
        if (msg.id !== msgId) return msg;
        const updatedOptions = msg.pollOptions.map((opt, idx) => {
          if (idx !== optionIndex) return opt;
          const hasVoted = opt.voters.includes("me");
          const newVoters = hasVoted 
            ? opt.voters.filter(v => v !== "me") 
            : [...opt.voters, "me"];
          return {
            ...opt,
            voters: newVoters
          };
        });
        return {
          ...msg,
          pollOptions: updatedOptions
        };
      })
    );
  };

  const filteredMessages = showSearchBar && searchQuery.trim() !== ""
    ? messages.filter(msg => !msg.isDivider && msg.text && msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "outgoing",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
      status: "read",
      ...(replyingMessage ? {
        replyTo: {
          name: replyingMessage.sender === "outgoing" ? "You" : (activeChat.name || "Kittu"),
          text: replyingMessage.text,
          image: replyingMessage.image || null
        }
      } : {})
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setReplyingMessage(null);
  };

  const handleInput = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div className="bg-[#efeae2] text-[#1c2e35] h-screen flex flex-col font-sans overflow-hidden select-none" suppressHydrationWarning={true}>
      {/* Header */}
      {selectedMessageIds.length > 0 ? (
        <header className="bg-white sticky top-0 z-50 flex justify-between items-center h-[60px] px-2.5 shrink-0 border-b border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)] select-none">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedMessageIds([])}
              className="text-[#54656f] p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform shrink-0"
            >
              <span className="material-symbols-outlined text-[23px] font-bold">arrow_back</span>
            </button>
            <span className="text-[19px] font-semibold text-[#111b21]">{selectedMessageIds.length}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#54656f] relative">
            {selectedMessageIds.length === 1 && (
              <button 
                onClick={handleHeaderReply}
                className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors active:scale-95"
                title="Reply"
              >
                <span className="material-symbols-outlined text-[23px]">reply</span>
              </button>
            )}
            <button 
              onClick={handleHeaderStar}
              className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors active:scale-95"
              title="Star"
            >
              <span className="material-symbols-outlined text-[23px]">star</span>
            </button>
            <button 
              onClick={handleHeaderDelete}
              className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors active:scale-95"
              title="Delete"
            >
              <span className="material-symbols-outlined text-[23px]">delete</span>
            </button>
            <button 
              onClick={handleHeaderCopy}
              className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors active:scale-95"
              title="Copy"
            >
              <span className="material-symbols-outlined text-[23px]">content_copy</span>
            </button>
            <button 
              onClick={handleHeaderForward}
              className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors active:scale-95"
              title="Forward"
            >
              <span className="material-symbols-outlined text-[23px] transform scale-x-[-1]">reply</span>
            </button>
            <button 
              onClick={() => setShowSelectionMenu(prev => !prev)}
              className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors active:scale-95"
              title="More"
            >
              <span className="material-symbols-outlined text-[23px]">more_vert</span>
            </button>

            {/* Selection Dropdown Menu */}
            {showSelectionMenu && (
              <>
                <div className="fixed inset-0 z-40 cursor-default" onClick={() => setShowSelectionMenu(false)}></div>
                <div className="absolute right-1 top-[46px] z-50 bg-white rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-zinc-100 py-1.5 w-[140px] text-[15px] text-[#111b21] animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  <ul className="flex flex-col">
                    <li 
                      onClick={() => {
                        handleHeaderCopy();
                        setShowSelectionMenu(false);
                      }} 
                      className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors"
                    >
                      Copy
                    </li>
                    {selectedMessageIds.length === 1 && (
                      <li 
                        onClick={() => {
                          const msg = messages.find(m => m.id === selectedMessageIds[0]);
                          if (msg) {
                            setInfoMessage(msg);
                          }
                          setShowSelectionMenu(false);
                          setSelectedMessageIds([]);
                        }} 
                        className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors"
                      >
                        Info
                      </li>
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        </header>
      ) : showSearchBar ? (
        <header className="bg-white sticky top-0 z-50 flex items-center h-[60px] px-2.5 shrink-0 border-b border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => {
              setShowSearchBar(false);
              setSearchQuery("");
            }}
            className="text-[#54656f] p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform shrink-0"
          >
            <span className="material-symbols-outlined text-[23px] font-bold">arrow_back</span>
          </button>
          <div className="flex-1 ml-2 mr-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              autoFocus
              className="w-full bg-transparent border-none focus:outline-none py-2 text-[16px] text-[#111b21] placeholder-[#667781] outline-none"
            />
          </div>
          <button className="text-[#54656f] p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 shrink-0">
            <span className="material-symbols-outlined text-[23px]">calendar_today</span>
          </button>
        </header>
      ) : (
        <header className="bg-white sticky top-0 z-50 flex justify-between items-center h-[60px] px-2.5 shrink-0 border-b border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-1.5 overflow-hidden flex-1 h-full">
            <button
              onClick={() => router.push("/chats")}
              className="text-[#54656f] p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform shrink-0"
            >
              <span className="material-symbols-outlined text-[23px] font-bold">arrow_back</span>
            </button>
            
            <div 
              onClick={() => router.push(`/chats/${id}/profile`)}
              className="flex items-center gap-2 cursor-pointer active:opacity-90 overflow-hidden flex-1 h-full py-1"
            >
              {/* Avatar */}
              {activeChat?.avatar ? (
                <div className="w-[38px] h-[38px] rounded-full overflow-hidden border border-zinc-100 shrink-0">
                  <img alt={activeChat.name} className="w-full h-full object-cover" src={activeChat.avatar} />
                </div>
              ) : (
                <div className={`w-[38px] h-[38px] rounded-full ${activeChat?.avatarBg || "bg-blue-50 border border-blue-100"} flex items-center justify-center shrink-0 overflow-hidden`}>
                  {activeChat?.isCleanzo ? (
                    <div className="flex flex-col items-center justify-center text-center p-0.5 leading-none">
                      <span className="text-[6px] font-black uppercase text-blue-600 leading-none">Cleanzo</span>
                      <span className="material-symbols-outlined text-[10px] text-blue-500 fill leading-none mt-0.5">local_car_wash</span>
                    </div>
                  ) : (
                    <span className="text-[12px] font-bold text-[#54656f]">{activeChat?.avatarText || "G"}</span>
                  )}
                </div>
              )}

              <div className="flex flex-col min-w-0 leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-[15px] font-bold text-[#1c2e35] truncate max-w-[160px]">
                    {activeChat?.name}
                  </span>
                  {isMuted && (
                    <span className="material-symbols-outlined text-[16px] text-zinc-400">volume_off</span>
                  )}
                </div>
                {activeChat?.subtext && (
                  <span className="text-[11.5px] text-[#667781] truncate">
                    {activeChat?.subtext}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#54656f] shrink-0 relative">
            <button className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors active:scale-95">
              <span className="material-symbols-outlined text-[23px]">videocam</span>
            </button>
            <button className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors active:scale-95">
              <span className="material-symbols-outlined text-[23px]">call</span>
            </button>
            <button 
              onClick={() => { setShowMenu(prev => !prev); setShowSubMenu(false); }}
              className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors active:scale-95"
              aria-label="Chat menu options"
            >
              <span className="material-symbols-outlined text-[23px]">more_vert</span>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                {/* Backdrop overlay */}
                <div className="fixed inset-0 z-40 cursor-default" onClick={() => { setShowMenu(false); setShowSubMenu(false); }}></div>
                
                <div className="absolute right-1 top-[46px] z-50 bg-white rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-zinc-100 py-1.5 w-[200px] text-[15px] text-[#111b21] animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  {!showSubMenu ? (
                    <ul className="flex flex-col">
                      <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); setShowNewGroup(true); }}>New group</li>
                      <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); router.push(`/chats/${id}/profile`); }}>View contact</li>
                      <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); setShowSearchBar(true); }}>Search</li>
                      <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); router.push(`/chats/${id}/media`); }}>Media, links, and docs</li>
                      <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); setShowMuteModal(true); }}>Mute notifications</li>
                      <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); setShowDisappearing(true); }}>Disappearing messages</li>
                      <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); setShowChatTheme(true); }}>Chat theme</li>
                      <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors flex justify-between items-center" onClick={(e) => { e.stopPropagation(); setShowSubMenu(true); }}>
                        <span>More</span>
                        <span className="material-symbols-outlined text-[20px] text-zinc-400">chevron_right</span>
                      </li>
                    </ul>
                  ) : (
                    <ul className="flex flex-col animate-in slide-in-from-right-5 duration-150">
                      <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); setShowSubMenu(false); setShowReportModal(true); }}>Report</li>
                      <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); setShowSubMenu(false); setShowBlockModal(true); }}>Block</li>
                      <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); setShowSubMenu(false); setShowClearModal(true); }}>Clear chat</li>
                      <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); setShowSubMenu(false); setShowExportModal(true); }}>Export chat</li>
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </header>
      )}

      {/* Messages Canvas */}
      <div className={`flex-1 overflow-hidden relative ${
        activeTheme === "blue" ? "bg-gradient-to-b from-[#0f172a] to-[#1e293b]" :
        activeTheme === "purple" ? "bg-gradient-to-tr from-[#2c1338] to-[#160d21]" :
        activeTheme === "orange" ? "bg-gradient-to-tr from-[#3a1a05] to-[#1c0f05]" :
        activeTheme === "teal" ? "bg-gradient-to-tr from-[#062828] to-[#0b1414]" :
        "chat-bg bg-cover bg-center"
      }`}>
        {/* Scrollable Container */}
        <main 
          onClick={() => { if (selectedMessageIds.length > 0) setSelectedMessageIds([]); }}
          className="absolute inset-0 overflow-y-auto px-3.5 py-4 pb-6 space-y-3.5 no-scrollbar"
        >
          {filteredMessages.map((msg) => {
            if (msg.isDivider) {
              return (
                <div key={msg.id} className="flex justify-center my-3 select-none">
                  <span className="bg-white text-zinc-500 text-[11.5px] font-semibold px-3 py-1 rounded-[8px] shadow-[0_1.5px_2px_rgba(0,0,0,0.06)] uppercase tracking-wide">
                    {msg.text}
                  </span>
                </div>
              );
            }

            const isOutgoing = msg.sender === "outgoing";
            return (
              <div
                key={msg.id}
                className={`flex flex-col w-full relative ${isOutgoing ? "items-end" : "items-start"} ${
                  selectedMessageIds.includes(msg.id) ? "bg-[#00a884]/25 py-1 transition-all duration-200" : ""
                }`}
                onTouchStart={(e) => handleStartPress(e, msg.id)}
                onTouchEnd={handleEndPress}
                onTouchMove={handleEndPress}
                onMouseDown={(e) => handleStartPress(e, msg.id)}
                onMouseUp={handleEndPress}
                onMouseLeave={handleEndPress}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isLongPressActiveRef.current) {
                    isLongPressActiveRef.current = false;
                    return;
                  }

                  if (selectedMessageIds.length > 0) {
                    if (selectedMessageIds.includes(msg.id)) {
                      setSelectedMessageIds(prev => prev.filter(id => id !== msg.id));
                    } else {
                      setSelectedMessageIds(prev => [...prev, msg.id]);
                    }
                  }
                }}
              >
                {/* Message Bubble Wrapper to contain Share button */}
                <div className="relative flex items-center max-w-[85%] md:max-w-[70%]">
                  
                  {/* Reactions Popover */}
                  {selectedMessageIds.length === 1 && selectedMessageIds[0] === msg.id && (
                    <div className="absolute z-[100] -top-12 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.15)] px-3 py-2 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150 border border-zinc-100/80">
                      {["👍", "❤️", "😂", "😮", "😢", "🙏", "🎉"].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReact(msg.id, emoji);
                          }}
                          className="text-[20px] hover:scale-125 active:scale-95 transition-transform duration-100 cursor-pointer p-0.5"
                        >
                          {emoji}
                        </button>
                      ))}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReact(msg.id, "✨");
                        }}
                        className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-[14px] cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  )}

                  {/* Share button for incoming links */}
                  {!isOutgoing && msg.showShare && (
                    <button className="w-8 h-8 rounded-full bg-white/70 hover:bg-white shadow-sm flex items-center justify-center absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 text-zinc-500 cursor-pointer">
                      <span className="material-symbols-outlined text-[17px] transform scale-x-[-1]">reply</span>
                    </button>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`w-full rounded-[12px] shadow-[0_1px_1.5px_rgba(0,0,0,0.12)] px-3 py-1.5 pb-2 relative ${
                      isOutgoing
                        ? (activeTheme === "blue" ? "bg-[#007aff] text-white rounded-tr-[2px]" :
                           activeTheme === "purple" ? "bg-[#7e22ce] text-white rounded-tr-[2px]" :
                           activeTheme === "orange" ? "bg-[#ea580c] text-white rounded-tr-[2px]" :
                           activeTheme === "teal" ? "bg-[#0d9488] text-white rounded-tr-[2px]" :
                           "bg-[#d9fdd3] text-[#111b21] rounded-tr-[2px]")
                        : "bg-white text-[#111b21] rounded-tl-[2px]"
                    }`}
                  >
                    {/* Sender name for group chats */}
                    {!isOutgoing && msg.senderName && (
                      <div className="flex justify-between items-baseline gap-4 mb-1">
                        <span className={`text-[12.5px] font-bold ${msg.senderColor}`}>
                          {msg.senderName}
                        </span>
                        {msg.senderPhone && (
                          <span className="text-[10px] text-[#667781] font-normal">
                            {msg.senderPhone}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Reply Card */}
                    {msg.replyTo && (
                      <div className="bg-[#f5f6f6] border-l-[4px] border-[#027eb5] rounded-r-[6px] p-2 mb-2 flex justify-between items-center text-[13px] leading-tight select-none">
                        <div className="flex flex-col flex-1 min-w-0 pr-2">
                          <span className="font-bold text-[#027eb5] mb-0.5">{msg.replyTo.name}</span>
                          <span className="text-[#667781] truncate line-clamp-2 white-space-pre-line">{msg.replyTo.text}</span>
                        </div>
                        {msg.replyTo.image && (
                          <img src={msg.replyTo.image} className="w-10 h-10 object-cover rounded-md shrink-0 ml-1.5" />
                        )}
                      </div>
                    )}

                    {/* Link Preview Card */}
                    {msg.isLinkCard && (
                      <div className="bg-[#f5f6f6] rounded-[8px] overflow-hidden mb-2 border border-zinc-100/60 flex">
                        {msg.linkImage && (
                          <div className="w-[82px] h-[82px] shrink-0 bg-white flex items-center justify-center p-1 border-r border-zinc-200/50">
                            <img src={msg.linkImage} className="max-w-full max-h-full object-contain" />
                          </div>
                        )}
                        <div className="p-2 flex-1 min-w-0 flex flex-col justify-center leading-tight">
                          <span className="font-bold text-[13px] text-[#1c2e35] truncate">{msg.linkTitle}</span>
                          <span className="text-[11px] text-zinc-500 truncate mt-0.5">{msg.linkDescription}</span>
                          <div className="flex items-center gap-1 mt-1 text-[11px] text-[#00a884] font-semibold">
                            <span className="material-symbols-outlined text-[13px]">link</span>
                            <span className="truncate">{msg.linkDomain}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image attachment */}
                    {msg.image && (
                      <div className="relative rounded-[8px] overflow-hidden mb-1.5 border border-zinc-100 max-w-[280px]">
                        {isOutgoing ? (
                          <img className="w-full h-auto object-cover max-h-[180px]" src={msg.image} alt="Attached image" />
                        ) : (
                          <>
                            <img className="w-full h-auto object-cover max-h-[180px] filter blur-[1.5px] brightness-90" src={msg.image} alt="Attached image" />
                            {/* Download size overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <button className="bg-black/55 text-white text-[12px] font-semibold px-3 py-2 rounded-full flex items-center gap-1.5 hover:bg-black/75 transition-all">
                                <span className="material-symbols-outlined text-[17px] font-bold">download</span>
                                <span>{msg.imageSize}</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {msg.image && !msg.text && <div className="h-4"></div>}

                    {/* Document Card attachment */}
                    {msg.isDocumentCard && (
                      <div className="bg-[#f0f2f5] rounded-[8px] p-2.5 mb-1.5 flex items-center justify-between gap-3 border border-zinc-200/40 select-none min-w-[220px]">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="material-symbols-outlined text-purple-600 text-[28px] shrink-0">description</span>
                          <div className="flex flex-col min-w-0 flex-1 leading-tight">
                            <span className="text-[13.5px] font-medium text-[#111b21] truncate">{msg.documentName}</span>
                            <span className="text-[11px] text-[#667781] mt-0.5">{msg.documentSize}</span>
                          </div>
                        </div>
                        <button className="text-zinc-500 hover:text-zinc-800 p-1 cursor-pointer">
                          <span className="material-symbols-outlined text-[20px] font-bold">download</span>
                        </button>
                      </div>
                    )}

                    {/* Contact Card attachment */}
                    {msg.isContactCard && (
                      <div className="bg-[#f0f2f5] rounded-[8px] overflow-hidden mb-1.5 border border-zinc-200/40 select-none min-w-[220px]">
                        <div className="p-3 flex items-center gap-3.5">
                          {msg.contactAvatar ? (
                            <img src={msg.contactAvatar} className="w-[38px] h-[38px] rounded-full object-cover shrink-0" />
                          ) : (
                            <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center text-[13.5px] font-bold shrink-0 ${msg.contactAvatarBg}`}>
                              {msg.contactAvatarText}
                            </div>
                          )}
                          <div className="flex flex-col leading-tight min-w-0">
                            <span className="text-[14px] font-bold text-[#111b21] truncate">{msg.contactName}</span>
                            <span className="text-[11.5px] text-[#667781] mt-0.5">Contact</span>
                          </div>
                        </div>
                        <div className="border-t border-zinc-200/50 py-2 text-center text-[13px] font-semibold text-[#00a884] hover:bg-zinc-100/50 cursor-pointer active:bg-zinc-100 transition-colors">
                          Message
                        </div>
                      </div>
                    )}

                    {/* Poll Card attachment */}
                    {msg.isPollCard && (
                      <div className="flex flex-col gap-2.5 min-w-[240px] max-w-[310px] select-none text-sans font-sans">
                        {/* Question */}
                        <span className="text-[14px] font-bold text-[#111b21] leading-tight break-words">{msg.pollQuestion}</span>
                        
                        {/* Options List */}
                        <div className="flex flex-col gap-3.5 mt-1">
                          {msg.pollOptions.map((opt, idx) => {
                            const hasVoted = opt.voters.includes("me");
                            const totalVotes = msg.pollOptions.reduce((acc, o) => acc + o.voters.length, 0);
                            const votesCount = opt.voters.length;
                            const pct = totalVotes > 0 ? (votesCount / totalVotes) * 100 : 0;
                            
                            return (
                              <div 
                                key={idx} 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePollVote(msg.id, idx);
                                }}
                                className="flex flex-col gap-1.5 cursor-pointer active:opacity-80 transition-opacity"
                              >
                                {/* Option Header */}
                                <div className="flex items-center gap-2.5">
                                  {/* Selector Circle */}
                                  <div className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-colors ${
                                    hasVoted ? "border-[#00a884] bg-[#00a884] text-white" : "border-zinc-300"
                                  }`}>
                                    {hasVoted && <span className="material-symbols-outlined text-[12px] font-bold">done</span>}
                                  </div>
                                  {/* Text */}
                                  <span className="text-[13px] text-[#111b21] font-medium break-words leading-tight">{opt.text}</span>
                                </div>
                                
                                {/* Progress Bar Row */}
                                <div className="flex items-center gap-2.5 pl-[26px]">
                                  {/* Bar */}
                                  <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-300 ${hasVoted ? "bg-[#00a884]" : "bg-zinc-400"}`} 
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  {/* Votes count */}
                                  <span className="text-[10px] text-[#667781] shrink-0 font-semibold">{votesCount} {votesCount === 1 ? "vote" : "votes"}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {msg.isPollCard && <div className="h-5"></div>}

                    {/* Message content */}
                    {msg.isTagsOnly ? (
                      <p className="text-[14.2px] font-semibold text-[#008069] break-words leading-relaxed whitespace-pre-wrap">
                        {renderTextWithLinks(msg.text, searchQuery)}
                      </p>
                    ) : (
                      <p className="text-[14.2px] font-normal break-words leading-relaxed whitespace-pre-wrap pr-10">
                        {renderTextWithLinks(msg.text, searchQuery)}
                      </p>
                    )}

                    {/* Time + Status stamp */}
                    <div className="absolute bottom-1 right-2 flex items-center gap-0.5 select-none">
                      <span className="text-[10.5px] text-[#667781] font-medium leading-none">
                        {msg.time}
                      </span>
                      {isOutgoing && (
                        <span className="material-symbols-outlined text-[16px] text-[#53bdeb] font-bold leading-none">
                          done_all
                        </span>
                      )}
                    </div>

                    {/* Reaction badge */}
                    {msg.reaction && (
                      <div className="absolute -bottom-2.5 left-2 bg-white rounded-full px-1.5 py-0.5 text-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.15)] border border-zinc-50 flex items-center justify-center select-none">
                        {msg.reaction}
                      </div>
                    )}
                  </div>
                </div>
                {/* Spacer to align bubble spacing with reaction overflow */}
                {msg.reaction && <div className="h-2"></div>}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </main>
      </div>

      {/* Backdrop overlay for Attach Sheet */}
      {showAttachSheet && (
        <div 
          className="fixed inset-0 z-40 bg-black/10 transition-opacity duration-200" 
          onClick={() => setShowAttachSheet(false)}
        ></div>
      )}

      {/* Input & Attach Bottom Container */}
      <div className="bg-[#efeae2] shrink-0 w-full relative z-50 flex flex-col">
        {/* Hidden File Inputs */}
        <input 
          type="file" 
          ref={galleryInputRef} 
          accept="image/*,video/*" 
          onChange={handleGalleryChange} 
          style={{ display: "none" }} 
        />
        <input 
          type="file" 
          ref={documentInputRef} 
          accept="*" 
          onChange={handleDocumentChange} 
          style={{ display: "none" }} 
        />
        {/* Input Bottom Bar */}
        <div className="bg-[#efeae2] px-2 py-1.5 flex flex-col gap-1 max-w-3xl mx-auto w-full">
          {/* Reply Preview Card */}
          {replyingMessage && (
            <div className="bg-white border-l-[4px] border-[#027eb5] rounded-lg p-2.5 flex justify-between items-center text-[13px] leading-tight select-none shadow-sm animate-in slide-in-from-bottom-2 duration-150">
              <div className="flex flex-col flex-1 min-w-0 pr-2">
                <span className="font-bold text-[#027eb5] mb-0.5">
                  {replyingMessage.sender === "outgoing" ? "You" : (activeChat.name || "Kittu")}
                </span>
                <span className="text-[#667781] truncate">{replyingMessage.text}</span>
              </div>
              <button 
                type="button"
                onClick={() => setReplyingMessage(null)}
                className="text-[#8696a0] hover:text-zinc-700 p-1 flex items-center justify-center rounded-full hover:bg-zinc-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )}

          {isBlocked ? (
            <div 
              onClick={() => {
                setIsBlocked(false);
                showToast("Contact unblocked");
              }}
              className="flex items-center justify-center bg-white rounded-xl py-3 px-4 shadow-sm border border-zinc-200/80 cursor-pointer w-full active:scale-95 transition-all select-none"
            >
              <span className="text-[14.5px] text-[#667781] text-center font-medium">
                You blocked this contact. <span className="text-[#00a884] font-bold hover:underline">Tap to unblock.</span>
              </span>
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex items-center gap-1.5 w-full">
              {/* Text Input Capsule */}
              <div className="flex-1 bg-white rounded-full flex items-center min-h-[44px] shadow-sm px-2 gap-1.5">
                {/* Emoji Trigger */}
                <button
                  type="button"
                  className="p-1 text-[#54656f] hover:bg-zinc-50 rounded-full active:scale-95 shrink-0"
                >
                  <span className="material-symbols-outlined text-[23px]">sentiment_satisfied</span>
                </button>

                {/* Input field */}
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInput}
                  placeholder="Message"
                  className="flex-1 bg-transparent border-none focus:outline-none py-2 px-1 text-[15px] text-[#111b21] placeholder-[#667781] outline-none"
                />

                {/* Paperclip Attachment */}
                <button
                  type="button"
                  onClick={() => setShowAttachSheet(prev => !prev)}
                  className={`p-1 hover:bg-zinc-50 rounded-full active:scale-95 shrink-0 rotate-[-45deg] transition-all ${
                    showAttachSheet ? "text-[#00a884] bg-zinc-100" : "text-[#54656f]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[23px]">attach_file</span>
                </button>

                {/* Camera Trigger */}
                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="p-1 text-[#54656f] hover:bg-zinc-50 rounded-full active:scale-95 shrink-0 mr-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[23px]">photo_camera</span>
                </button>
              </div>

              {/* Mic / Send Round FAB */}
              <button
                type={inputText.trim() ? "submit" : "button"}
                className="w-[44px] h-[44px] bg-[#00a884] hover:bg-[#008f70] text-white rounded-full flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                {inputText.trim() ? (
                  <span className="material-symbols-outlined text-[21px] transform rotate-[-30deg] pl-0.5">
                    send
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[21px] fill">
                    mic
                  </span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Attach Bottom Sheet inside the flow */}
        {showAttachSheet && (
          <div className="bg-white rounded-t-[28px] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex flex-col font-sans select-none animate-in slide-in-from-bottom duration-250 max-w-3xl mx-auto w-full border-t border-zinc-100">
            {/* Pull Handle */}
            <div className="w-full flex justify-center py-3.5 cursor-pointer" onClick={() => setShowAttachSheet(false)}>
              <div className="w-9 h-1.5 bg-zinc-300 rounded-full"></div>
            </div>

            {/* Grid of 8 Actions */}
            <div className="grid grid-cols-4 gap-y-6 gap-x-2 px-6 pb-6 text-center select-none">
              {/* Gallery */}
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-14 h-14 bg-white border border-zinc-100/80 rounded-full flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)] hover:bg-zinc-50 active:scale-95 transition-all text-blue-500 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[26px]">image</span>
                </button>
                <span className="text-[12.5px] text-[#667781] mt-2 font-medium">Gallery</span>
              </div>

              {/* Location */}
              <div className="flex flex-col items-center">
                <button 
                  onClick={handleSendLocation}
                  className="w-14 h-14 bg-white border border-zinc-100/80 rounded-full flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)] hover:bg-zinc-50 active:scale-95 transition-all text-emerald-500 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[26px] fill">location_on</span>
                </button>
                <span className="text-[12.5px] text-[#667781] mt-2 font-medium">Location</span>
              </div>

              {/* Contact */}
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => setShowContactPicker(true)}
                  className="w-14 h-14 bg-white border border-zinc-100/80 rounded-full flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)] hover:bg-zinc-50 active:scale-95 transition-all text-sky-500 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[26px] fill">person</span>
                </button>
                <span className="text-[12.5px] text-[#667781] mt-2 font-medium">Contact</span>
              </div>

              {/* Document */}
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => documentInputRef.current?.click()}
                  className="w-14 h-14 bg-white border border-zinc-100/80 rounded-full flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)] hover:bg-zinc-50 active:scale-95 transition-all text-purple-500 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[26px] fill">description</span>
                </button>
                <span className="text-[12.5px] text-[#667781] mt-2 font-medium">Document</span>
              </div>

              {/* Poll */}
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => setShowPollCreator(true)}
                  className="w-14 h-14 bg-white border border-zinc-100/80 rounded-full flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)] hover:bg-zinc-50 active:scale-95 transition-all text-[#ffb300] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[26px] font-bold">bar_chart</span>
                </button>
                <span className="text-[12.5px] text-[#667781] mt-2 font-medium">Poll</span>
              </div>


            </div>

            {/* Gallery Image Grid (Recent Media) */}
            <div className="grid grid-cols-4 gap-1 px-1 pb-1 shrink-0 select-none bg-zinc-50/50 border-t border-zinc-100">
              {/* Thumbnail 1: Delivered placeholder */}
              <div className="aspect-square bg-zinc-100 relative overflow-hidden flex flex-col justify-end p-2 cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all">
                <div className="absolute top-1 left-1.5 text-[5px] text-zinc-400 font-mono leading-none bg-white/40 p-0.5 rounded">
                  Delivered<br/>2 July, 18:17
                </div>
                <div className="w-full h-full flex items-center justify-center bg-white">
                  <span className="material-symbols-outlined text-zinc-300 text-[28px]">article</span>
                </div>
              </div>

              {/* Thumbnail 2: QR Code */}
              <div className="aspect-square bg-zinc-200 relative overflow-hidden cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&fit=crop&q=80" 
                  alt="QR Code Scan screenshot" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Thumbnail 3: Laptop Photo (with time/video tag) */}
              <div className="aspect-square bg-zinc-200 relative overflow-hidden cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all">
                <img 
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=150&fit=crop&q=80" 
                  alt="Laptop keyboard" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-1 left-1.5 flex items-center gap-0.5 bg-black/40 text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                  <span className="material-symbols-outlined text-[10px] fill">videocam</span>
                  <span>0:29</span>
                </div>
              </div>

              {/* Thumbnail 4: Explorer folder */}
              <div className="aspect-square bg-zinc-200 relative overflow-hidden cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all">
                <img 
                  src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&fit=crop&q=80" 
                  alt="Desktop explorer" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Thumbnail 5: smartphone layout */}
              <div className="aspect-square bg-zinc-200 relative overflow-hidden cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all">
                <img 
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&fit=crop&q=80" 
                  alt="Smart Phone Layout" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Thumbnail 6: Code editor */}
              <div className="aspect-square bg-zinc-200 relative overflow-hidden cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all">
                <img 
                  src="https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=150&fit=crop&q=80" 
                  alt="Developer screen" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Thumbnail 7: Landscape view */}
              <div className="aspect-square bg-zinc-200 relative overflow-hidden cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all">
                <img 
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&fit=crop&q=80" 
                  alt="Beach landscape" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Thumbnail 8: Document sheet scan */}
              <div className="aspect-square bg-zinc-200 relative overflow-hidden cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all">
                <img 
                  src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=150&fit=crop&q=80" 
                  alt="Document/Text layout" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#111b21] text-[#e9edef] px-4 py-2.5 rounded-lg shadow-lg text-[13.5px] font-medium tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Mute Message Notifications Modal (Dark Theme - Reference Image 5) */}
      {showMuteModal && (
        <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-6 transition-all duration-200">
          <div className="w-full max-w-[320px] bg-[#233138] rounded-[28px] p-6 text-[#e9edef] shadow-2xl flex flex-col font-sans select-none animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-medium tracking-wide text-white mb-2.5">
              Mute message notifications
            </h3>
            
            <p className="text-[13.5px] leading-relaxed text-[#8696a0] mb-5">
              Other members will not see that you muted this chat. You will still be notified if you are mentioned.
            </p>

            <div className="flex flex-col gap-4">
              {["8 hours", "1 week", "Always"].map((opt) => (
                <div 
                  key={opt}
                  className="flex items-center justify-between cursor-pointer py-0.5"
                  onClick={() => setMuteDuration(opt)}
                >
                  <span className="text-[15.5px] text-[#e9edef]">{opt}</span>
                  <div className="relative flex items-center justify-center shrink-0">
                    <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-colors ${
                      muteDuration === opt ? "border-[#00a884]" : "border-[#8696a0]"
                    }`}>
                      {muteDuration === opt && (
                        <div className="w-[10px] h-[10px] rounded-full bg-[#00a884]"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end items-center gap-6 mt-6 pt-2 select-none">
              <button 
                onClick={() => setShowMuteModal(false)}
                className="text-[#00a884] hover:text-[#008f70] font-semibold text-[14.5px] tracking-wide active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsMuted(true);
                  setShowMuteModal(false);
                  showToast(`Muted notifications for ${muteDuration}`);
                }}
                className="text-[#00a884] hover:text-[#008f70] font-semibold text-[14.5px] tracking-wide active:scale-95 transition-transform"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Group Interface (Dark Theme - Reference Image 2) */}
      {showNewGroup && (
        <div className="fixed inset-0 z-[60] bg-[#0b141a] text-white flex flex-col font-sans select-none animate-in fade-in duration-200">
          {/* Header */}
          <header className="flex items-center justify-between h-[56px] px-3.5 shrink-0 border-b border-[#222c32] bg-[#0b141a]">
            <div className="flex items-center flex-1">
              <button
                onClick={() => {
                  setShowNewGroup(false);
                  setNewGroupSearch("");
                }}
                className="text-[#8696a0] hover:text-white p-1.5 hover:bg-[#202c33] rounded-full active:scale-95 transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
              <div className="flex-1 ml-3">
                <input
                  type="text"
                  value={newGroupSearch}
                  onChange={(e) => setNewGroupSearch(e.target.value)}
                  placeholder="Search name or number..."
                  className="w-full bg-transparent border-none focus:outline-none py-1.5 text-[15px] text-[#e9edef] placeholder-[#8696a0] outline-none"
                  autoFocus
                />
              </div>
            </div>
            <button className="text-[#8696a0] hover:text-white p-1.5 hover:bg-[#202c33] rounded-full active:scale-95 transition-all shrink-0">
              <span className="material-symbols-outlined text-[22px]">apps</span>
            </button>
          </header>

          {/* Selected Members Chips */}
          {selectedContacts.length > 0 && (
            <div className="shrink-0 bg-[#0b141a] px-4 py-3 flex flex-col">
              <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
                {selectedContacts.map((contactId) => {
                  const contact = newGroupContacts.find(c => c.id === contactId);
                  if (!contact) return null;
                  return (
                    <div key={contactId} className="flex flex-col items-center shrink-0 relative w-[60px]">
                      <div className="relative">
                        {contact.avatar ? (
                          <div className="w-[48px] h-[48px] rounded-full overflow-hidden border border-[#222c32]">
                            <img alt={contact.name} className="w-full h-full object-cover" src={contact.avatar} />
                          </div>
                        ) : (
                          <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center ${contact.avatarBg} font-semibold text-xs`}>
                            <span>{contact.avatarText}</span>
                          </div>
                        )}
                        <button
                          onClick={() => setSelectedContacts(prev => prev.filter(id => id !== contactId))}
                          className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-[#8696a0] hover:bg-white text-[#0b141a] rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-90"
                          title="Remove"
                        >
                          <span className="material-symbols-outlined text-[12px] font-bold">close</span>
                        </button>
                      </div>
                      <span className="text-[11.5px] text-[#8696a0] mt-1 text-center truncate w-full">
                        {contact.name.split(" ")[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="h-[1px] bg-[#222c32] w-full mt-3"></div>
            </div>
          )}

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto no-scrollbar py-2">
            {/* AI assistant section */}
            {newGroupSearch.trim() === "" && (
              <div className="flex flex-col mb-4">
                <span className="px-6 py-2 text-[13px] font-bold text-[#8696a0] uppercase tracking-wider select-none">
                  AI assistant
                </span>
                
                {/* Meta AI row */}
                <div 
                  onClick={() => {
                    const isSelected = selectedContacts.includes("meta-ai");
                    if (isSelected) {
                      setSelectedContacts(prev => prev.filter(id => id !== "meta-ai"));
                    } else {
                      setSelectedContacts(prev => [...prev, "meta-ai"]);
                    }
                  }}
                  className="flex items-center px-6 py-3 hover:bg-[#202c33] active:bg-[#10171d] transition-colors cursor-pointer select-none"
                >
                  {/* Meta AI logo design (gradient purple/blue circle ring) */}
                  <div className="relative w-[44px] h-[44px] rounded-full bg-gradient-to-tr from-[#a855f7] via-[#ec4899] to-[#3b82f6] p-[2px] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(168,85,247,0.3)]">
                    <div className="w-full h-full rounded-full bg-[#0b141a] flex items-center justify-center">
                      <div className="w-[18px] h-[18px] rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#ec4899] animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 ml-4">
                    <span className="text-[16px] text-[#e9edef] font-medium block">
                      Meta AI
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center justify-center">
                    <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedContacts.includes("meta-ai") ? "bg-[#00a884] border-[#00a884]" : "border-[#8696a0]"
                    }`}>
                      {selectedContacts.includes("meta-ai") && (
                        <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Frequently contacted section */}
            <div className="flex flex-col">
              <span className="px-6 py-2 text-[13px] font-bold text-[#8696a0] uppercase tracking-wider select-none">
                Frequently contacted
              </span>

              {newGroupContacts
                .filter(c => !c.isAI && (newGroupSearch.trim() === "" || c.name.toLowerCase().includes(newGroupSearch.toLowerCase())))
                .map((contact) => {
                  const isSelected = selectedContacts.includes(contact.id);
                  return (
                    <div 
                      key={contact.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedContacts(prev => prev.filter(id => id !== contact.id));
                        } else {
                          setSelectedContacts(prev => [...prev, contact.id]);
                        }
                      }}
                      className="flex items-center px-6 py-3.5 hover:bg-[#202c33] active:bg-[#10171d] transition-colors cursor-pointer select-none"
                    >
                      <div className="shrink-0">
                        {contact.avatar ? (
                          <div className="w-[44px] h-[44px] rounded-full overflow-hidden border border-[#222c32]">
                            <img alt={contact.name} className="w-full h-full object-cover" src={contact.avatar} />
                          </div>
                        ) : (
                          <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center ${contact.avatarBg} font-semibold text-sm`}>
                            <span>{contact.avatarText}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 ml-4">
                        <span className="text-[16px] text-[#e9edef] font-medium block truncate">
                          {contact.name}
                        </span>
                      </div>

                      <div className="shrink-0 flex items-center justify-center">
                        <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? "bg-[#00a884] border-[#00a884]" : "border-[#8696a0]"
                        }`}>
                          {isSelected && (
                            <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Floating Action Button (FAB) */}
          {selectedContacts.length > 0 && (
            <button
              onClick={() => {
                setShowNewGroup(false);
                setNewGroupSearch("");
                showToast("Group created successfully!");
              }}
              className="absolute bottom-6 right-6 w-[54px] h-[54px] bg-[#00a884] hover:bg-[#008f70] text-[#0b141a] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer z-50 animate-in zoom-in duration-100"
              title="Create Group"
            >
              <span className="material-symbols-outlined text-[24px] font-bold text-white">arrow_forward</span>
            </button>
          )}
        </div>
      )}

      {/* Disappearing Messages Screen (Dark Theme - Reference Image 1) */}
      {showDisappearing && (
        <div className="fixed inset-0 z-[60] bg-[#0b141a] text-white flex flex-col font-sans select-none animate-in fade-in duration-200">
          {/* Header */}
          <header className="flex items-center h-[56px] px-3.5 shrink-0 border-b border-[#222c32] bg-[#0b141a]">
            <button
              onClick={() => {
                setShowDisappearing(false);
                showToast(`Disappearing messages set to ${disappearingTimer}`);
              }}
              className="text-[#8696a0] hover:text-white p-1.5 hover:bg-[#202c33] rounded-full active:scale-95 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[19px] font-bold text-[#e9edef] ml-3">
              Disappearing messages
            </h1>
          </header>

          {/* Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 flex flex-col items-center">
            {/* SVG Clock Illustration */}
            <div className="w-[180px] h-[130px] relative flex items-center justify-center mb-6">
              <svg viewBox="0 0 100 80" className="w-full h-full text-[#00a884]">
                <path d="M70 20 C75 20, 85 25, 85 35 C85 45, 75 50, 70 50 C68 50, 60 48, 55 52 L55 45 C52 40, 55 30, 60 25 C65 20, 68 20, 70 20 Z" fill="#efeae2" fillOpacity="0.15" />
                <circle cx="34" cy="18" r="4" fill="#a3e635" fillOpacity="0.5" />
                <circle cx="28" cy="24" r="2.5" fill="#a3e635" fillOpacity="0.5" />
                <circle cx="30" cy="32" r="1.5" fill="#a3e635" fillOpacity="0.5" />
                <circle cx="48" cy="40" r="22" fill="#00a884" />
                <circle cx="48" cy="40" r="20" fill="none" stroke="#0b141a" strokeWidth="2.5" strokeDasharray="3,3" />
                <line x1="48" y1="40" x2="48" y2="28" stroke="#0b141a" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="48" y1="40" x2="56" y2="40" stroke="#0b141a" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="48" cy="40" r="3" fill="#0b141a" />
                <circle cx="38" cy="56" r="12" fill="#d9fdd3" fillOpacity="0.8" />
                <circle cx="46" cy="58" r="8" fill="#d9fdd3" fillOpacity="0.6" />
              </svg>
            </div>

            <h2 className="text-[15.5px] font-semibold text-white w-full text-left mt-2 tracking-wide">
              Make messages in this chat disappear
            </h2>
            <p className="text-[13.5px] leading-relaxed text-[#8696a0] mt-2 mb-6 text-left">
              For more privacy and storage, new messages will disappear from this chat for everyone after the selected duration except when kept. Anyone in the chat can change this setting. <span className="text-[#53bdeb] cursor-pointer hover:underline font-semibold">Learn more</span>
            </p>

            <div className="h-[1px] bg-[#222c32] w-full mb-4"></div>

            <span className="text-[13px] font-bold text-[#8696a0] uppercase tracking-wider w-full text-left mb-4 select-none">
              Message timer
            </span>

            {/* Radio Duration List */}
            <div className="flex flex-col w-full gap-4.5">
              {["24 hours", "7 days", "90 days", "Off"].map((timer) => {
                const isSelected = disappearingTimer === timer;
                return (
                  <div 
                    key={timer}
                    onClick={() => setDisappearingTimer(timer)}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <span className="text-[15.5px] text-[#e9edef] font-medium">{timer}</span>
                    <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? "border-[#00a884]" : "border-[#8696a0]"
                    }`}>
                      {isSelected && (
                        <div className="w-[10px] h-[10px] rounded-full bg-[#00a884]"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="h-[1px] bg-[#222c32] w-full my-6"></div>

            {/* Try Default Timer */}
            <div 
              onClick={() => showToast("Default message timer settings coming soon!")}
              className="flex items-start w-full cursor-pointer hover:bg-[#202c33] active:bg-[#10171d] p-3 -mx-3 rounded-xl transition-all select-none"
            >
              <span className="material-symbols-outlined text-[#8696a0] text-[23px] mt-0.5 mr-4 font-semibold">schedule</span>
              <div className="flex-1">
                <span className="block text-[15.5px] font-medium text-[#e9edef]">Try a default message timer</span>
                <span className="block text-[12.5px] text-[#8696a0] mt-0.5">Start your new chats with disappearing messages</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Theme Screen (Dark Theme - Reference Image 2) */}
      {showChatTheme && (
        <div className="fixed inset-0 z-[60] bg-[#0b141a] text-white flex flex-col font-sans select-none animate-in fade-in duration-200">
          {/* Header */}
          <header className="flex items-center justify-between h-[56px] px-3.5 shrink-0 border-b border-[#222c32] bg-[#0b141a]">
            <div className="flex items-center">
              <button
                onClick={() => setShowChatTheme(false)}
                className="text-[#8696a0] hover:text-white p-1.5 hover:bg-[#202c33] rounded-full active:scale-95 transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
              <h1 className="text-[19px] font-bold text-[#e9edef] ml-3">
                Chat theme
              </h1>
            </div>
            <button className="text-[#8696a0] hover:text-white p-1.5 hover:bg-[#202c33] rounded-full active:scale-95 transition-all shrink-0">
              <span className="material-symbols-outlined text-[22px]">more_vert</span>
            </button>
          </header>

          {/* Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-5">
            <span className="block text-[13px] font-bold text-[#8696a0] uppercase tracking-wider mb-4 select-none">
              Themes
            </span>

            {/* Grid of themes */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {/* Theme 1: Default Classic Green */}
              <div 
                onClick={() => {
                  setActiveTheme("default");
                  showToast("Theme changed to Classic Green");
                }}
                className={`relative aspect-[3/4] rounded-[16px] border-2 bg-[#efeae2] overflow-hidden flex flex-col justify-end p-2 cursor-pointer transition-all active:scale-95 ${
                  activeTheme === "default" ? "border-white shadow-[0_0_12px_rgba(255,255,255,0.2)]" : "border-transparent"
                }`}
              >
                <div className="w-full flex flex-col gap-1 mb-2">
                  <div className="bg-white rounded-lg p-1 text-[7px] max-w-[80%] self-start text-[#111b21] leading-none">Hello</div>
                  <div className="bg-[#d9fdd3] rounded-lg p-1 text-[7px] max-w-[80%] self-end text-[#111b21] leading-none">Hey!</div>
                </div>
                {activeTheme === "default" && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[15px] font-bold">check</span>
                  </div>
                )}
              </div>

              {/* Theme 2: AI */}
              <div 
                onClick={() => showToast("AI Custom Themes coming soon!")}
                className="relative aspect-[3/4] rounded-[16px] border-2 border-transparent bg-gradient-to-tr from-[#3b82f6] via-[#ec4899] to-[#8b5cf6] overflow-hidden flex flex-col items-center justify-center p-2 cursor-pointer transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px] text-white animate-pulse">sparkles</span>
                <span className="text-[9px] font-semibold text-white mt-1 text-center leading-tight">Create with AI</span>
              </div>

              {/* Theme 3: Slate Blue */}
              <div 
                onClick={() => {
                  setActiveTheme("blue");
                  showToast("Theme changed to Slate Blue");
                }}
                className={`relative aspect-[3/4] rounded-[16px] border-2 bg-gradient-to-b from-[#1e293b] to-[#0f172a] overflow-hidden flex flex-col justify-end p-2 cursor-pointer transition-all active:scale-95 ${
                  activeTheme === "blue" ? "border-white shadow-[0_0_12px_rgba(255,255,255,0.2)]" : "border-transparent"
                }`}
              >
                <div className="w-full flex flex-col gap-1 mb-2">
                  <div className="bg-white rounded-lg p-1 text-[7px] max-w-[80%] self-start text-[#111b21] leading-none">Hi</div>
                  <div className="bg-[#007aff] rounded-lg p-1 text-[7px] max-w-[80%] self-end text-white leading-none">Hey!</div>
                </div>
                {activeTheme === "blue" && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[15px] font-bold">check</span>
                  </div>
                )}
              </div>

              {/* Theme 4: Lavender Purple */}
              <div 
                onClick={() => {
                  setActiveTheme("purple");
                  showToast("Theme changed to Lavender Purple");
                }}
                className={`relative aspect-[3/4] rounded-[16px] border-2 bg-gradient-to-b from-[#4c1d95] to-[#2e1065] overflow-hidden flex flex-col justify-end p-2 cursor-pointer transition-all active:scale-95 ${
                  activeTheme === "purple" ? "border-white shadow-[0_0_12px_rgba(255,255,255,0.2)]" : "border-transparent"
                }`}
              >
                <div className="w-full flex flex-col gap-1 mb-2">
                  <div className="bg-white rounded-lg p-1 text-[7px] max-w-[80%] self-start text-[#111b21] leading-none">Yo</div>
                  <div className="bg-[#7e22ce] rounded-lg p-1 text-[7px] max-w-[80%] self-end text-white leading-none">Hey!</div>
                </div>
                {activeTheme === "purple" && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[15px] font-bold">check</span>
                  </div>
                )}
              </div>

              {/* Row 2 - Theme 5: Sunset Orange */}
              <div 
                onClick={() => {
                  setActiveTheme("orange");
                  showToast("Theme changed to Sunset Orange");
                }}
                className={`relative aspect-[3/4] rounded-[16px] border-2 bg-gradient-to-b from-[#78350f] to-[#451a03] overflow-hidden flex flex-col justify-end p-2 cursor-pointer transition-all active:scale-95 ${
                  activeTheme === "orange" ? "border-white shadow-[0_0_12px_rgba(255,255,255,0.2)]" : "border-transparent"
                }`}
              >
                <div className="w-full flex flex-col gap-1 mb-2">
                  <div className="bg-white rounded-lg p-1 text-[7px] max-w-[80%] self-start text-[#111b21] leading-none">Yo</div>
                  <div className="bg-[#ea580c] rounded-lg p-1 text-[7px] max-w-[80%] self-end text-white leading-none">Hey!</div>
                </div>
                {activeTheme === "orange" && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[15px] font-bold">check</span>
                  </div>
                )}
              </div>

              {/* Theme 6: Teal Green */}
              <div 
                onClick={() => {
                  setActiveTheme("teal");
                  showToast("Theme changed to Teal Green");
                }}
                className={`relative aspect-[3/4] rounded-[16px] border-2 bg-gradient-to-b from-[#115e59] to-[#042f2e] overflow-hidden flex flex-col justify-end p-2 cursor-pointer transition-all active:scale-95 ${
                  activeTheme === "teal" ? "border-white shadow-[0_0_12px_rgba(255,255,255,0.2)]" : "border-transparent"
                }`}
              >
                <div className="w-full flex flex-col gap-1 mb-2">
                  <div className="bg-white rounded-lg p-1 text-[7px] max-w-[80%] self-start text-[#111b21] leading-none">Hey</div>
                  <div className="bg-[#0d9488] rounded-lg p-1 text-[7px] max-w-[80%] self-end text-white leading-none">Yo!</div>
                </div>
                {activeTheme === "teal" && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[15px] font-bold">check</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-[13px] text-[#8696a0] mb-6">
              The chat bubble and wallpaper will both change.
            </p>

            <span className="block text-[13px] font-bold text-[#8696a0] uppercase tracking-wider mb-3 select-none">
              Customize
            </span>

            {/* Customize items */}
            <div className="flex flex-col bg-[#202c33] rounded-[16px] overflow-hidden divide-y divide-[#222c32] shadow-md">
              <div 
                onClick={() => showToast("Bubble customizer coming soon!")}
                className="flex items-center px-4 py-4 hover:bg-[#2a3942] active:bg-[#1a2529] cursor-pointer transition-all select-none"
              >
                <span className="material-symbols-outlined text-[#8696a0] mr-4 text-[22px]">chat_bubble</span>
                <span className="text-[15.5px] font-medium text-[#e9edef]">Chat bubble</span>
              </div>
              <div 
                onClick={() => showToast("Wallpaper customizer coming soon!")}
                className="flex items-center px-4 py-4 hover:bg-[#2a3942] active:bg-[#1a2529] cursor-pointer transition-all select-none"
              >
                <span className="material-symbols-outlined text-[#8696a0] mr-4 text-[22px]">wallpaper</span>
                <span className="text-[15.5px] font-medium text-[#e9edef]">Wallpaper</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal (Light Mode - White/Grey - Reference Image 2) */}
      {showReportModal && (
        <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-6 transition-all duration-200">
          <div className="w-full max-w-[320px] bg-white rounded-[28px] p-6 text-[#111b21] shadow-2xl flex flex-col font-sans select-none animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-3 text-[#54656f]">
              <span className="material-symbols-outlined text-[24px]">thumb_down</span>
              <h3 className="text-xl font-bold tracking-wide text-[#111b21]">
                Report to Zetto?
              </h3>
            </div>
            
            <p className="text-[14px] leading-relaxed text-[#667781] mb-5">
              The last 5 messages in this chat will be sent to Zetto. This person won't know you reported or blocked them. <span className="text-[#00a884] font-semibold cursor-pointer hover:underline">Learn more</span>
            </p>

            <div 
              onClick={() => setReportBlockCheckbox(!reportBlockCheckbox)}
              className="flex items-start gap-3 cursor-pointer py-1.5 select-none"
            >
              <div className="mt-0.5 flex items-center justify-center">
                <div className={`w-[18px] h-[18px] rounded border flex items-center justify-center transition-colors ${
                  reportBlockCheckbox ? "bg-[#00a884] border-[#00a884]" : "border-[#667781]"
                }`}>
                  {reportBlockCheckbox && (
                    <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                  )}
                </div>
              </div>
              <span className="text-[14.5px] leading-snug text-[#111b21]">
                Block {activeChat?.name} and clear chat
              </span>
            </div>

            <div className="flex justify-end items-center gap-6 mt-6 pt-2 select-none">
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-[#00a884] hover:text-[#008f70] font-bold text-[14.5px] tracking-wide active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowReportModal(false);
                  showToast("Report submitted");
                  if (reportBlockCheckbox) {
                    setIsBlocked(true);
                    setMessages([]);
                  }
                }}
                className="text-[#00a884] hover:text-[#008f70] font-bold text-[14.5px] tracking-wide active:scale-95 transition-transform"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Modal (Light Mode - White/Grey - Reference Image 3) */}
      {showBlockModal && (
        <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-6 transition-all duration-200">
          <div className="w-full max-w-[320px] bg-white rounded-[28px] p-6 text-[#111b21] shadow-2xl flex flex-col font-sans select-none animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-3 text-[#54656f]">
              <span className="material-symbols-outlined text-[24px]">block</span>
              <h3 className="text-xl font-bold tracking-wide text-[#111b21]">
                Block {activeChat?.name}?
              </h3>
            </div>
            
            <p className="text-[14px] leading-relaxed text-[#667781] mb-5">
              Blocked contacts will no longer be able to call you or send you messages. They won't know you blocked or reported them.
            </p>

            <div 
              onClick={() => setBlockReportCheckbox(!blockReportCheckbox)}
              className="flex items-start gap-3 cursor-pointer py-1.5 select-none"
            >
              <div className="mt-0.5 flex items-center justify-center">
                <div className={`w-[18px] h-[18px] rounded border flex items-center justify-center transition-colors ${
                  blockReportCheckbox ? "bg-[#00a884] border-[#00a884]" : "border-[#667781]"
                }`}>
                  {blockReportCheckbox && (
                    <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                  )}
                </div>
              </div>
              <span className="text-[14.5px] leading-snug text-[#111b21]">
                Report to Zetto
              </span>
            </div>

            <div className="flex justify-end items-center gap-6 mt-6 pt-2 select-none">
              <button 
                onClick={() => setShowBlockModal(false)}
                className="text-[#00a884] hover:text-[#008f70] font-bold text-[14.5px] tracking-wide active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowBlockModal(false);
                  setIsBlocked(true);
                  if (blockReportCheckbox) {
                    showToast("Reported and blocked");
                  } else {
                    showToast("Contact blocked");
                  }
                }}
                className="text-[#00a884] hover:text-[#008f70] font-bold text-[14.5px] tracking-wide active:scale-95 transition-transform"
              >
                Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Chat Modal/Bottom Sheet (Light Mode - White/Grey - Reference Image 4) */}
      {showClearModal && (
        <div className="fixed inset-0 z-[70] bg-black/60 flex items-end justify-center transition-all duration-200">
          <div className="w-full max-w-md bg-white rounded-t-[28px] p-6 text-[#111b21] shadow-2xl flex flex-col font-sans select-none animate-in slide-in-from-bottom duration-250">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowClearModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-600 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] font-bold">close</span>
                </button>
                <h3 className="text-xl font-bold tracking-wide text-[#111b21] ml-2">
                  Clear chat
                </h3>
              </div>
            </div>

            {/* Clear options */}
            <div className="flex flex-col gap-4.5 mb-5">
              {/* Option 1: All messages */}
              <div 
                onClick={() => setClearOption("all")}
                className="flex items-center justify-between cursor-pointer py-1 select-none"
              >
                <span className="text-[15.5px] text-[#111b21] font-medium">All messages (101.6 MB)</span>
                <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-colors ${
                  clearOption === "all" ? "border-[#00a884]" : "border-[#667781]"
                }`}>
                  {clearOption === "all" && (
                    <div className="w-[10px] h-[10px] rounded-full bg-[#00a884]"></div>
                  )}
                </div>
              </div>

              {/* Option 2: Media files only */}
              <div 
                onClick={() => setClearOption("media")}
                className="flex items-center justify-between cursor-pointer py-1 select-none"
              >
                <span className="text-[15.5px] text-[#111b21] font-medium">Media files only (101.5 MB)</span>
                <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-colors ${
                  clearOption === "media" ? "border-[#00a884]" : "border-[#667781]"
                }`}>
                  {clearOption === "media" && (
                    <div className="w-[10px] h-[10px] rounded-full bg-[#00a884]"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-zinc-100 w-full mb-5"></div>

            {/* Checkbox */}
            <div 
              onClick={() => setClearStarred(!clearStarred)}
              className="flex items-start gap-3 cursor-pointer py-1 select-none mb-5"
            >
              <div className="mt-0.5 flex items-center justify-center">
                <div className={`w-[18px] h-[18px] rounded border flex items-center justify-center transition-colors ${
                  clearStarred ? "bg-[#00a884] border-[#00a884]" : "border-[#667781]"
                }`}>
                  {clearStarred && (
                    <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                  )}
                </div>
              </div>
              <span className="text-[14.5px] leading-snug text-[#111b21]">
                Clear starred messages
              </span>
            </div>

            <p className="text-[12.5px] text-[#667781] leading-relaxed mb-6">
              Media files you have saved from Zetto will remain in your device gallery.
            </p>

            {/* Action pill button */}
            <button
              onClick={() => {
                setShowClearModal(false);
                if (clearOption === "all") {
                  setMessages([]);
                  showToast("Chat cleared");
                } else {
                  setMessages(prev => prev.map(msg => msg.image ? { ...msg, image: null, text: "[Media deleted]" } : msg));
                  showToast("Media files cleared");
                }
              }}
              className="w-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-[#ea0038] font-bold py-3.5 rounded-full text-[15.5px] transition-all active:scale-[0.98] select-none text-center cursor-pointer"
            >
              Clear chat ({clearOption === "all" ? "101.6 MB" : "101.5 MB"})
            </button>
          </div>
        </div>
      )}

      {/* Export Chat Modal (Light Mode - White/Grey - Reference Image 5) */}
      {showExportModal && (
        <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-6 transition-all duration-200">
          <div className="w-full max-w-[300px] bg-white rounded-[28px] p-6 text-[#111b21] shadow-2xl flex flex-col font-sans select-none animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-[15px] font-medium leading-relaxed text-[#111b21] mb-6">
              Including media will increase the size of the chat export.
            </h3>

            <div className="flex justify-end items-center gap-6 select-none">
              <button 
                onClick={() => {
                  const textContent = messages
                    .map(msg => msg.isDivider ? `--- ${msg.text} ---` : `[${msg.time}] ${msg.sender === "outgoing" ? "You" : activeChat?.name}: ${msg.text || "[Media attachment omitted]"}`)
                    .join("\n");
                  const blob = new Blob([textContent], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `${activeChat?.name}_chat_export.txt`;
                  link.click();
                  URL.revokeObjectURL(url);
                  setShowExportModal(false);
                  showToast("Chat exported");
                }}
                className="text-[#00a884] hover:text-[#008f70] font-bold text-[14.5px] tracking-wide active:scale-95 transition-transform cursor-pointer"
              >
                Without media
              </button>
              <button 
                onClick={() => {
                  const textContent = messages
                    .map(msg => msg.isDivider ? `--- ${msg.text} ---` : `[${msg.time}] ${msg.sender === "outgoing" ? "You" : activeChat?.name}: ${msg.text || (msg.image ? `[Media Attachment: ${msg.image}]` : "")}`)
                    .join("\n");
                  const blob = new Blob([textContent], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `${activeChat?.name}_chat_export_with_media.txt`;
                  link.click();
                  URL.revokeObjectURL(url);
                  setShowExportModal(false);
                  showToast("Chat exported with media");
                }}
                className="text-[#00a884] hover:text-[#008f70] font-bold text-[14.5px] tracking-wide active:scale-95 transition-transform cursor-pointer"
              >
                Include media
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Message Info Screen */}
      {infoMessage && (
        <div className="fixed inset-0 z-[80] bg-[#f8f9fa] flex flex-col font-sans select-none animate-in fade-in duration-200">
          {/* Header */}
          <header className="flex items-center h-[60px] px-3.5 shrink-0 bg-white shadow-sm border-b border-zinc-100">
            <button
              onClick={() => setInfoMessage(null)}
              className="text-[#54656f] p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[19px] font-semibold text-[#111b21] ml-4">
              Message info
            </h1>
          </header>

          {/* Body */}
          <div className="flex-1 overflow-y-auto bg-[#efeae2] flex flex-col">
            {/* Message Preview Box with Chat Wallpaper background */}
            <div className={`p-4 py-8 flex flex-col ${
              activeTheme === "blue" ? "bg-gradient-to-b from-[#0f172a] to-[#1e293b]" :
              activeTheme === "purple" ? "bg-gradient-to-tr from-[#2c1338] to-[#160d21]" :
              activeTheme === "orange" ? "bg-gradient-to-tr from-[#3a1a05] to-[#1c0f05]" :
              activeTheme === "teal" ? "bg-gradient-to-tr from-[#062828] to-[#0b1414]" :
              "chat-bg bg-cover bg-center"
            }`}>
              <div className={`flex flex-col w-full ${infoMessage.sender === "outgoing" ? "items-end" : "items-start"}`}>
                <div className="relative flex items-center max-w-[85%] md:max-w-[70%]">
                  {/* Message Bubble rendering */}
                  <div
                    className={`w-full rounded-[12px] shadow-[0_1px_1.5px_rgba(0,0,0,0.12)] px-3 py-1.5 pb-2 relative ${
                      infoMessage.sender === "outgoing"
                        ? (activeTheme === "blue" ? "bg-[#007aff] text-white rounded-tr-[2px]" :
                           activeTheme === "purple" ? "bg-[#7e22ce] text-white rounded-tr-[2px]" :
                           activeTheme === "orange" ? "bg-[#ea580c] text-white rounded-tr-[2px]" :
                           activeTheme === "teal" ? "bg-[#0d9488] text-white rounded-tr-[2px]" :
                           "bg-[#d9fdd3] text-[#111b21] rounded-tr-[2px]")
                        : "bg-white text-[#111b21] rounded-tl-[2px]"
                    }`}
                  >
                    {/* Reply Card */}
                    {infoMessage.replyTo && (
                      <div className="bg-[#f5f6f6] border-l-[4px] border-[#027eb5] rounded-r-[6px] p-2 mb-2 flex justify-between items-center text-[13px] leading-tight select-none">
                        <div className="flex flex-col flex-1 min-w-0 pr-2">
                          <span className="font-bold text-[#027eb5] mb-0.5">{infoMessage.replyTo.name}</span>
                          <span className="text-[#667781] truncate line-clamp-2 white-space-pre-line">{infoMessage.replyTo.text}</span>
                        </div>
                        {infoMessage.replyTo.image && (
                          <img src={infoMessage.replyTo.image} className="w-10 h-10 object-cover rounded-md shrink-0 ml-1.5" />
                        )}
                      </div>
                    )}

                    {/* Link Preview Card */}
                    {infoMessage.isLinkCard && (
                      <div className="bg-[#f5f6f6] rounded-[8px] overflow-hidden mb-2 border border-zinc-100/60 flex">
                        {infoMessage.linkImage && (
                          <div className="w-[82px] h-[82px] shrink-0 bg-white flex items-center justify-center p-1 border-r border-zinc-200/50">
                            <img src={infoMessage.linkImage} className="max-w-full max-h-full object-contain" />
                          </div>
                        )}
                        <div className="p-2 flex-1 min-w-0 flex flex-col justify-center leading-tight">
                          <span className="font-bold text-[13px] text-[#1c2e35] truncate">{infoMessage.linkTitle}</span>
                          <span className="text-[11px] text-zinc-500 truncate mt-0.5">{infoMessage.linkDescription}</span>
                          <div className="flex items-center gap-1 mt-1 text-[11px] text-[#00a884] font-semibold">
                            <span className="material-symbols-outlined text-[13px]">link</span>
                            <span className="truncate">{infoMessage.linkDomain}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image attachment */}
                    {infoMessage.image && (
                      <div className="relative rounded-[8px] overflow-hidden mb-1.5 border border-zinc-100 max-w-[280px]">
                        <img className="w-full h-auto object-cover max-h-[180px]" src={infoMessage.image} alt="Attached image" />
                      </div>
                    )}

                    {/* Message text */}
                    <p className="text-[14.2px] font-normal break-words leading-relaxed whitespace-pre-wrap pr-10 text-[#111b21]">
                      {renderTextWithLinks(infoMessage.text, searchQuery)}
                    </p>

                    {/* Time + Status stamp */}
                    <div className="absolute bottom-1 right-2 flex items-center gap-0.5 select-none">
                      <span className="text-[10.5px] text-[#667781] font-medium leading-none">
                        {infoMessage.time}
                      </span>
                      {infoMessage.sender === "outgoing" && (
                        <span className="material-symbols-outlined text-[16px] text-[#53bdeb] font-bold leading-none">
                          done_all
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Status Card */}
            <div className="m-4 bg-white rounded-lg shadow-sm border border-zinc-200/40 p-4.5 flex flex-col text-sans">
              {/* Read Section */}
              <div className="flex flex-col py-1.5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-[#53bdeb] font-bold">done_all</span>
                  <span className="text-[16px] font-medium text-[#111b21]">Read</span>
                </div>
                <span className="text-[14.5px] text-[#667781] ml-8 mt-1.5">—</span>
              </div>

              {/* Separator line */}
              <div className="h-[1px] bg-zinc-100 my-3 ml-8"></div>

              {/* Delivered Section */}
              <div className="flex flex-col py-1.5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-zinc-400 font-bold">done_all</span>
                  <span className="text-[16px] font-medium text-[#111b21]">Delivered</span>
                </div>
                <span className="text-[14.5px] text-[#667781] ml-8 mt-1.5">2 July, {infoMessage.time}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Picker Modal Overlay */}
      {showContactPicker && (
        <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4 transition-all duration-200">
          <div className="w-full max-w-[360px] bg-white rounded-[24px] overflow-hidden text-[#111b21] shadow-2xl flex flex-col font-sans select-none animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-[#00a884] text-white px-5 py-4 flex items-center gap-4">
              <button 
                type="button"
                onClick={() => setShowContactPicker(false)}
                className="text-white hover:bg-[#009071] p-1.5 rounded-full active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[22px] font-bold">arrow_back</span>
              </button>
              <span className="text-[18px] font-semibold">Share Contact</span>
            </div>

            {/* Contacts list */}
            <div className="flex-1 overflow-y-auto max-h-[300px] py-2">
              {newGroupContacts.map((contact) => (
                <div 
                  key={contact.id} 
                  onClick={() => handleShareContact(contact)}
                  className="flex items-center gap-3.5 px-5 py-3 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer border-b border-zinc-100/50 transition-colors"
                >
                  {/* Avatar */}
                  {contact.avatar ? (
                    <img src={contact.avatar} className="w-[42px] h-[42px] rounded-full object-cover shrink-0" />
                  ) : (
                    <div className={`w-[42px] h-[42px] rounded-full flex items-center justify-center text-[15px] font-bold shrink-0 ${contact.avatarBg || "bg-[#00a884] text-white"}`}>
                      {contact.avatarText || contact.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Name */}
                  <span className="text-[15.5px] font-medium text-[#111b21]">{contact.name}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-zinc-50 px-5 py-3 flex justify-end border-t border-zinc-100">
              <button 
                type="button"
                onClick={() => setShowContactPicker(false)}
                className="text-[#00a884] hover:text-[#008f70] font-bold text-[14.5px] tracking-wide cursor-pointer active:scale-95 transition-transform"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Camera Modal Overlay */}
      {showCamera && (
        <div className="fixed inset-0 z-[130] bg-black flex flex-col font-sans select-none animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex justify-between items-center h-[60px] px-4 text-white z-10">
            {capturedPhoto ? (
              <button 
                type="button"
                onClick={handleRetakePhoto}
                className="text-white hover:bg-white/10 p-2 rounded-full active:scale-95 transition-all cursor-pointer flex items-center gap-1 font-medium"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                <span className="text-[14px]">Retake</span>
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => setShowCamera(false)}
                className="text-white hover:bg-white/10 p-2 rounded-full active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            )}
            <span className="text-[16px] font-semibold">
              {capturedPhoto ? "Photo Preview" : "Take Photo"}
            </span>
            <div className="w-[60px]"></div> {/* Spacer to center title */}
          </div>

          {/* Body Box */}
          <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden">
            {capturedPhoto ? (
              <img 
                src={capturedPhoto} 
                alt="Captured preview" 
                className="w-full h-full max-h-[85vh] object-contain"
              />
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full max-h-[85vh] object-cover"
              />
            )}
            {/* Hidden Canvas for Capture */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>

          {/* Bottom Bar */}
          <div className="h-[120px] bg-black flex items-center justify-center p-6 shrink-0">
            {capturedPhoto ? (
              <button 
                type="button"
                onClick={handleSendCapturedPhoto}
                className="w-[64px] h-[64px] rounded-full bg-[#00a884] hover:bg-[#008f70] flex items-center justify-center shadow-lg active:scale-95 transition-all text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[26px] transform rotate-[-30deg] pl-0.5">send</span>
              </button>
            ) : (
              <button 
                type="button"
                onClick={handleCapturePhoto}
                className="w-[72px] h-[72px] rounded-full border-4 border-white p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-full h-full bg-white rounded-full"></div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Poll Creator Modal Overlay */}
      {showPollCreator && (
        <div className="fixed inset-0 z-[140] bg-black/60 flex items-center justify-center p-4 transition-all duration-200">
          <div className="w-full max-w-[380px] bg-white rounded-[24px] overflow-hidden text-[#111b21] shadow-2xl flex flex-col font-sans select-none animate-in fade-in zoom-in-95 duration-150 max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#00a884] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => setShowPollCreator(false)}
                  className="text-white hover:bg-[#009071] p-1.5 rounded-full active:scale-95 transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[22px] font-bold">arrow_back</span>
                </button>
                <span className="text-[18px] font-semibold">Create Poll</span>
              </div>
              <button 
                type="button"
                onClick={handleCreatePoll}
                className="bg-white text-[#00a884] hover:bg-zinc-50 px-4 py-1.5 rounded-full text-[13.5px] font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Create
              </button>
            </div>

            {/* Form scroll container */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
              {/* Question Section */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-[#00a884] tracking-wide uppercase">Question</label>
                <input 
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full border-b-2 border-zinc-200 focus:border-[#00a884] py-2 text-[14.5px] outline-none transition-colors placeholder-zinc-400"
                />
              </div>

              {/* Options Section */}
              <div className="flex flex-col gap-3">
                <label className="text-[13px] font-bold text-[#00a884] tracking-wide uppercase">Options</label>
                <div className="flex flex-col gap-3.5">
                  {pollOptions.map((option, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {/* Circle dot decoration */}
                      <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-zinc-300 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full"></div>
                      </div>
                      
                      <input 
                        type="text"
                        value={option}
                        onChange={(e) => updatePollOptionValue(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 border-b border-zinc-200 focus:border-[#00a884] py-1 text-[13.5px] outline-none transition-colors placeholder-zinc-400"
                      />

                      {/* Clear / Delete option button */}
                      <button 
                        type="button"
                        onClick={() => removePollOption(idx)}
                        className="text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer shrink-0 active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Option Trigger */}
                {pollOptions.length < 10 && (
                  <button 
                    type="button"
                    onClick={() => setPollOptions([...pollOptions, ""])}
                    className="flex items-center gap-2 text-[#00a884] hover:text-[#008f70] font-semibold text-[13.5px] mt-2 self-start cursor-pointer active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[18px] font-bold">add</span>
                    <span>Add option</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
