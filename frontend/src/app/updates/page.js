"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";

export default function UpdatesPage() {
  const [following, setFollowing] = useState({ sarkari: false, gemini: false, flipkart: false });
  const [activeStatus, setActiveStatus] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [activeSuggestedChannel, setActiveSuggestedChannel] = useState(null);
  
  const [replyText, setReplyText] = useState("");
  const [progress, setProgress] = useState(0);
  
  // Poll State
  const [pollVotes, setPollVotes] = useState({ yes: 1, no: 5 });
  const [selectedPollOption, setSelectedPollOption] = useState(null);

  const toggleFollow = (channel) => {
    setFollowing((prev) => ({ ...prev, [channel]: !prev[channel] }));
  };

  const statusCards = [
    {
      id: "praveen",
      name: "Praveen Jaiswal Un...",
      userName: "Peacerex Bbx",
      time: "Today, 11:29",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwQrgxOsMS1XWAnphaxw8os32Nkd0OyGaUCh4ajkQScMRmv-tZ1xTQfgLOlboD17H-5Q8XkMsgCNonvqt7oUFQcAe9ryGmn9cMAwkTpD58X9U_qG-UwP9ppKXDU-pRgjA7JHMLu_PgtT8k6IT-DjpPsz4kD8EXPGEUwvOHGv-3Gw9lOpsIw9PDFwNQk5c3wN6I4ztIjpTTGJ5U7ltKTOxLJVo_lm-mJkMdAWjTxhFi9fhTDvbcQNsRRl1cG_7vSsSZto-zZwjvlPw",
      bgImage: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=600&auto=format&fit=crop&q=80",
      caption: "Today, 25th june. No grains atleast.",
    },
    {
      id: "balram",
      name: "Balram Yadav Sage",
      userName: "Balram Yadav Sage",
      time: "Today, 10:45",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD209t6Zin8k_HGjBSvGIRB_KONmSIL8sbz2S-MQFb6yxRje3Ge3PGp-yyOH_yZg4mCb_u8FkyApwL2yhfjFnLSiwHkH3lawFQHkpZmSRXx5D7BGsdZYSdvP6PhIeM3t9PjrvbV02NUdZMoHPGEZ-ZwJRlrv8enxQjqxirmtclZn9U_UQz7m55E9_VQNGreM6hRVv44INUgYZ7PQRf4Oct93w5plsG6f9LeRAuAOZt_QSgliP9AOs46NF7TylHhikGVRGfXyCWVFLo",
      bgImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
      caption: "Working from home today!",
    },
    {
      id: "yash",
      name: "Yash Pathrod Voicestra S...",
      userName: "Yash Pathrod",
      time: "Today, 09:15",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCl7HlttMM7jx4HR07t6nrc2b_3nNR8q8lyd7V8ZA2Md1Gqa2SmXeUp8cSN6CJgzOSKt5R3xt3nAX1gPx1CbRISUA_IDr7XGJ-UkDjmKNQvEpg20XG6pi-yFNFtpGI5x1pP5eXRKfYSmDXSt4-aGchA1tgO9tK7qyLbhjZx5tdQb9rvohEmN0OddYGOZQlEZGGhi82PFDcctsc-vKLcshgLwvy4jCt0HWGiOfUR3h2Pw0zw6V2J5b2md57LOMfEP0EiT9B-k1Pw6qI",
      bgImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
      caption: "Weekend vibes ☕",
    },
  ];

  const channelsList = [
    {
      id: "steal-deal",
      name: "Steal The Deal & Collab ❤️",
      avatarBg: "bg-black text-white",
      avatarIcon: "shopping_bag",
      message: "🔗 https://www.wishlink.com/share/6bnx...",
      time: "10:49",
      unread: 249,
      followers: "1K followers",
    },
    {
      id: "fast-otp",
      name: "Fast otp",
      avatarBg: "bg-[#dfe5e7] text-[#54656f]",
      avatarIcon: "chat_bubble",
      message: "Isko connect krke telegram use kr sakte ho",
      time: "17/06/2026",
      unread: 0,
      followers: "850 followers",
    },
    {
      id: "zero-investment",
      name: "Zero_Investment_Work...📌",
      avatarBg: "bg-emerald-100 text-emerald-700",
      avatarIcon: "eco",
      message: "📷 Message my WhatsApp number :- 9756336...",
      time: "28/10/2025",
      unread: 0,
      followers: "12K followers",
    },
  ];

  const findChannels = [
    {
      id: "sarkari",
      name: "Sarkari Result Official",
      followers: "4M followers",
      logoBg: "bg-red-600 text-white font-bold",
      logoText: "Sarkari Result",
    },
    {
      id: "gemini",
      name: "Gemini Prompt ✨",
      followers: "775K followers",
      logoBg: "bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-500 text-white",
      logoIcon: "star",
    },
    {
      id: "flipkart",
      name: "Flipkart",
      followers: "1M followers",
      logoBg: "bg-yellow-400 text-blue-800 font-bold",
      logoText: "f",
      verified: true,
    },
  ];

  // Auto-advance progress bar for status viewer
  useEffect(() => {
    let timer;
    if (activeStatus) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 100;
          }
          return prev + 2; // Increments by 2% every 80ms (4 seconds total duration)
        });
      }, 80);
    }
    return () => clearInterval(timer);
  }, [activeStatus]);

  // Transition to next status or exit when progress finishes
  useEffect(() => {
    if (activeStatus && progress >= 100) {
      const currentIndex = statusCards.findIndex((s) => s.id === activeStatus.id);
      if (currentIndex !== -1 && currentIndex < statusCards.length - 1) {
        setActiveStatus(statusCards[currentIndex + 1]);
        setProgress(0);
      } else {
        setActiveStatus(null);
      }
    }
  }, [progress, activeStatus]);

  const handlePollVote = (option) => {
    if (selectedPollOption === option) return;
    
    setPollVotes((prev) => {
      const updated = { ...prev };
      if (selectedPollOption) {
        updated[selectedPollOption] = Math.max(0, updated[selectedPollOption] - 1);
      }
      updated[option] = updated[option] + 1;
      return updated;
    });
    setSelectedPollOption(option);
  };

  const totalVotes = pollVotes.yes + pollVotes.no;
  const yesPercentage = Math.round((pollVotes.yes / totalVotes) * 100) || 0;
  const noPercentage = Math.round((pollVotes.no / totalVotes) * 100) || 0;

  // 1. RENDER FULL SCREEN STATUS VIEWER
  if (activeStatus) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col font-sans select-none justify-between h-screen overflow-hidden">
        <div className="w-full px-2.5 pt-3.5 flex gap-1">
          <div className="h-[2.5px] bg-[#8696a0]/40 flex-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <header className="px-4 py-2.5 flex justify-between items-center bg-gradient-to-b from-black/40 to-transparent">
          <div className="flex items-center gap-3 overflow-hidden">
            <button
              onClick={() => setActiveStatus(null)}
              aria-label="Back"
              className="p-1 hover:bg-zinc-800/40 rounded-full active:scale-95 text-white shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>

            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-[38px] h-[38px] rounded-full border border-white overflow-hidden shrink-0">
                <img
                  className="w-full h-full object-cover"
                  alt={activeStatus.userName}
                  src={activeStatus.avatar}
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[14.5px] font-semibold text-white truncate">
                  {activeStatus.userName}
                </span>
                <span className="text-[11.5px] text-zinc-400 font-medium truncate">
                  {activeStatus.time}
                </span>
              </div>
            </div>
          </div>

          <button aria-label="More" className="p-1.5 hover:bg-zinc-800/40 rounded-full text-white">
            <span className="material-symbols-outlined text-[23px]">more_vert</span>
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center px-2 py-4 relative">
          <img
            className="max-h-[85vh] max-w-full object-contain rounded-sm"
            alt="Status media content"
            src={activeStatus.bgImage}
          />
        </div>

        {activeStatus.caption && (
          <div className="w-full text-center bg-black/60 py-3.5 px-4 mb-2 select-text">
            <p className="text-[15px] font-medium text-white tracking-wide">
              {activeStatus.caption}
            </p>
          </div>
        )}

        <div className="px-3.5 pb-5 pt-2 flex items-center gap-2 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex-1 bg-zinc-800/80 rounded-full flex items-center h-[42px] px-4 shadow-sm border border-zinc-700/30">
            <input
              type="text"
              placeholder="Reply"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-[14.5px] text-white placeholder-zinc-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0 px-1">
            <button className="text-[22px] active:scale-90 transition-transform">😍</button>
            <button className="text-[22px] active:scale-90 transition-transform">😂</button>
            <button className="text-[22px] active:scale-90 transition-transform">😮</button>
          </div>

          <button
            aria-label="Like Status"
            className="w-[42px] h-[42px] bg-zinc-850 hover:bg-zinc-800 text-white rounded-full flex items-center justify-center shrink-0 border border-zinc-700/40 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[22px] font-bold">favorite_border</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. RENDER FULL SCREEN CHANNEL DETAIL VIEW (JOINED CHANNELS)
  if (activeChannel) {
    return (
      <div className="fixed inset-0 bg-[#efeae2] text-[#1c2e35] z-50 flex flex-col font-sans overflow-hidden h-screen select-none">
        <header className="bg-white flex justify-between items-center h-[60px] px-2.5 shrink-0 border-b border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-1.5 overflow-hidden max-w-[75%]">
            <button
              onClick={() => setActiveChannel(null)}
              aria-label="Back"
              className="text-[#54656f] p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform shrink-0"
            >
              <span className="material-symbols-outlined text-[23px] font-bold">arrow_back</span>
            </button>

            <div className="flex items-center gap-2 cursor-pointer active:opacity-90 overflow-hidden">
              <div className={`w-[38px] h-[38px] rounded-full ${activeChannel.avatarBg} flex items-center justify-center shrink-0 overflow-hidden`}>
                {activeChannel.id === "steal-deal" ? (
                  <div className="flex flex-col items-center justify-center text-center p-0.5 leading-none bg-black text-white w-full h-full">
                    <span className="text-[6px] font-black uppercase tracking-tighter leading-none">Steal</span>
                    <span className="text-[6px] font-black uppercase tracking-tighter leading-none text-[#25d366]">Deals</span>
                  </div>
                ) : (
                  <span className="material-symbols-outlined text-[22px]">{activeChannel.avatarIcon}</span>
                )}
              </div>

              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-[15px] font-bold text-[#1c2e35] truncate max-w-[190px]">
                  {activeChannel.name}
                </span>
                <span className="text-[11.5px] text-[#667781] truncate">
                  {activeChannel.followers}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[#54656f] shrink-0 mr-1">
            <button aria-label="Mute Notifications" className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors active:scale-95">
              <span className="material-symbols-outlined text-[23px]">notifications_off</span>
            </button>
            <button aria-label="More" className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors active:scale-95">
              <span className="material-symbols-outlined text-[23px]">more_vert</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative chat-bg bg-cover bg-center">
          <main className="absolute inset-0 overflow-y-auto px-4 py-4 space-y-5 no-scrollbar pb-20">
            
            <div className="flex flex-col items-start w-full">
              <div className="bg-white text-[#111b21] rounded-[12px] shadow-[0_1px_1.5px_rgba(0,0,0,0.12)] p-3 pb-6 max-w-[90%] md:max-w-[70%] rounded-tl-[2px] relative select-text">
                <p className="font-bold text-[14.5px] mb-1">Share 5 product links daily for 10 days</p>
                <p className="text-[14px] mb-3">Open all shared links one by one</p>

                <p className="font-bold text-[14.5px] mb-1">Tracking 🥰</p>
                <p className="text-[14px] mb-3">Brand will track engagement & performance via links</p>

                <p className="font-bold text-[14.5px] mb-1">Focus</p>
                <p className="text-[14px] mb-0.5">Product discovery</p>
                <p className="text-[14px] mb-3">Affiliate-driven content</p>

                <p className="font-bold text-[14.5px] mb-3">Important</p>

                <p className="font-bold text-[14.5px] mb-3">Participation implies consent for performance tracking</p>

                <p className="text-[14px] mb-3"><span className="font-bold">Wishlink URLs</span> (single time click only)</p>

                <div className="flex flex-col gap-1.5 text-blue-600 text-[14px] underline font-medium">
                  <a href="#" className="hover:text-blue-800 break-all">https://www.wishlink.com/share/ncprvj</a>
                  <a href="#" className="hover:text-blue-800 break-all">https://www.wishlink.com/share/nwmhjq</a>
                  <a href="#" className="hover:text-blue-800 break-all">https://www.wishlink.com/share/n5m47t</a>
                  <a href="#" className="hover:text-blue-800 break-all">https://www.wishlink.com/share/newe46</a>
                  <a href="#" className="hover:text-blue-800 break-all">https://www.wishlink.com/share/n8vt6c</a>
                </div>

                <div className="absolute bottom-1 right-2 flex items-center select-none">
                  <span className="text-[10.5px] text-[#667781] font-medium leading-none">09:41</span>
                </div>
              </div>
              
              <button className="bg-white/90 text-[#54656f] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-md ml-2 mt-1.5 active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-[18px] font-bold">reply</span>
              </button>
            </div>

            <div className="flex flex-col items-start w-full">
              <div className="bg-white text-[#111b21] rounded-[12px] shadow-[0_1px_1.5px_rgba(0,0,0,0.12)] p-3 pb-6 max-w-[90%] md:max-w-[70%] rounded-tl-[2px] relative select-text">
                <p className="text-[14px] leading-relaxed">
                  Savana 1 rs sale <a href="#" className="text-blue-600 underline break-all">https://www.instagram.com/reel/DY6r4P6yqTC/?utm_source=ig_web_copy_link</a>
                </p>
                <p className="text-[14.2px] font-bold mt-1.5 leading-relaxed">
                  comment how for tricks last time ke tarah galati mt krna
                </p>
                
                <div className="absolute bottom-1 right-2 flex items-center select-none">
                  <span className="text-[10.5px] text-[#667781] font-medium leading-none">14:49</span>
                </div>
              </div>
              
              <button className="bg-white/90 text-[#54656f] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-md ml-2 mt-1.5 active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-[18px] font-bold">reply</span>
              </button>
            </div>

            <div className="flex flex-col items-start w-full">
              <div className="bg-white text-[#111b21] rounded-[12px] shadow-[0_1px_1.5px_rgba(0,0,0,0.12)] p-4 max-w-[90%] md:max-w-[70%] rounded-tl-[2px] w-full relative">
                <div className="mb-3.5">
                  <h4 className="text-[15.5px] font-bold text-[#1c2e35] leading-tight">Apka order hua</h4>
                  <div className="flex items-center gap-1 text-[#667781] text-[12px] font-medium mt-1">
                    <span className="material-symbols-outlined text-[16px] font-bold">check_box</span>
                    <span>Select one or more</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div onClick={() => handlePollVote("yes")} className="flex flex-col cursor-pointer group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          selectedPollOption === "yes" ? "border-[#00a884] bg-[#00a884] text-white" : "border-zinc-300 group-hover:border-zinc-400"
                        }`}>
                          {selectedPollOption === "yes" && <span className="material-symbols-outlined text-[12px] font-extrabold">check</span>}
                        </div>
                        <span className="text-[14.5px] font-semibold text-[#1c2e35]">Yes</span>
                      </div>
                      <span className="text-[13px] font-bold text-[#667781]">{pollVotes.yes}</span>
                    </div>
                    <div className="h-[7px] w-full bg-[#f0f2f5] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00a884] rounded-full transition-all duration-300" style={{ width: `${yesPercentage}%` }}></div>
                    </div>
                  </div>

                  <div onClick={() => handlePollVote("no")} className="flex flex-col cursor-pointer group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          selectedPollOption === "no" ? "border-[#00a884] bg-[#00a884] text-white" : "border-zinc-300 group-hover:border-zinc-400"
                        }`}>
                          {selectedPollOption === "no" && <span className="material-symbols-outlined text-[12px] font-extrabold">check</span>}
                        </div>
                        <span className="text-[14.5px] font-semibold text-[#1c2e35]">No</span>
                      </div>
                      <span className="text-[13px] font-bold text-[#667781]">{pollVotes.no}</span>
                    </div>
                    <div className="h-[7px] w-full bg-[#f0f2f5] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00a884] rounded-full transition-all duration-300" style={{ width: `${noPercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <div className="absolute bottom-4 right-4 z-45">
            <button className="w-9 h-9 bg-white text-[#54656f] rounded-full shadow-md flex items-center justify-center active:scale-90 transition-transform cursor-pointer border border-zinc-100">
              <span className="material-symbols-outlined text-[20px] font-bold">keyboard_double_arrow_down</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. RENDER FULL SCREEN SUGGESTED CHANNEL VIEW (NOT YET JOINED)
  if (activeSuggestedChannel) {
    return (
      <div className="fixed inset-0 bg-[#efeae2] text-[#1c2e35] z-50 flex flex-col font-sans overflow-hidden h-screen select-none">
        {/* Header */}
        <header className="bg-white flex justify-between items-center h-[60px] px-2.5 shrink-0 border-b border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-1.5 overflow-hidden max-w-[75%]">
            <button
              onClick={() => setActiveSuggestedChannel(null)}
              aria-label="Back"
              className="text-[#54656f] p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform shrink-0"
            >
              <span className="material-symbols-outlined text-[23px] font-bold">arrow_back</span>
            </button>

            <div className="flex items-center gap-2 cursor-pointer active:opacity-90 overflow-hidden">
              {/* Logo */}
              <div className={`w-[38px] h-[38px] rounded-full ${activeSuggestedChannel.logoBg} text-white flex items-center justify-center shrink-0 overflow-hidden text-[9px] font-bold uppercase`}>
                {activeSuggestedChannel.logoText ? (
                  <span>{activeSuggestedChannel.logoText}</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">{activeSuggestedChannel.logoIcon}</span>
                )}
              </div>

              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-[15px] font-bold text-[#1c2e35] truncate max-w-[190px]">
                  {activeSuggestedChannel.name}
                </span>
                <span className="text-[11.5px] text-[#667781] truncate">
                  {activeSuggestedChannel.followers}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#54656f] shrink-0 mr-1">
            <button aria-label="More" className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors active:scale-95">
              <span className="material-symbols-outlined text-[23px]">more_vert</span>
            </button>
          </div>
        </header>

        {/* Wallpaper Messages Area */}
        <div className="flex-1 overflow-hidden relative chat-bg bg-cover bg-center">
          <main className="absolute inset-0 overflow-y-auto px-4 py-4 space-y-5 no-scrollbar pb-32">
            
            {/* Message 1 */}
            <div className="flex flex-col items-start w-full">
              <div className="bg-white text-[#111b21] rounded-[12px] shadow-[0_1px_1.5px_rgba(0,0,0,0.12)] p-3 pb-6 max-w-[90%] md:max-w-[70%] rounded-tl-[2px] relative select-text">
                <p className="text-[14.5px] mb-2 leading-relaxed font-bold">🔥🔥</p>
                <p className="text-[13.5px] text-teal-700 font-semibold mb-3 leading-relaxed">
                  #SarkariResult #SarkariExam #OFSS #Bihar #sarkariresultofficial
                </p>
                <p className="text-[14px] font-bold mb-2">(Official Sarkari Result Since 2009) 👉</p>
                <p className="text-[14px] font-bold mb-2.5">Click Below Link To Download 👇</p>
                <a href="#" className="text-blue-600 underline text-[14px] font-medium block mb-3.5 break-all">
                  https://sarkariresult.com.cm/
                </a>
                <p className="text-[14px] font-bold mb-2">Join Us On official sarkari result Instagram Page 👇</p>
                <a href="#" className="text-blue-600 underline text-[14px] font-medium block break-all">
                  https://www.instagram.com/sarkariresult.com.cm_?igsh=MXF4a3Jtb3lmNm11cw==
                </a>

                <div className="absolute bottom-1 right-2 flex items-center select-none">
                  <span className="text-[10.5px] text-[#667781] font-medium leading-none">13:13</span>
                </div>
              </div>

              {/* Bottom Reaction Badges & Share overlay */}
              <div className="flex items-center gap-2 mt-1.5 ml-2.5 select-none">
                <div className="bg-zinc-100/90 border border-zinc-200/20 shadow-sm rounded-full px-2 py-0.5 text-[11px] text-[#667781] font-bold flex items-center gap-1">
                  <span>👍</span>
                  <span>❤️</span>
                  <span>😂</span>
                  <span>10</span>
                </div>
                <div className="bg-zinc-100/90 border border-zinc-200/20 shadow-sm rounded-full px-2.5 py-0.5 text-[11px] text-[#667781] font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[12px] font-bold">reply</span>
                  <span>21</span>
                </div>
              </div>
            </div>

            {/* Message 2 */}
            <div className="flex flex-col items-start w-full">
              <div className="bg-white text-[#111b21] rounded-[12px] shadow-[0_1px_1.5px_rgba(0,0,0,0.12)] p-3 pb-6 max-w-[90%] md:max-w-[70%] rounded-tl-[2px] relative select-text">
                <p className="text-[14.5px] font-bold leading-relaxed mb-1.5">
                  Bihar Police CSBC Constable Operator Admit Card 2026 - Link Active 🔥🔥
                </p>
                <p className="text-[14px] font-bold leading-relaxed mb-1.5">
                  Exam Date : 28 June 2026 👉
                </p>
                <p className="text-[13.5px] text-teal-700 font-semibold mb-3 leading-relaxed">
                  #SarkariResult #SarkariExam #CSBC #sarkariresult2026 #sarkariresultofficial
                </p>
                <p className="text-[14px] font-bold mb-2">(Official Sarkari Result Since 2009) 👉</p>
                <p className="text-[14px] font-bold mb-2.5">Click Below Link To Download 👇</p>
                <a href="#" className="text-blue-600 underline text-[14px] font-medium block mb-3.5 break-all">
                  https://sarkariresult.com.cm/bihar-police-csbc-constable-operator-2026/
                </a>
                <p className="text-[14px] font-bold mb-2">Join Us On official sarkari result Instagram Page 👇</p>
                <a href="#" className="text-blue-600 underline text-[14px] font-medium block break-all">
                  https://www.instagram.com/sarkariresult.com.cm_?igsh=MXF4a3Jtb3lmNm11cw==
                </a>

                <div className="absolute bottom-1 right-2 flex items-center select-none">
                  <span className="text-[10.5px] text-[#667781] font-medium leading-none">13:25</span>
                </div>
              </div>

              {/* Reaction Row */}
              <div className="flex items-center gap-2 mt-1.5 ml-2.5 select-none">
                <div className="bg-zinc-100/90 border border-zinc-200/20 shadow-sm rounded-full px-2 py-0.5 text-[11px] text-[#667781] font-bold flex items-center gap-1">
                  <span>👍</span>
                  <span>8</span>
                </div>
                <div className="bg-zinc-100/90 border border-zinc-200/20 shadow-sm rounded-full px-2.5 py-0.5 text-[11px] text-[#667781] font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[12px] font-bold">reply</span>
                  <span>7</span>
                </div>
              </div>
            </div>

          </main>
        </div>

        {/* Bottom Fixed Follow Bar */}
        <div className="bg-white shrink-0 px-4 py-3 flex flex-col items-center border-t border-zinc-100">
          <button
            onClick={() => {
              toggleFollow(activeSuggestedChannel.id);
              setActiveSuggestedChannel(null);
            }}
            className="w-full bg-[#00a884] hover:bg-[#008f70] text-white font-bold rounded-full py-3 text-[14.5px] transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            {following[activeSuggestedChannel.id] ? "Following" : "Follow channel"}
          </button>
          
          <p className="text-[11.5px] text-[#667781] text-center mt-2.5 leading-normal max-w-[92%] px-4">
            This channel has added privacy for your profile and phone number.{" "}
            <a href="#" className="text-[#008069] font-semibold hover:underline">Learn more</a>
          </p>
        </div>
      </div>
    );
  }

  // 4. MAIN UPDATES SCREEN
  return (
    <div className="w-full bg-white text-[#1c2e35] antialiased min-h-screen flex flex-col pb-24 font-sans select-none">
      {/* Top Header */}
      <header className="sticky top-0 bg-white z-40 px-4 py-3.5 flex justify-between items-center">
        <h1 className="text-[22px] font-bold text-[#1c2e35] font-sans">Updates</h1>
        <div className="flex items-center gap-5 text-[#3b4a54]">
          <button aria-label="Search" className="p-1 hover:bg-zinc-100 rounded-full transition-colors active:scale-95">
            <span className="material-symbols-outlined text-[24px]">search</span>
          </button>
          <button aria-label="More options" className="p-1 hover:bg-zinc-100 rounded-full transition-colors active:scale-95">
            <span className="material-symbols-outlined text-[24px]">more_vert</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-3xl mx-auto">
        {/* Status Section */}
        <section className="px-4 py-2">
          <h2 className="text-[20px] font-bold text-[#1c2e35] mb-3.5">Status</h2>
          
          {/* Horizontal scrollable Status Cards */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth pb-2">
            {/* Add Status Card */}
            <div className="w-[102px] h-[154px] rounded-[18px] border border-zinc-200 shrink-0 flex flex-col bg-white overflow-hidden relative cursor-pointer active:scale-98 transition-transform">
              <div className="flex-1 flex items-center justify-center relative bg-zinc-50 pt-2">
                <div className="relative">
                  <img
                    className="w-[58px] h-[58px] rounded-full object-cover border border-zinc-100"
                    alt="My status"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtSTDTUitRQB5aG-ZcdFAsyFdP86mWxvW55CsH3fDZwlfJQzUR8Xav3ghPt6k07h7ujn8WjMnfUwokeODYvQGKKOm7F33aNS0EEnqaoctdIhY8ELBRO8tQR6mKm8_M0WvqegMqhtKgIxXjkXMfUbV5OAZ2iz0uoTKeVH-5FFp1KbmYjoXhls-OIQUHDnNB91KgpZba0PQ5hk-LVeGan4gFJdAzjvJk3mHfnEHBA8mO8nDZBHLChXewILCZaO_GNayQUdKeTWP5oeQ"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#00a884] text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                    <span className="material-symbols-outlined text-[12px] font-bold">add</span>
                  </div>
                </div>
              </div>
              <div className="h-[48px] px-2 flex items-center justify-center text-center">
                <span className="text-[12.5px] font-semibold text-[#1c2e35]">Add status</span>
              </div>
            </div>

            {/* Other Status Cards */}
            {statusCards.map((card) => (
              <div
                key={card.id}
                onClick={() => setActiveStatus(card)}
                className="w-[102px] h-[154px] rounded-[18px] shrink-0 overflow-hidden relative cursor-pointer active:scale-98 transition-transform bg-zinc-100"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url(${card.bgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay green ring avatar in top-left */}
                <div className="absolute top-2 left-2.5 w-9 h-9 rounded-full border-2 border-[#00a884] flex items-center justify-center p-[1px] bg-white">
                  <img className="w-full h-full rounded-full object-cover" alt={card.name} src={card.avatar} />
                </div>

                {/* Status card name */}
                <span className="absolute bottom-2 left-2.5 right-2.5 text-white text-[12px] font-bold leading-[14px] line-clamp-2">
                  {card.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Divider line */}
        <hr className="border-t border-zinc-100 my-2 mx-4" />

        {/* Channels Section */}
        <section className="px-4 py-2">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[20px] font-bold text-[#1c2e35]">Channels</h2>
            <button className="bg-[#f0f2f5] text-[#54656f] text-[13px] font-bold rounded-full px-4 py-1.5 hover:bg-zinc-200 transition-colors active:scale-95 cursor-pointer">
              Explore
            </button>
          </div>

          <div className="flex flex-col">
            {channelsList.map((chan) => (
              <div
                key={chan.id}
                onClick={() => setActiveChannel(chan)}
                className="flex items-center py-3.5 cursor-pointer hover:bg-zinc-50 active:bg-zinc-100 rounded-lg transition-colors"
              >
                {/* Logo */}
                <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center ${chan.avatarBg} shrink-0 mr-3.5 overflow-hidden`}>
                  {chan.id === "steal-deal" ? (
                    <div className="flex flex-col items-center justify-center text-center p-0.5 leading-none bg-black text-white w-full h-full">
                      <span className="text-[7px] font-black uppercase tracking-tighter leading-none">Steal</span>
                      <span className="text-[7px] font-black uppercase tracking-tighter leading-none text-[#25d366]">Deals</span>
                    </div>
                  ) : (
                    <span className="material-symbols-outlined text-[24px]">{chan.avatarIcon}</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-[15.5px] font-bold text-[#1c2e35] truncate max-w-[70%]">
                      {chan.name}
                    </h3>
                    <span className={`text-[12px] shrink-0 font-medium ${chan.unread > 0 ? "text-[#00a884] font-bold" : "text-[#667781]"}`}>
                      {chan.time}
                    </span>
                  </div>
                  <p className="text-[13.5px] text-[#667781] truncate font-normal">
                    {chan.message}
                  </p>
                </div>

                {/* Unread Counter Badge */}
                {chan.unread > 0 && (
                  <div className="shrink-0 ml-3.5">
                    <span className="inline-flex items-center justify-center bg-[#00a884] text-white text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[22px]">
                      {chan.unread}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Suggested channels to follow */}
        <section className="py-2">
          <h3 className="text-[14.5px] font-bold text-[#667781] px-4 mb-2.5">
            Find channels to follow
          </h3>

          <div className="flex flex-col">
            {findChannels.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveSuggestedChannel(item)}
                className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Channel logo */}
                  <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center ${item.logoBg} shrink-0 overflow-hidden text-center p-1.5`}>
                    {item.logoText ? (
                      <span className="text-[7.5px] font-bold leading-[9px] uppercase tracking-tighter text-white">{item.logoText}</span>
                    ) : (
                      <span className="material-symbols-outlined text-[20px] text-white">{item.logoIcon}</span>
                    )}
                  </div>

                  {/* Channel description */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-[15px] font-bold text-[#1c2e35]">{item.name}</span>
                      {item.verified && (
                        <span className="material-symbols-outlined text-[16px] text-blue-500 fill">verified</span>
                      )}
                    </div>
                    <span className="text-[13px] text-[#667781] font-normal">{item.followers}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleFollow(item.id)}
                    className={`text-[13.5px] font-bold rounded-full px-4 py-1.5 transition-all duration-150 cursor-pointer ${
                      following[item.id]
                        ? "border border-zinc-200 text-[#54656f] bg-transparent"
                        : "bg-[#e6f5ef] text-[#0f8b5d] hover:bg-[#def0e9]"
                    }`}
                  >
                    {following[item.id] ? "Following" : "Follow"}
                  </button>
                  <button className="text-[#667781] hover:text-zinc-800 p-1">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 right-4 flex flex-col gap-3.5 z-40 items-center">
        {/* Edit status (Pencil) Button */}
        <button
          aria-label="Edit Status"
          className="w-11 h-11 bg-[#f0f2f5] text-[#54656f] rounded-full shadow-md flex items-center justify-center border border-zinc-150 active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>

        {/* Camera/Photo Button */}
        <button
          aria-label="Camera"
          className="w-[54px] h-[54px] bg-[#00a884] text-white rounded-[16px] shadow-lg flex items-center justify-center hover:bg-[#008f70] transition-colors duration-150 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">photo_camera</span>
        </button>
      </div>

      {/* Bottom NavBar */}
      <Navigation activeTab="updates" />
    </div>
  );
}
