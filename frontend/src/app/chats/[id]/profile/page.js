"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactProfilePage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const id = params.id;

  const [chatLock, setChatLock] = useState(false);
  const [translateMsg, setTranslateMsg] = useState(false);

  const handleBack = () => {
    router.push(`/chats/${id}`);
  };

  const handleMediaClick = () => {
    router.push(`/chats/${id}/media`);
  };

  // Determine if it is a Group or Individual
  const isGroup = !(id === "kittu" || id === "chirag" || id === "c1" || id === "c2" || id === "c3" || id === "c4" || id === "c5");

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
    <div className="bg-[#f7f8fa] text-[#1c2e35] min-h-screen flex flex-col items-center font-sans antialiased">
      {/* Mobile Shell Container */}
      <main className="w-full max-w-md bg-white flex flex-col relative shadow-2xl min-h-screen pb-16">
        
        {/* Sticky Header */}
        <header className="sticky top-0 bg-white z-40 flex justify-between items-center h-[56px] px-3 border-b border-zinc-100/80">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              aria-label="Back"
              className="w-9 h-9 flex items-center justify-center text-[#1c2e35] active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-[#54656f]">
            {isGroup && (
              <button className="p-1 hover:bg-zinc-100 rounded-full cursor-pointer">
                <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
              </button>
            )}
            <button className="p-1 hover:bg-zinc-100 rounded-full cursor-pointer">
              <span className="material-symbols-outlined text-[22px]">more_vert</span>
            </button>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pb-safe">
          
          {/* Hero Header Card */}
          <div className="bg-white px-4 pt-6 pb-4 flex flex-col items-center border-b border-zinc-100">
            {isGroup ? (
              <>
                {/* Cleanzo Big Logo */}
                <div className="w-[110px] h-[110px] rounded-full bg-[#f4fbfc] border border-blue-100 flex flex-col items-center justify-center relative overflow-hidden shadow-sm mb-4">
                  <span className="material-symbols-outlined text-[#00a884] text-[36px] absolute top-2 right-6">sparkles</span>
                  <span className="material-symbols-outlined text-[#0b805c] text-[48px] fill">local_car_wash</span>
                  <span className="text-[12px] font-black uppercase text-[#0b805c] tracking-widest mt-1">Cleanzo</span>
                </div>

                {/* Group Name & Members */}
                <h1 className="text-[20px] font-bold text-[#1c2e35] text-center leading-tight tracking-wide px-2 max-w-[320px]">
                  Cleanzo Android+iOS mobile Application development
                </h1>
                <p className="text-[13px] text-zinc-500 mt-1 font-medium">
                  Group <span className="text-[#0b805c] font-semibold">· 13 members</span>
                </p>

                {/* Custom Description */}
                <div className="text-center mt-3 bg-zinc-50 rounded-xl px-4 py-2.5 max-w-[320px] border border-zinc-100/50">
                  <p className="text-[13.5px] font-bold text-zinc-700 leading-none">Custom</p>
                  <p className="text-[13px] text-zinc-500 mt-1 leading-normal">Daily Exterior car cleaning Services</p>
                </div>
              </>
            ) : (
              <>
                {/* Kittu Big Avatar */}
                <div className="w-[115px] h-[115px] rounded-full overflow-hidden border-2 border-zinc-100 shadow-sm mb-3">
                  <img 
                    alt="Kittu" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD209t6Zin8k_HGjBSvGIRB_KONmSIL8sbz2S-MQFb6yxRje3Ge3PGp-yyOH_yZg4mCb_u8FkyApwL2yhfjFnLSiwHkH3lawFQHkpZmSRXx5D7BGsdZYSdvP6PhIeM3t9PjrvbV02NUdZMoHPGEZ-ZwJRlrv8enxQjqxirmtclZn9U_UQz7m55E9_VQNGreM6hRVv44INUgYZ7PQRf4Oct93w5plsG6f9LeRAuAOZt_QSgliP9AOs46NF7TylHhikGVRGfXyCWVFLo" 
                  />
                </div>

                {/* Contact Name & Number */}
                <h1 className="text-[22px] font-bold text-[#1c2e35] text-center leading-none tracking-wide">
                  Kittu
                </h1>
                <p className="text-[14.5px] text-zinc-600 mt-2 font-medium">
                  +91 79993 54471
                </p>

                {/* Instagram Link */}
                <div className="flex items-center gap-1.5 mt-2.5 text-[13.5px] text-zinc-500 hover:text-[#0b805c] hover:underline cursor-pointer bg-zinc-50 px-3.5 py-1.5 rounded-full border border-zinc-100/50">
                  <span className="material-symbols-outlined text-[17px]">link</span>
                  <span className="font-medium">instagram.com/official_tj_music</span>
                </div>
              </>
            )}

            {/* Bento Quick Actions Grid */}
            <div className={`grid gap-3 w-full mt-6 px-1 ${isGroup ? "grid-cols-4" : "grid-cols-3"}`}>
              <button className="flex flex-col items-center justify-center gap-1.5 py-3.5 border border-zinc-200/80 rounded-2xl active:bg-zinc-50 cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[#0b805c] text-[22px]">call</span>
                <span className="text-[12.5px] font-bold text-zinc-700">Audio</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-1.5 py-3.5 border border-zinc-200/80 rounded-2xl active:bg-zinc-50 cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[#0b805c] text-[22px]">videocam</span>
                <span className="text-[12.5px] font-bold text-zinc-700">Video</span>
              </button>
              
              {isGroup && (
                <button className="flex flex-col items-center justify-center gap-1.5 py-3.5 border border-zinc-200/80 rounded-2xl active:bg-zinc-50 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-[#0b805c] text-[22px]">person_add</span>
                  <span className="text-[12.5px] font-bold text-zinc-700">Add</span>
                </button>
              )}

              <button className="flex flex-col items-center justify-center gap-1.5 py-3.5 border border-zinc-200/80 rounded-2xl active:bg-zinc-50 cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[#0b805c] text-[22px]">search</span>
                <span className="text-[12.5px] font-bold text-zinc-700">Search</span>
              </button>
            </div>
          </div>

          {/* Media, links, and docs Section */}
          <div className="bg-white border-y border-zinc-100 mt-2.5 py-3.5">
            <div 
              onClick={handleMediaClick}
              className="flex justify-between items-center px-4 mb-3 cursor-pointer active:opacity-80"
            >
              <span className="text-[14.5px] font-bold text-[#1c2e35] tracking-wide">Media, links, and docs</span>
              <button 
                onClick={(e) => { e.stopPropagation(); handleMediaClick(); }}
                className="flex items-center text-zinc-500 font-bold text-[13px] hover:underline cursor-pointer"
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
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/50 cursor-pointer hover:opacity-90">
                    <img alt="Receipt" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=150&fit=crop&q=80" />
                  </div>
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/50 cursor-pointer hover:opacity-90">
                    <img alt="Cleanzo member" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&fit=crop&q=80" />
                  </div>
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/50 cursor-pointer hover:opacity-90">
                    <img alt="T-shirt back" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&fit=crop&q=80" />
                  </div>
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/50 cursor-pointer hover:opacity-90">
                    <img alt="Car wash" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=150&fit=crop&q=80" />
                  </div>
                </>
              ) : (
                <>
                  {/* Individual Media */}
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/50 relative flex items-center justify-center cursor-pointer hover:opacity-90">
                    <img alt="Thumbnail 1" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&fit=crop&q=80" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[28px] fill">play_circle</span>
                    </div>
                  </div>
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/50 cursor-pointer hover:opacity-90">
                    <img alt="Thumbnail 2" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&fit=crop&q=80" />
                  </div>
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/50 cursor-pointer hover:opacity-90">
                    <img alt="Thumbnail 3" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=150&fit=crop&q=80" />
                  </div>
                  <div onClick={handleMediaClick} className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/50 cursor-pointer hover:opacity-90">
                    <img alt="Thumbnail 4" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&fit=crop&q=80" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* List Options */}
          <div className="bg-white border-y border-zinc-100 mt-2.5 divide-y divide-zinc-100/60">
            {/* Manage storage */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer">
              <span className="material-symbols-outlined text-zinc-500 mr-4 text-[22px]">folder_open</span>
              <div className="flex-1">
                <span className="block text-[15px] font-semibold text-[#1c2e35]">Manage storage</span>
                <span className="block text-[12px] text-zinc-500">{isGroup ? "4.3 MB" : "1.2 GB"}</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer">
              <span className="material-symbols-outlined text-zinc-500 mr-4 text-[22px]">notifications</span>
              <div className="flex-1">
                <span className="block text-[15px] font-semibold text-[#1c2e35]">Notifications</span>
              </div>
            </div>

            {/* Media visibility */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer">
              <span className="material-symbols-outlined text-zinc-500 mr-4 text-[22px]">image</span>
              <div className="flex-1">
                <span className="block text-[15px] font-semibold text-[#1c2e35]">Media visibility</span>
              </div>
            </div>
          </div>

          {/* Options Group 2 */}
          <div className="bg-white border-y border-zinc-100 mt-2.5 divide-y divide-zinc-100/60">
            {/* Encryption */}
            <div className="flex items-start px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer">
              <span className="material-symbols-outlined text-zinc-500 mr-4 mt-0.5 text-[22px]">lock</span>
              <div className="flex-1">
                <span className="block text-[15px] font-semibold text-[#1c2e35]">Encryption</span>
                <span className="block text-[12.5px] text-zinc-500 leading-normal mt-0.5">
                  Messages and calls are end-to-end encrypted. {isGroup ? "Tap to learn more." : "Tap to verify."}
                </span>
              </div>
            </div>

            {/* Disappearing messages */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer">
              <span className="material-symbols-outlined text-zinc-500 mr-4 text-[22px]">pace</span>
              <div className="flex-1">
                <span className="block text-[15px] font-semibold text-[#1c2e35]">Disappearing messages</span>
                <span className="block text-[12px] text-zinc-500">Off</span>
              </div>
            </div>

            {/* Chat Lock toggle */}
            <div className="flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-zinc-500 mr-4 text-[22px]">lock_person</span>
                <div>
                  <span className="block text-[15px] font-semibold text-[#1c2e35]">Chat lock</span>
                  <span className="block text-[12px] text-zinc-500">Lock and hide this chat on this device.</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={chatLock} 
                  onChange={(e) => setChatLock(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-zinc-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a884]"></div>
              </label>
            </div>

            {/* Advanced privacy */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer">
              <span className="material-symbols-outlined text-zinc-500 mr-4 text-[22px]">shield</span>
              <div className="flex-1">
                <span className="block text-[15px] font-semibold text-[#1c2e35]">Advanced chat privacy</span>
                <span className="block text-[12.5px] text-zinc-500 mt-0.5">Off</span>
              </div>
            </div>

            {/* Translate messages toggle */}
            <div className="flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-zinc-500 mr-4 text-[22px]">translate</span>
                <div>
                  <span className="block text-[15px] font-semibold text-[#1c2e35]">Translate messages</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={translateMsg} 
                  onChange={(e) => setTranslateMsg(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-zinc-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a884]"></div>
              </label>
            </div>
          </div>

          {isGroup ? (
            <>
              {/* Group Creation Link */}
              <div className="bg-white border-y border-zinc-100 mt-2.5">
                <div className="flex items-center px-4 py-4 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mr-4">
                    <span className="material-symbols-outlined text-[22px]">groups</span>
                  </div>
                  <div className="flex-1">
                    <span className="block text-[15px] font-bold text-[#00a884]">Create a similar group</span>
                    <span className="block text-[12.5px] text-zinc-500 mt-0.5">
                      Start with the same members that you can add or remove.
                    </span>
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div className="bg-white border-y border-zinc-100 mt-2.5 pb-4">
                <div className="flex justify-between items-center px-4 py-3.5 border-b border-zinc-100/60">
                  <span className="text-[14.5px] font-bold text-zinc-700">13 members</span>
                  <button className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded-full cursor-pointer text-zinc-500">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </button>
                </div>

                {/* Quick Actions (Green Buttons) */}
                <div className="flex flex-col mt-1">
                  <div className="flex items-center px-4 py-3 hover:bg-zinc-50 cursor-pointer">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#00a884] text-white flex items-center justify-center mr-3.5 shrink-0">
                      <span className="material-symbols-outlined text-[22px]">person_add</span>
                    </div>
                    <span className="text-[15.5px] font-bold text-zinc-800">Add members</span>
                  </div>
                  <div className="flex items-center px-4 py-3 hover:bg-zinc-50 cursor-pointer">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#00a884] text-white flex items-center justify-center mr-3.5 shrink-0">
                      <span className="material-symbols-outlined text-[22px]">link</span>
                    </div>
                    <span className="text-[15.5px] font-bold text-zinc-800">Invite via link or QR code</span>
                  </div>
                  <div className="flex items-center px-4 py-3 hover:bg-zinc-50 cursor-pointer">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#00a884] text-white flex items-center justify-center mr-3.5 shrink-0">
                      <span className="material-symbols-outlined text-[22px]">person_pin</span>
                    </div>
                    <span className="text-[15.5px] font-bold text-zinc-800">Add members to contacts</span>
                  </div>
                </div>

                {/* Members Rows */}
                <div className="flex flex-col mt-2">
                  {members.map((member) => (
                    <div 
                      key={member.id}
                      className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer"
                    >
                      <div className="relative shrink-0 mr-3.5">
                        {member.avatar ? (
                          <div className="w-[44px] h-[44px] rounded-full overflow-hidden border border-zinc-100">
                            <img alt={member.name} className="w-full h-full object-cover" src={member.avatar} />
                          </div>
                        ) : (
                          <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center ${member.avatarBg || "bg-[#dfe5e7] text-[#54656f]"} font-semibold text-sm overflow-hidden`}>
                            {member.isCleanzo ? (
                              <div className="flex flex-col items-center justify-center text-center p-0.5 leading-none">
                                <span className="text-[6px] font-black uppercase text-emerald-600 leading-none">Cleanzo</span>
                                <span className="material-symbols-outlined text-[11px] text-emerald-500 fill leading-none mt-0.5">local_car_wash</span>
                              </div>
                            ) : (
                              <span>{member.avatarText}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div className="flex flex-col min-w-0">
                          <span className="text-[15px] font-bold text-[#1c2e35] truncate tracking-wide">
                            {member.name}
                          </span>
                          {member.subtext && (
                            <span className="text-[12px] text-zinc-500 truncate mt-0.5">
                              {member.subtext}
                            </span>
                          )}
                        </div>

                        {member.isAdmin && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-[4px] shrink-0 uppercase tracking-wide">
                            Group Admin
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  <button className="text-left px-4 py-2.5 text-[#00a884] font-bold text-[14.5px] hover:underline cursor-pointer">
                    View all (3 more)
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Groups in Common (Kittu / Individual) */}
              <div className="bg-white border-y border-zinc-100 mt-2.5 pb-2">
                <div className="px-4 py-3.5 border-b border-zinc-100/60">
                  <span className="text-[14px] font-bold text-zinc-500 tracking-wide">No groups in common</span>
                </div>
                <div className="flex flex-col mt-2">
                  <div className="flex items-center px-4 py-3 hover:bg-zinc-50 cursor-pointer">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#00a884] text-white flex items-center justify-center mr-3.5 shrink-0">
                      <span className="material-symbols-outlined text-[22px]">groups</span>
                    </div>
                    <span className="text-[15.5px] font-bold text-zinc-800">Create group with Kittu</span>
                  </div>
                  <div className="flex items-start px-4 py-3 hover:bg-zinc-50 cursor-pointer">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#00a884] text-white flex items-center justify-center mr-3.5 shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[22px]">group_add</span>
                    </div>
                    <div>
                      <span className="block text-[15.5px] font-bold text-zinc-800">Add to groups</span>
                      <span className="block text-[12.5px] text-zinc-500 mt-0.5">Add this contact to groups you're in.</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action List Section 3 */}
          <div className="bg-white border-y border-zinc-100 mt-2.5 divide-y divide-zinc-100/60">
            {isGroup && (
              <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer">
                <span className="material-symbols-outlined text-zinc-500 mr-4 text-[22px]">format_list_bulleted</span>
                <span className="text-[15px] font-bold text-zinc-700">View member changes</span>
              </div>
            )}

            {/* Add to Favourites */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer">
              <span className="material-symbols-outlined text-zinc-500 mr-4 text-[22px]">favorite_border</span>
              <span className="text-[15px] font-bold text-zinc-700">Add to Favourites</span>
            </div>

            {/* Add to list */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer">
              <span className="material-symbols-outlined text-zinc-500 mr-4 text-[22px]">label</span>
              <span className="text-[15px] font-bold text-zinc-700">Add to list</span>
            </div>

            {/* Clear chat */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer">
              <span className="material-symbols-outlined text-zinc-500 mr-4 text-[22px]">block</span>
              <span className="text-[15px] font-bold text-zinc-700">Clear chat</span>
            </div>

            {/* Block / Exit */}
            <div className="flex items-center px-4 py-3.5 hover:bg-red-50/50 active:bg-red-100/30 cursor-pointer text-red-500">
              <span className="material-symbols-outlined mr-4 text-[22px]">
                {isGroup ? "logout" : "block"}
              </span>
              <span className="text-[15px] font-bold">
                {isGroup ? "Exit group" : "Block Kittu"}
              </span>
            </div>

            {/* Report */}
            <div className="flex items-center px-4 py-3.5 hover:bg-red-50/50 active:bg-red-100/30 cursor-pointer text-red-500">
              <span className="material-symbols-outlined mr-4 text-[22px]">thumb_down</span>
              <span className="text-[15px] font-bold">
                {isGroup ? "Report group" : "Report Kittu"}
              </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
