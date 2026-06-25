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

  useEffect(() => {
    setMessages(activeChat.messages);
  }, [id]);

  const [inputText, setInputText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

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
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  const handleInput = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div className="bg-[#efeae2] text-[#1c2e35] h-screen flex flex-col font-sans overflow-hidden select-none">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 flex justify-between items-center h-[60px] px-2.5 shrink-0 border-b border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-1.5 overflow-hidden max-w-[75%]">
          <button
            onClick={() => router.push("/chats")}
            className="text-[#54656f] p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform shrink-0"
          >
            <span className="material-symbols-outlined text-[23px] font-bold">arrow_back</span>
          </button>
          
          <div 
            onClick={() => router.push(`/chats/${id}/profile`)}
            className="flex items-center gap-2 cursor-pointer active:opacity-90 overflow-hidden"
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
              <span className="text-[15px] font-bold text-[#1c2e35] truncate max-w-[180px]">
                {activeChat?.name}
              </span>
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
                    <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); }}>New group</li>
                    <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); router.push(`/chats/${id}/profile`); }}>View contact</li>
                    <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); }}>Search</li>
                    <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); router.push(`/chats/${id}/profile`); }}>Media, links, and docs</li>
                    <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); }}>Mute notifications</li>
                    <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); }}>Disappearing messages</li>
                    <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); }}>Chat theme</li>
                    <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors flex justify-between items-center" onClick={(e) => { e.stopPropagation(); setShowSubMenu(true); }}>
                      <span>More</span>
                      <span className="material-symbols-outlined text-[20px] text-zinc-400">chevron_right</span>
                    </li>
                  </ul>
                ) : (
                  <ul className="flex flex-col animate-in slide-in-from-right-5 duration-150">
                    <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); setShowSubMenu(false); }}>Report</li>
                    <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); setShowSubMenu(false); }}>Block</li>
                    <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); setShowSubMenu(false); }}>Clear chat</li>
                    <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); setShowSubMenu(false); }}>Export chat</li>
                    <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); setShowSubMenu(false); }}>Add shortcut</li>
                    <li className="px-4 py-2.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer transition-colors" onClick={() => { setShowMenu(false); setShowSubMenu(false); }}>Add to list</li>
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Messages Canvas */}
      <div className="flex-1 overflow-hidden relative chat-bg bg-cover bg-center">
        {/* Scrollable Container */}
        <main className="absolute inset-0 overflow-y-auto px-3.5 py-4 pb-6 space-y-3.5 no-scrollbar">
          {messages.map((msg) => {
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
                className={`flex flex-col w-full relative ${isOutgoing ? "items-end" : "items-start"}`}
              >
                {/* Message Bubble Wrapper to contain Share button */}
                <div className="relative flex items-center max-w-[85%] md:max-w-[70%]">
                  
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
                        ? "bg-[#d9fdd3] text-[#111b21] rounded-tr-[2px]"
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
                    {!isOutgoing && msg.image && (
                      <div className="relative rounded-[8px] overflow-hidden mb-1.5 border border-zinc-100 max-w-[280px]">
                        <img className="w-full h-auto object-cover max-h-[180px] filter blur-[1.5px] brightness-90" src={msg.image} alt="Attached image" />
                        {/* Download size overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button className="bg-black/55 text-white text-[12px] font-semibold px-3 py-2 rounded-full flex items-center gap-1.5 hover:bg-black/75 transition-all">
                            <span className="material-symbols-outlined text-[17px] font-bold">download</span>
                            <span>{msg.imageSize}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Message content */}
                    {msg.isTagsOnly ? (
                      <p className="text-[14.2px] font-semibold text-[#008069] break-words leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    ) : (
                      <p className="text-[14.2px] font-normal break-words leading-relaxed whitespace-pre-wrap pr-10">
                        {msg.text}
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

      {/* Input Bottom Bar */}
      <div className="bg-[#efeae2] px-2 py-1.5 shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-1.5 max-w-3xl mx-auto w-full">
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
              className="p-1 text-[#54656f] hover:bg-zinc-50 rounded-full active:scale-95 shrink-0 rotate-[-45deg]"
            >
              <span className="material-symbols-outlined text-[23px]">attach_file</span>
            </button>

            {/* Rupee Payment */}
            <button
              type="button"
              className="p-1 text-[#54656f] hover:bg-zinc-50 rounded-full active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-[23px]">currency_rupee</span>
            </button>

            {/* Camera Trigger */}
            <button
              type="button"
              className="p-1 text-[#54656f] hover:bg-zinc-50 rounded-full active:scale-95 shrink-0 mr-1"
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
      </div>
    </div>
  );
}
