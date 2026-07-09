"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";

export default function CallsPage() {
  const [showDialer, setShowDialer] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showSelectContact, setShowSelectContact] = useState(false);
  const [showAddFavourite, setShowAddFavourite] = useState(false);
  
  const [dialedNumber, setDialedNumber] = useState("");
  const [searchContactQuery, setSearchContactQuery] = useState("");
  const [searchFavouriteQuery, setSearchFavouriteQuery] = useState("");
  
  const [selectedContacts, setSelectedContacts] = useState({});
  const [selectedFavourites, setSelectedFavourites] = useState({});

  // Schedule state fields
  const [callTitle, setCallTitle] = useState("Chirag 🍻's call");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("25 Jun 2026");
  const [startTime, setStartTime] = useState("13:30");
  const [endDate, setEndDate] = useState("25 Jun 2026");
  const [endTime, setEndTime] = useState("14:00");
  const [showEndTime, setShowEndTime] = useState(true);
  const [callType, setCallType] = useState("Video");
  const [requireApproval, setRequireApproval] = useState(false);
  const [reminder, setReminder] = useState("15 minutes before");

  const actions = [
    { label: "Call", icon: "call", onClick: () => setShowSelectContact(true) },
    { label: "Schedule", icon: "calendar_today", onClick: () => setShowSchedule(true) },
    { label: "Keypad", icon: "dialpad", onClick: () => setShowDialer(true) },
    { label: "Favorites", icon: "favorite", onClick: () => setShowAddFavourite(true) },
  ];

  const callsList = [
    {
      id: 1,
      name: "+91 90590 55803 (3)",
      subtitle: "~ Rayan | MOCARD",
      time: "Yesterday, 17:30",
      incoming: true,
      missed: false,
      avatarBg: "bg-zinc-900 text-white",
      avatarText: "Rayan",
    },
    {
      id: 2,
      name: "+91 90590 55803",
      subtitle: "~ Rayan | MOCARD",
      time: "23 June, 19:37",
      incoming: true,
      missed: true,
      avatarBg: "bg-zinc-900 text-white",
      avatarText: "Rayan",
    },
    {
      id: 3,
      name: "Sheetal Ma'am Appzeto",
      subtitle: "",
      time: "23 June, 14:54",
      incoming: true,
      missed: false,
      avatarBg: "bg-orange-100 text-orange-700",
      avatarText: "S",
    },
    {
      id: 4,
      name: "MAMMA (2)",
      subtitle: "",
      time: "23 June, 07:44",
      incoming: true,
      missed: true,
      avatarBg: "bg-blue-100 text-blue-700",
      avatarText: "M",
    },
    {
      id: 5,
      name: "+91 90590 55803 (5)",
      subtitle: "~ Rayan | MOCARD",
      time: "22 June, 18:49",
      incoming: false,
      missed: false,
      avatarBg: "bg-zinc-900 text-white",
      avatarText: "Rayan",
    },
    {
      id: 6,
      name: "+91 90590 55803",
      subtitle: "~ Rayan | MOCARD",
      time: "22 June, 18:07",
      incoming: true,
      missed: true,
      avatarBg: "bg-zinc-900 text-white",
      avatarText: "Rayan",
    },
    {
      id: 7,
      name: "Ravi Appzeto",
      subtitle: "~ Ravi Appzeto",
      time: "22 June, 15:04",
      incoming: false,
      missed: false,
      avatarBg: "bg-teal-50 text-teal-600 font-bold border border-teal-100",
      avatarText: "Appzeto",
    },
    {
      id: 8,
      name: "Ravi Appzeto",
      subtitle: "~ Ravi Appzeto",
      time: "22 June, 15:04",
      incoming: true,
      missed: true,
      avatarBg: "bg-teal-50 text-teal-600 font-bold border border-teal-100",
      avatarText: "Appzeto",
    },
  ];

  const keypadButtons = [
    { num: "1", sub: "" },
    { num: "2", sub: "A B C" },
    { num: "3", sub: "D E F" },
    { num: "4", sub: "G H I" },
    { num: "5", sub: "J K L" },
    { num: "6", sub: "M N O" },
    { num: "7", sub: "P Q R S" },
    { num: "8", sub: "T U V" },
    { num: "9", sub: "W X Y Z" },
    { num: "*", sub: "" },
    { num: "0", sub: "+" },
    { num: "#", sub: "" },
  ];

  const frequentlyContacted = [
    {
      id: "sheetal",
      name: "Sheetal Ma'am Appzeto",
      subtext: "😇",
      avatarBg: "bg-orange-100 text-orange-700",
      avatarText: "S",
    },
    {
      id: "kittu",
      name: "Kittu",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD209t6Zin8k_HGjBSvGIRB_KONmSIL8sbz2S-MQFb6yxRje3Ge3PGp-yyOH_yZg4mCb_u8FkyApwL2yhfjFnLSiwHkH3lawFQHkpZmSRXx5D7BGsdZYSdvP6PhIeM3t9PjrvbV02NUdZMoHPGEZ-ZwJRlrv8enxQjqxirmtclZn9U_UQz7m55E9_VQNGreM6hRVv44INUgYZ7PQRf4Oct93w5plsG6f9LeRAuAOZt_QSgliP9AOs46NF7TylHhikGVRGfXyCWVFLo",
    },
    {
      id: "shivam",
      name: "Shivam Lovevanshi Tester Appzeto",
      subtext: "Shivam..",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&fit=crop&q=80",
    },
    {
      id: "shubham",
      name: "shubham jamliya Appzeto",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&fit=crop&q=80",
    },
    {
      id: "furqan",
      name: "Furqan Appzeto",
      subtext: "Alhamdulillah\uD83E\uDD0D",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80",
    },
  ];

  const frequentlyContactedFavourites = [
    {
      id: "sheetal",
      name: "Sheetal Ma'am Appzeto",
      avatarBg: "bg-orange-100 text-orange-700",
      avatarText: "S",
    },
    {
      id: "ankit-team",
      name: "Appzeto team Ankit ✨",
      subtext: "Amit, Furqan Appzeto, Priyank Appzeto, Raunak...",
      avatarBg: "bg-[#e6f5ef] text-[#0f8b5d]",
      avatarIcon: "groups",
    },
    {
      id: "driveon",
      name: "Driveon ( Zoom Car , Shubham Gupta , Ah...",
      subtext: "Ajay, chhan chhan, Hritik, Raj Sir Project Manage...",
      avatarBg: "bg-[#e6f5ef] text-[#0f8b5d]",
      avatarIcon: "groups",
    },
  ];

  const contactsOnZetto = [
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
      name: "+919510591925",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop&q=80",
    },
    {
      id: "c4",
      name: "~Mahi Tanpure Sage",
      avatarBg: "bg-purple-100 text-purple-700",
      avatarIcon: "person",
    },
  ];

  const contactsOnZettoFavourites = [
    ...contactsOnZetto,
    {
      id: "c5",
      name: "1111",
      avatarBg: "bg-emerald-100 text-emerald-700",
      avatarIcon: "person",
    },
    {
      id: "c6",
      name: "Aakash Sage",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&q=80",
    },
    {
      id: "c7",
      name: "Aashay",
      avatarBg: "bg-blue-100 text-blue-700",
      avatarText: "A",
    },
    {
      id: "c8",
      name: "Aashutosh Malviya Sage",
      avatarBg: "bg-orange-100 text-orange-700",
      avatarText: "AM",
    },
    {
      id: "c9",
      name: "Aayushi Sage",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80",
    },
  ];

  const handleKeyPress = (num) => {
    setDialedNumber((prev) => prev + num);
  };

  const handleBackspace = () => {
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setDialedNumber("");
  };

  const toggleSelectContact = (id) => {
    setSelectedContacts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSelectFavourite = (id) => {
    setSelectedFavourites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 1. RENDER KEYPAD / DIALER SCREEN
  if (showDialer) {
    return (
      <div className="w-full bg-white text-[#1c2e35] antialiased min-h-screen flex flex-col font-sans select-none relative">
        <header className="px-4 py-4 flex items-center">
          <button
            onClick={() => {
              setShowDialer(false);
              setDialedNumber("");
            }}
            aria-label="Back"
            className="p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
        </header>

        <div className="flex-1 flex flex-col justify-end items-center px-6 pb-6 min-h-[140px] relative">
          <div className="text-center w-full flex items-center justify-center gap-4">
            <span className="text-[34px] font-normal text-[#1c2e35] tracking-wide select-text truncate max-w-[80%] block h-[48px] leading-none">
              {dialedNumber}
            </span>
            {dialedNumber && (
              <button
                onClick={handleBackspace}
                onDoubleClick={handleClear}
                aria-label="Backspace"
                className="p-2 text-[#667781] hover:bg-zinc-100 active:scale-95 rounded-full shrink-0"
              >
                <span className="material-symbols-outlined text-[24px]">backspace</span>
              </button>
            )}
          </div>
        </div>

        <div className="w-full max-w-[340px] mx-auto px-4 pb-8 flex flex-col items-center">
          <div className="grid grid-cols-3 gap-y-4 gap-x-6 w-full justify-items-center mb-6">
            {keypadButtons.map((btn) => (
              <button
                key={btn.num}
                onClick={() => handleKeyPress(btn.num)}
                className="w-[74px] h-[74px] bg-[#f0f2f5] hover:bg-zinc-200 active:bg-zinc-300 rounded-full flex flex-col items-center justify-center transition-colors duration-100 cursor-pointer"
              >
                <span className="text-[28px] font-medium text-[#1c2e35] leading-none">
                  {btn.num}
                </span>
                {btn.sub && (
                  <span className="text-[9.5px] font-bold text-[#8696a0] tracking-wider mt-0.5 leading-none uppercase">
                    {btn.sub}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="w-full flex justify-center mb-8">
            <button
              aria-label="Call dialed number"
              className="w-[74px] h-[74px] bg-[#00a884] hover:bg-[#008f70] text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[30px] fill">call</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. RENDER SCHEDULE CALL SCREEN
  if (showSchedule) {
    return (
      <div className="w-full bg-white text-[#1c2e35] antialiased min-h-screen flex flex-col font-sans select-none relative">
        <header className="px-4 py-4 flex items-center sticky top-0 bg-white z-40">
          <button
            onClick={() => setShowSchedule(false)}
            aria-label="Back"
            className="p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <span className="text-[19px] font-semibold text-[#1c2e35] ml-4 tracking-wide">
            Schedule call
          </span>
        </header>

        <main className="flex-1 w-full max-w-md mx-auto px-6 py-2 space-y-7">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-none pb-1 relative">
              <input
                type="text"
                value={callTitle}
                onChange={(e) => setCallTitle(e.target.value)}
                placeholder="Call title"
                className="w-full text-[20px] font-bold text-[#1c2e35] focus:outline-none placeholder-zinc-300 pr-8"
              />
              {callTitle && (
                <button
                  onClick={() => setCallTitle("")}
                  className="absolute right-0 text-zinc-400 p-1 rounded-full hover:bg-zinc-50 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </div>
            <div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (Optional)"
                className="w-full text-[15px] font-normal text-[#1c2e35] focus:outline-none placeholder-[#667781]"
              />
            </div>
          </div>

          <hr className="border-t border-zinc-100" />

          <div className="relative pl-1">
            {showEndTime && (
              <div className="absolute left-[13px] top-[28px] bottom-[28px] w-[2px] border-l-2 border-dashed border-[#8696a0]/60"></div>
            )}

            <div className="flex items-center justify-between py-3 relative z-10">
              <div className="flex items-center gap-6">
                <span className="material-symbols-outlined text-[#667781] text-[23px] bg-white">calendar_today</span>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-[15.5px] font-normal text-[#1c2e35] w-28 bg-transparent focus:outline-none"
                />
              </div>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="text-[15.5px] font-normal text-[#1c2e35] w-12 bg-transparent text-right focus:outline-none"
              />
            </div>

            {showEndTime && (
              <div className="flex items-center justify-between py-3 relative z-10">
                <div className="flex items-center gap-6">
                  <span className="material-symbols-outlined text-[#667781] text-[23px] bg-white">calendar_today</span>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-[15.5px] font-normal text-[#1c2e35] w-28 bg-transparent focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="text-[15.5px] font-normal text-[#1c2e35] w-12 bg-transparent text-right focus:outline-none"
                />
              </div>
            )}
          </div>

          <div className="pl-[47px] py-1">
            <button
              onClick={() => setShowEndTime(!showEndTime)}
              className="text-[15px] font-medium text-[#1c2e35] hover:underline"
            >
              {showEndTime ? "Remove end time" : "Add end time"}
            </button>
          </div>

          <div className="flex items-start gap-6 py-2 cursor-pointer" onClick={() => setCallType(callType === "Video" ? "Voice" : "Video")}>
            <span className="material-symbols-outlined text-[#667781] text-[24px] mt-0.5">videocam</span>
            <div className="flex flex-col">
              <span className="text-[15.5px] font-bold text-[#1c2e35]">Call type</span>
              <span className="text-[13.5px] text-[#667781] mt-0.5">{callType}</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-start gap-6">
              <span className="material-symbols-outlined text-[#667781] text-[24px] mt-0.5">person_add_disabled</span>
              <div className="flex flex-col">
                <span className="text-[15.5px] font-bold text-[#1c2e35]">Require approval to join</span>
              </div>
            </div>
            <button
              onClick={() => setRequireApproval(!requireApproval)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none relative flex items-center px-[2px] ${
                requireApproval ? "bg-[#00a884]" : "bg-zinc-300"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  requireApproval ? "translate-x-5" : "translate-x-0"
                }`}
              ></span>
            </button>
          </div>

          <hr className="border-t border-zinc-100" />

          <div className="flex items-start gap-6 py-2">
            <span className="material-symbols-outlined text-[#667781] text-[23px] mt-0.5">notifications</span>
            <div className="flex flex-col">
              <span className="text-[15.5px] font-bold text-[#1c2e35]">Reminder</span>
              <span className="text-[13.5px] text-[#667781] mt-0.5">{reminder}</span>
            </div>
          </div>
        </main>

        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowSchedule(false)}
            aria-label="Submit schedule"
            className="w-[54px] h-[54px] bg-[#00a884] hover:bg-[#008f70] text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px] rotate-[-25deg] translate-x-[2px] translate-y-[-1px] font-bold">send</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. RENDER SELECT CONTACT SCREEN (CALL BUTTON TRIGGER)
  if (showSelectContact) {
    return (
      <div className="w-full bg-white text-[#1c2e35] antialiased min-h-screen flex flex-col font-sans select-none relative">
        <header className="px-4 py-2 sticky top-0 bg-white z-40">
          <div className="w-full bg-[#f0f2f5] rounded-full flex items-center px-4 py-2 gap-3 shadow-none">
            <button
              onClick={() => {
                setShowSelectContact(false);
                setSearchContactQuery("");
              }}
              aria-label="Back"
              className="p-1 hover:bg-zinc-200 rounded-full active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[23px] text-[#1c2e35]">arrow_back</span>
            </button>
            <input
              type="text"
              placeholder="Search name or number..."
              value={searchContactQuery}
              onChange={(e) => setSearchContactQuery(e.target.value)}
              className="flex-1 bg-transparent text-[15px] font-normal text-[#1c2e35] focus:outline-none placeholder-zinc-500"
            />
            <button
              onClick={() => {
                setShowSelectContact(false);
                setShowDialer(true);
              }}
              className="p-1 hover:bg-zinc-200 rounded-full active:scale-95"
            >
              <span className="material-symbols-outlined text-[22px] text-[#1c2e35]">dialpad</span>
            </button>
          </div>
          <span className="text-[13px] text-[#667781] font-medium text-center block w-full mt-2.5">
            Add up to 31 people
          </span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <div className="flex items-center py-3.5 cursor-pointer hover:bg-zinc-50 active:bg-zinc-100 transition-colors rounded-lg">
            <div className="w-[44px] h-[44px] rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0 mr-4">
              <span className="material-symbols-outlined text-[22px] fill">link</span>
            </div>
            <span className="text-[15.5px] font-bold text-[#1c2e35]">New call link</span>
          </div>

          <div className="flex items-center justify-between py-3.5 cursor-pointer hover:bg-zinc-50 active:bg-zinc-100 transition-colors rounded-lg">
            <div className="flex items-center">
              <div className="w-[44px] h-[44px] rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0 mr-4">
                <span className="material-symbols-outlined text-[22px]">person_add</span>
              </div>
              <span className="text-[15.5px] font-bold text-[#1c2e35]">New contact</span>
            </div>
            <span className="material-symbols-outlined text-[22px] text-[#667781] mr-1">qr_code_2</span>
          </div>

          <div className="text-[13.5px] font-bold text-[#667781] pt-4 pb-2">
            Frequently contacted
          </div>
          <div className="flex flex-col">
            {frequentlyContacted.map((c) => (
              <div
                key={c.id}
                onClick={() => toggleSelectContact(c.id)}
                className="flex items-center justify-between py-3 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {c.avatar ? (
                    <img className="w-[44px] h-[44px] rounded-full object-cover border border-zinc-100 shrink-0" src={c.avatar} alt={c.name} />
                  ) : (
                    <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center ${c.avatarBg} shrink-0 text-sm font-bold`}>
                      {c.avatarText}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[15.5px] font-bold text-[#1c2e35] truncate">{c.name}</span>
                    {c.subtext && <span className="text-[13px] text-[#667781] truncate mt-0.5">{c.subtext}</span>}
                  </div>
                </div>
                <div className="shrink-0 mr-1">
                  <span className={`material-symbols-outlined text-[24px] ${selectedContacts[c.id] ? "text-[#00a884] fill" : "text-zinc-300"}`}>
                    {selectedContacts[c.id] ? "check_circle" : "radio_button_unchecked"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[13.5px] font-bold text-[#667781] pt-4 pb-2">
            Contacts on Zetto
          </div>
          <div className="flex flex-col pb-10">
            {contactsOnZetto.map((c) => (
              <div
                key={c.id}
                onClick={() => toggleSelectContact(c.id)}
                className="flex items-center justify-between py-3 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {c.avatar ? (
                    <img className="w-[44px] h-[44px] rounded-full object-cover border border-zinc-100 shrink-0" src={c.avatar} alt={c.name} />
                  ) : (
                    <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center ${c.avatarBg} shrink-0 text-[#54656f]`}>
                      <span className="material-symbols-outlined text-[20px] fill opacity-80">{c.avatarIcon}</span>
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[15.5px] font-bold text-[#1c2e35] truncate">{c.name}</span>
                  </div>
                </div>
                <div className="shrink-0 mr-1">
                  <span className={`material-symbols-outlined text-[24px] ${selectedContacts[c.id] ? "text-[#00a884] fill" : "text-zinc-300"}`}>
                    {selectedContacts[c.id] ? "check_circle" : "radio_button_unchecked"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // 4. RENDER ADD FAVOURITE SCREEN (FAVORITE BUTTON TRIGGER)
  if (showAddFavourite) {
    return (
      <div className="w-full bg-white text-[#1c2e35] antialiased min-h-screen flex flex-col font-sans select-none relative">
        {/* Header */}
        <header className="px-4 py-3.5 flex justify-between items-center sticky top-0 bg-white z-40 border-b border-zinc-50">
          <div className="flex items-center">
            <button
              onClick={() => {
                setShowAddFavourite(false);
                setSearchFavouriteQuery("");
              }}
              aria-label="Back"
              className="p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <span className="text-[19px] font-semibold text-[#1c2e35] ml-4 tracking-wide">
              Add favourite
            </span>
          </div>
          <button aria-label="Search" className="p-1.5 hover:bg-zinc-100 rounded-full active:scale-95 text-[#54656f]">
            <span className="material-symbols-outlined text-[24px]">search</span>
          </button>
        </header>

        {/* Content list */}
        <main className="flex-grow overflow-y-auto px-4 py-2 space-y-1">
          {/* Section: Frequently Contacted */}
          <div className="text-[13.5px] font-bold text-[#667781] pt-2 pb-2">
            Frequently contacted
          </div>
          <div className="flex flex-col">
            {frequentlyContactedFavourites.map((c) => (
              <div
                key={c.id}
                onClick={() => toggleSelectFavourite(c.id)}
                className="flex items-center justify-between py-3 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {c.avatar ? (
                    <img className="w-[44px] h-[44px] rounded-full object-cover border border-zinc-100 shrink-0" src={c.avatar} alt={c.name} />
                  ) : (
                    <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center ${c.avatarBg} shrink-0 text-sm font-bold`}>
                      {c.avatarIcon ? (
                        <span className="material-symbols-outlined text-[22px] fill opacity-80">{c.avatarIcon}</span>
                      ) : (
                        <span>{c.avatarText}</span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[15.5px] font-bold text-[#1c2e35] truncate">{c.name}</span>
                    {c.subtext && <span className="text-[13px] text-[#667781] truncate mt-0.5">{c.subtext}</span>}
                  </div>
                </div>
                {/* Visual select state check icon (on right) */}
                {selectedFavourites[c.id] && (
                  <span className="material-symbols-outlined text-[24px] text-[#00a884] font-bold mr-1">check</span>
                )}
              </div>
            ))}
          </div>

          {/* Section: Contacts on Zetto */}
          <div className="text-[13.5px] font-bold text-[#667781] pt-4 pb-2">
            Contacts on Zetto
          </div>
          <div className="flex flex-col pb-20">
            {contactsOnZettoFavourites.map((c) => (
              <div
                key={c.id}
                onClick={() => toggleSelectFavourite(c.id)}
                className="flex items-center justify-between py-3 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {c.avatar ? (
                    <img className="w-[44px] h-[44px] rounded-full object-cover border border-zinc-100 shrink-0" src={c.avatar} alt={c.name} />
                  ) : (
                    <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center ${c.avatarBg} shrink-0 text-sm font-bold text-[#54656f]`}>
                      {c.avatarIcon ? (
                        <span className="material-symbols-outlined text-[20px] fill opacity-80">{c.avatarIcon}</span>
                      ) : (
                        <span className="text-sm font-bold text-blue-700">{c.avatarText}</span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[15.5px] font-bold text-[#1c2e35] truncate">{c.name}</span>
                  </div>
                </div>
                {/* Visual select check icon */}
                {selectedFavourites[c.id] && (
                  <span className="material-symbols-outlined text-[24px] text-[#00a884] font-bold mr-1">check</span>
                )}
              </div>
            ))}
          </div>
        </main>

        {/* Submit Done Green FAB */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => {
              setShowAddFavourite(false);
              setSelectedFavourites({});
            }}
            aria-label="Confirm Favorites"
            className="w-[54px] h-[54px] bg-[#00a884] hover:bg-[#008f70] text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px] font-bold">check</span>
          </button>
        </div>
      </div>
    );
  }

  // 5. MAIN CALLS LOG LIST SCREEN
  return (
    <div className="w-full bg-white text-[#1c2e35] antialiased min-h-screen flex flex-col pb-24 font-sans select-none">
      {/* Top Header */}
      <header className="sticky top-0 bg-white z-40 px-4 py-3.5 flex justify-between items-center">
        <h1 className="text-[22px] font-bold text-[#1c2e35] font-sans">Calls</h1>
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
        {/* Quick Actions Row */}
        <section className="px-4 py-3.5 grid grid-cols-4 gap-2">
          {actions.map((act) => (
            <div key={act.label} onClick={act.onClick} className="flex flex-col items-center cursor-pointer group">
              <div className="w-14 h-14 bg-[#f0f2f5] text-[#1c2e35] rounded-full flex items-center justify-center transition-all group-active:scale-95 hover:bg-zinc-200">
                <span className="material-symbols-outlined text-[23px]">{act.icon}</span>
              </div>
              <span className="text-[12.5px] font-semibold text-[#54656f] mt-2 text-center truncate w-full">
                {act.label}
              </span>
            </div>
          ))}
        </section>

        {/* Recent Section Heading */}
        <section className="px-4 py-2">
          <h2 className="text-[16px] font-bold text-[#1c2e35] tracking-wide">Recent</h2>
        </section>

        {/* Calls List */}
        <section className="flex flex-col">
          {callsList.map((call) => (
            <div
              key={call.id}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Avatar */}
                <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 ${call.avatarBg} overflow-hidden`}>
                  {call.avatarText === "Appzeto" ? (
                    <div className="flex flex-col items-center justify-center text-center p-1">
                      <span className="text-[7.5px] font-black uppercase tracking-tighter leading-none">Appzeto</span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold">{call.avatarText}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className={`text-[15.5px] font-bold truncate max-w-[85%] ${call.missed ? "text-[#ea0038]" : "text-[#1c2e35]"}`}>
                    {call.name}
                  </span>
                  
                  {call.subtitle && (
                    <span className="text-[13px] text-[#667781] font-normal truncate mt-0.5">
                      {call.subtitle}
                    </span>
                  )}

                  <div className="flex items-center gap-1 text-[#667781] text-[13px] font-normal mt-0.5">
                    {call.incoming ? (
                      <span className={`material-symbols-outlined text-[17px] ${call.missed ? "text-[#ea0038]" : "text-[#00a884]"} font-bold`}>
                        call_received
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[17px] text-[#00a884] font-bold">
                        call_made
                      </span>
                    )}
                    <span className="truncate">{call.time}</span>
                  </div>
                </div>
              </div>

              {/* Call Icon Button on Right */}
              <button className="p-2 text-[#54656f] hover:bg-zinc-100 rounded-full transition-colors active:scale-95 shrink-0 ml-2">
                <span className="material-symbols-outlined text-[23px]">call</span>
              </button>
            </div>
          ))}
          {/* Natural scroll spacers */}
          <div className="h-10"></div>
        </section>
      </main>

      {/* Floating Action Button */}
      <div className="absolute bottom-24 right-4 z-40">
        <button
          onClick={() => setShowSelectContact(true)}
          aria-label="New Call"
          className="w-[54px] h-[54px] bg-[#00a884] text-white rounded-[16px] shadow-lg flex items-center justify-center hover:bg-[#008f70] transition-colors duration-150 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">add_call</span>
        </button>
      </div>

    </div>
  );
}
