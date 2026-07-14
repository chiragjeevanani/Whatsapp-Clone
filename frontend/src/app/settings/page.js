"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, updateProfile, uploadAvatar, deleteAvatar, deleteAccount } from "@/services/user/profile";
import { z } from "zod";

const SETTINGS_LIST = [
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

export default function SettingsPage() {
  const router = useRouter();
  const { logoutUser } = useAuth();

  const { isDarkMode, toggleTheme } = useTheme();

  // Sub-page navigation: null = main list, "account", "privacy", "lists", "chats", "broadcasts", "notifications"
  const [subPage, setSubPage] = useState(null);
  const [qrTab, setQrTab] = useState("my_code"); // "my_code" or "scan_code"
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Profile database states
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [displayName, setDisplayName] = useState("No Name Set");
  const [username, setUsername] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Edit fields mode states
  const [editNameMode, setEditNameMode] = useState(false);
  const [tempName, setTempName] = useState("");
  const [nameError, setNameError] = useState("");

  const [editAboutMode, setEditAboutMode] = useState(false);
  const [tempAbout, setTempAbout] = useState("");
  const [aboutError, setAboutError] = useState("");

  const [editEmailMode, setEditEmailMode] = useState(false);
  const [tempEmail, setTempEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const fileInputRef = useRef(null);

  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const gatewayBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1").replace("/api/v1", "");
    return `${gatewayBase}${path}`;
  };

  // Toast utility
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch profile on mount
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }

    async function loadProfile() {
      try {
        const res = await getProfile();
        if (res && res.data) {
          setProfile(res.data);
          setDisplayName(res.data.displayName || "No Name Set");
          setUsername(res.data.phone || res.data.phoneNumber);
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, [router]);

  // Zod Client-Side Validations
  const nameSchema = z.string().trim().min(2, "Name must be at least 2 characters").max(40, "Name cannot exceed 40 characters").refine(val => val.length > 0, "Name cannot be empty");
  const aboutSchema = z.string().trim().max(140, "Bio cannot exceed 140 characters").optional().or(z.literal(""));
  const emailSchema = z.string().trim().email("Invalid email address").optional().or(z.literal(""));

  // Save Display Name
  const handleSaveName = async (e) => {
    e.preventDefault();
    setNameError("");
    const parsed = nameSchema.safeParse(tempName);
    if (!parsed.success) {
      setNameError(parsed.error.errors[0].message);
      return;
    }
    try {
      const trimmed = tempName.trim();
      await updateProfile({ displayName: trimmed });
      setProfile(prev => prev ? { ...prev, displayName: trimmed } : null);
      setDisplayName(trimmed);
      setEditNameMode(false);
      showToast("Profile updated successfully");
    } catch (err) {
      showToast(err.message || "Failed to update display name");
    }
  };

  // Save About
  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setAboutError("");
    const parsed = aboutSchema.safeParse(tempAbout);
    if (!parsed.success) {
      setAboutError(parsed.error.errors[0].message);
      return;
    }
    try {
      const trimmed = tempAbout.trim();
      await updateProfile({ displayName, about: trimmed });
      setProfile(prev => prev ? { ...prev, about: trimmed } : null);
      setEditAboutMode(false);
      showToast("Profile updated successfully");
    } catch (err) {
      showToast(err.message || "Failed to update bio");
    }
  };

  // Save Email
  const handleSaveEmail = async (e) => {
    e.preventDefault();
    setEmailError("");
    const parsed = emailSchema.safeParse(tempEmail);
    if (!parsed.success) {
      setEmailError(parsed.error.errors[0].message);
      return;
    }
    try {
      const trimmed = tempEmail.trim();
      await updateProfile({ displayName, email: trimmed });
      setProfile(prev => prev ? { ...prev, email: trimmed } : null);
      setEditEmailMode(false);
      showToast("Profile updated successfully");
    } catch (err) {
      showToast(err.message || "Failed to update email address");
    }
  };

  // Upload Avatar
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("File size exceeds 5 MB limit");
      return;
    }

    setAvatarUploading(true);
    try {
      const res = await uploadAvatar(file);
      if (res && res.data) {
        setProfile(res.data);
        showToast("Profile photo uploaded successfully");
      }
    } catch (err) {
      showToast(err.message || "Failed to upload profile photo");
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Delete Avatar
  const handleAvatarDelete = async () => {
    if (!confirm("Are you sure you want to remove your profile photo?")) return;
    setAvatarUploading(true);
    try {
      const res = await deleteAvatar();
      if (res && res.data) {
        setProfile(res.data);
        showToast("Profile photo removed successfully");
      }
    } catch (err) {
      showToast(err.message || "Failed to remove profile photo");
    } finally {
      setAvatarUploading(false);
    }
  };

  // Delete Account
  const handleDeleteAccountConfirm = async () => {
    setDeletingAccount(true);
    try {
      await deleteAccount();
      showToast("Account deleted successfully");
      logoutUser();
      router.push("/");
    } catch (err) {
      console.error("Failed to delete account:", err);
      showToast(err.message || "Failed to delete account. Please try again.");
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

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
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 150);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // ==========================================
  // SUB-PAGES RENDERING
  // ==========================================

  // 0.0 QR CODE SUB-PAGE (WhatsApp-Style My Code & Scan Code tabs)
  if (subPage === "qr") {
    return (
      <div className="w-full bg-[#f8f9fa] dark:bg-[#0b141a] text-[#1c2e35] dark:text-[#e9edef] antialiased min-h-screen flex flex-col pb-24 font-sans select-none transition-colors duration-200">
        {/* Header */}
        <header className="sticky top-0 z-40 px-4 py-3.5 flex items-center bg-white dark:bg-[#111b21] border-b border-zinc-100 dark:border-[#222d34] shadow-sm">
          <button
            onClick={() => setSubPage(null)}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 transition-transform text-zinc-700 dark:text-white cursor-pointer mr-3"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[25px]">arrow_back</span>
          </button>
          <h2 className="text-[19px] font-bold text-[#111b21] dark:text-white leading-none flex-1">
            QR code
          </h2>
          <div className="flex items-center gap-3.5 text-[#3b4a54] dark:text-white">
            <button aria-label="Share" className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 cursor-pointer">
              <span className="material-symbols-outlined text-[23px]">share</span>
            </button>
          </div>
        </header>

        {/* Custom Sub-Tabs */}
        <div className="flex bg-white dark:bg-[#111b21] border-b border-zinc-100 dark:border-[#222d34]">
          <button
            onClick={() => setQrTab("my_code")}
            className={`flex-1 py-3 text-center text-[13.5px] font-bold tracking-wider uppercase border-b-3 transition-colors ${qrTab === "my_code" ? "border-[#00a884] dark:border-[#ff2d55] text-[#00a884] dark:text-[#ff2d55]" : "border-transparent text-zinc-500 hover:text-zinc-700"}`}
          >
            My Code
          </button>
          <button
            onClick={() => setQrTab("scan_code")}
            className={`flex-1 py-3 text-center text-[13.5px] font-bold tracking-wider uppercase border-b-3 transition-colors ${qrTab === "scan_code" ? "border-[#00a884] dark:border-[#ff2d55] text-[#00a884] dark:text-[#ff2d55]" : "border-transparent text-zinc-500 hover:text-zinc-700"}`}
          >
            Scan Code
          </button>
        </div>

        <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto">
          {qrTab === "my_code" ? (
            /* MY CODE VIEW */
            <div className="w-full flex flex-col items-center animate-in fade-in duration-200">

              {/* Outer Card Container */}
              <div className="w-full bg-white dark:bg-[#111b21] rounded-3xl border border-zinc-100 dark:border-[#222d34] shadow-[0_4px_24px_rgba(0,0,0,0.06)] px-6 pt-10 pb-8 flex flex-col items-center relative mt-6">

                {/* Avatar positioning overlapping top slightly */}
                <div className="absolute -top-7 w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-[#111b21] shadow-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  {profile?.avatar ? (
                    <img
                      src={getAvatarUrl(profile.avatar)}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[32px] text-zinc-400 dark:text-zinc-600">person</span>
                  )}
                </div>

                {/* Display Name */}
                <h3 className="text-[17px] font-bold text-[#111b21] dark:text-white mt-1">
                  {displayName}
                </h3>

                {/* User Type Badge */}
                <span className="text-[11.5px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
                  AppMetaChat contact
                </span>

                {/* QR Code Graphic Wrapper */}
                <div className="my-6 p-4 bg-white rounded-2xl shadow-inner border border-zinc-100 flex items-center justify-center relative w-56 h-56">
                  {/* Public QR Generator API */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`http://localhost:5173/chats?scanPhone=${encodeURIComponent(profile?.phone || profile?.phoneNumber || "")}`)}`}
                    alt="Scan to Chat QR Code"
                    className="w-full h-full object-contain"
                  />
                  {/* Center chat bubble icon for branding matching WhatsApp */}
                  <div className="absolute w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-zinc-100 shadow-sm">
                    <span className="material-symbols-outlined text-[#00a884] dark:text-[#ff2d55] text-[20px] font-bold">chat</span>
                  </div>
                </div>

                {/* Info Text */}
                <p className="text-[12px] text-zinc-400 dark:text-zinc-500 text-center px-2 leading-relaxed">
                  Your QR code is private. If you share it with someone, they can scan it with their AppMetaChat camera to add you as a contact.
                </p>
              </div>
            </div>
          ) : (
            /* SCAN CODE VIEW */
            <div className="w-full flex flex-col items-center animate-in fade-in duration-200 gap-6">

              {/* Simulated Camera Scanner box */}
              <div className="w-full aspect-square max-w-[280px] bg-black rounded-3xl relative overflow-hidden border-4 border-zinc-200 dark:border-zinc-800 shadow-lg flex flex-col items-center justify-center">

                {/* Scanner Target Guide box */}
                <div className="w-[180px] h-[180px] border-2 border-white/60 rounded-2xl relative z-10 flex flex-col items-center justify-center">

                  {/* Top left corner bracket */}
                  <div className="absolute top-[-2px] left-[-2px] w-6 h-6 border-t-4 border-l-4 border-[#00a884] dark:border-[#ff2d55] rounded-tl-lg"></div>
                  {/* Top right corner bracket */}
                  <div className="absolute top-[-2px] right-[-2px] w-6 h-6 border-t-4 border-r-4 border-[#00a884] dark:border-[#ff2d55] rounded-tr-lg"></div>
                  {/* Bottom left corner bracket */}
                  <div className="absolute bottom-[-2px] left-[-2px] w-6 h-6 border-b-4 border-l-4 border-[#00a884] dark:border-[#ff2d55] rounded-bl-lg"></div>
                  {/* Bottom right corner bracket */}
                  <div className="absolute bottom-[-2px] right-[-2px] w-6 h-6 border-b-4 border-r-4 border-[#00a884] dark:border-[#ff2d55] rounded-br-lg"></div>

                  <span className="material-symbols-outlined text-[48px] text-white/40 animate-pulse">photo_camera</span>
                </div>

                {/* Laser Scanning Line Animation */}
                <div className="absolute left-0 right-0 h-1 bg-[#00a884] dark:bg-[#ff2d55] shadow-[0_0_8px_#00a884] opacity-80" style={{
                  animation: "scanLine 2.5s infinite linear",
                  top: "20%"
                }}></div>

                <style>{`
                  @keyframes scanLine {
                    0% { top: 15%; }
                    50% { top: 85%; }
                    100% { top: 15%; }
                  }
                `}</style>

                {/* Simulating text overlay */}
                <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                  <span className="text-[10px] text-white/70 font-semibold uppercase tracking-wider bg-black/40 px-3 py-1 rounded-full">Align QR Code within frame</span>
                </div>
              </div>

              {/* Interactive Simulation Input Form */}
              <div className="w-full bg-white dark:bg-[#111b21] rounded-2xl border border-zinc-100 dark:border-[#222d34] shadow-sm p-4 flex flex-col gap-3">
                <span className="text-[11px] font-bold text-[#00a884] dark:text-[#ff2d55] uppercase tracking-wider">
                  Simulate QR Scan (Test)
                </span>

                <p className="text-[11.5px] text-zinc-400 dark:text-zinc-500 leading-normal">
                  No camera scanner permissions required! Enter any contact number to simulate scanning their QR code.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const num = e.target.simPhone.value.trim();
                    if (num) {
                      router.push(`/chats?scanPhone=${encodeURIComponent(num)}`);
                    }
                  }}
                  className="flex items-center gap-2 mt-1"
                >
                  <input
                    name="simPhone"
                    type="text"
                    placeholder="e.g. +918765435678"
                    className="flex-1 bg-zinc-50 dark:bg-[#202c33] border-none outline-none focus:outline-none rounded-xl py-2 px-3 text-[14px] text-[#111b21] dark:text-white"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-[#00a884] dark:bg-[#ff2d55] text-white px-4 py-2 rounded-xl text-[13px] font-bold active:scale-95 transition-transform cursor-pointer"
                  >
                    Scan
                  </button>
                </form>
              </div>

            </div>
          )}
        </main>

        <Navigation activeTab="settings" />
      </div>
    );
  }

  // 0. PROFILE SUB-PAGE (WhatsApp-Style Settings Screen)
  if (subPage === "profile") {
    return (
      <div className="w-full bg-[#f8f9fa] dark:bg-[#0b141a] text-[#1c2e35] dark:text-[#e9edef] antialiased min-h-screen flex flex-col pb-24 font-sans select-none transition-colors duration-200">
        {/* Header */}
        <header className="sticky top-0 z-40 px-4 py-3.5 flex items-center bg-white dark:bg-[#111b21] border-b border-zinc-100 dark:border-[#222d34] shadow-sm">
          <button
            onClick={() => {
              setSubPage(null);
              setEditNameMode(false);
              setEditAboutMode(false);
              setEditEmailMode(false);
            }}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 transition-transform text-zinc-700 dark:text-white cursor-pointer mr-3"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[25px]">arrow_back</span>
          </button>
          <h2 className="text-[19px] font-bold text-[#111b21] dark:text-white leading-none">
            Profile Settings
          </h2>
        </header>

        {loadingProfile ? (
          /* Loading Skeleton */
          <div className="flex-1 flex flex-col items-center p-6 gap-6 w-full max-w-md mx-auto animate-pulse">
            <div className="w-32 h-32 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="w-full flex flex-col gap-4">
              <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
              <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
              <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
            </div>
          </div>
        ) : (
          /* Profile Details Content */
          <main className="flex-1 flex flex-col w-full max-w-md mx-auto px-5 py-6 animate-in fade-in duration-200">

            {/* Avatar Upload Container */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-32 h-32">
                {/* Image Wrap circle */}
                <div className="relative group w-full h-full rounded-full overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  {profile?.avatar ? (
                    <img
                      src={getAvatarUrl(profile.avatar)}
                      alt="Profile Photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[64px] text-zinc-400 dark:text-zinc-600">person</span>
                  )}

                  {/* Camera Overlay */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white cursor-pointer select-none"
                  >
                    <span className="material-symbols-outlined text-[28px] mb-1">photo_camera</span>
                    <span className="text-[9.5px] font-bold tracking-wider uppercase text-center px-2">Change Photo</span>
                  </div>

                  {/* Uploading Spinner */}
                  {avatarUploading && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-20">
                      <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin mb-1"></div>
                      <span className="text-[9px] font-semibold">Processing...</span>
                    </div>
                  )}
                </div>

                {/* Remove Photo Floating Button */}
                {profile?.avatar && !avatarUploading && (
                  <button
                    type="button"
                    onClick={handleAvatarDelete}
                    className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-red-500 hover:bg-red-650 text-white flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer z-30 border-2 border-white dark:border-[#0b141a]"
                    title="Remove profile photo"
                    aria-label="Remove profile photo"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleAvatarUpload}
              />
            </div>

            {/* Profile Info Fields List */}
            <div className="flex flex-col gap-5">

              {/* 1. Display Name Field */}
              <div className="bg-white dark:bg-[#111b21] rounded-2xl p-4 border border-zinc-100 dark:border-[#222d34] shadow-sm flex flex-col transition-all">
                <span className="text-[11px] font-bold text-[#00a884] dark:text-[#ff2d55] uppercase tracking-wider mb-1.5">
                  Your Name
                </span>

                {editNameMode ? (
                  <form onSubmit={handleSaveName} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 border-b-2 border-[#00a884] dark:border-[#ff2d55] py-1">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-[15.5px] text-[#111b21] dark:text-[#e9edef] py-1"
                        maxLength={40}
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEditNameMode(false);
                          setNameError("");
                        }}
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500 cursor-pointer"
                        aria-label="Cancel"
                      >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                      <button
                        type="submit"
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-[#00a884] dark:text-[#ff2d55] cursor-pointer"
                        aria-label="Save"
                      >
                        <span className="material-symbols-outlined text-[20px]">check</span>
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-zinc-400 dark:text-zinc-500">
                      <span className="text-red-500">{nameError}</span>
                      <span>{40 - tempName.length} characters left</span>
                    </div>
                  </form>
                ) : (
                  <div
                    onClick={() => {
                      setTempName(profile?.displayName || "");
                      setEditNameMode(true);
                    }}
                    className="flex justify-between items-center cursor-pointer group"
                  >
                    <span className="text-[15.5px] text-[#111b21] dark:text-[#e9edef] font-medium py-1">
                      {profile?.displayName || "No Name Set"}
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 transition-colors">edit</span>
                  </div>
                )}

                <p className="text-[11.5px] text-zinc-400 dark:text-zinc-500 mt-2 leading-relaxed">
                  This name will be visible to your AppMetaChat contacts.
                </p>
              </div>

              {/* 2. About/Bio Field */}
              <div className="bg-white dark:bg-[#111b21] rounded-2xl p-4 border border-zinc-100 dark:border-[#222d34] shadow-sm flex flex-col transition-all">
                <span className="text-[11px] font-bold text-[#00a884] dark:text-[#ff2d55] uppercase tracking-wider mb-1.5">
                  About
                </span>

                {editAboutMode ? (
                  <form onSubmit={handleSaveAbout} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 border-b-2 border-[#00a884] dark:border-[#ff2d55] py-1">
                      <input
                        type="text"
                        value={tempAbout}
                        onChange={(e) => setTempAbout(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-[15.5px] text-[#111b21] dark:text-[#e9edef] py-1"
                        maxLength={140}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEditAboutMode(false);
                          setAboutError("");
                        }}
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500 cursor-pointer"
                        aria-label="Cancel"
                      >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                      <button
                        type="submit"
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-[#00a884] dark:text-[#ff2d55] cursor-pointer"
                        aria-label="Save"
                      >
                        <span className="material-symbols-outlined text-[20px]">check</span>
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-zinc-400 dark:text-zinc-500">
                      <span className="text-red-500">{aboutError}</span>
                      <span>{140 - tempAbout.length} characters left</span>
                    </div>
                  </form>
                ) : (
                  <div
                    onClick={() => {
                      setTempAbout(profile?.about || "");
                      setEditAboutMode(true);
                    }}
                    className="flex justify-between items-center cursor-pointer group"
                  >
                    <span className="text-[15.5px] text-[#111b21] dark:text-[#e9edef] font-medium py-1">
                      {profile?.about || "Available for chat..."}
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 transition-colors">edit</span>
                  </div>
                )}
              </div>

              {/* 3. Email Field */}
              <div className="bg-white dark:bg-[#111b21] rounded-2xl p-4 border border-zinc-100 dark:border-[#222d34] shadow-sm flex flex-col transition-all">
                <span className="text-[11px] font-bold text-[#00a884] dark:text-[#ff2d55] uppercase tracking-wider mb-1.5">
                  Email
                </span>

                {editEmailMode ? (
                  <form onSubmit={handleSaveEmail} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 border-b-2 border-[#00a884] dark:border-[#ff2d55] py-1">
                      <input
                        type="email"
                        value={tempEmail}
                        placeholder="yourname@example.com"
                        onChange={(e) => setTempEmail(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-[15.5px] text-[#111b21] dark:text-[#e9edef] py-1"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEditEmailMode(false);
                          setEmailError("");
                        }}
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500 cursor-pointer"
                        aria-label="Cancel"
                      >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                      <button
                        type="submit"
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-[#00a884] dark:text-[#ff2d55] cursor-pointer"
                        aria-label="Save"
                      >
                        <span className="material-symbols-outlined text-[20px]">check</span>
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-zinc-400 dark:text-zinc-500">
                      <span className="text-red-500">{emailError}</span>
                    </div>
                  </form>
                ) : (
                  <div
                    onClick={() => {
                      setTempEmail(profile?.email || "");
                      setEditEmailMode(true);
                    }}
                    className="flex justify-between items-center cursor-pointer group"
                  >
                    <span className={`text-[15.5px] font-medium py-1 ${profile?.email ? "text-[#111b21] dark:text-[#e9edef]" : "text-zinc-400 dark:text-zinc-500"}`}>
                      {profile?.email || "Add email address..."}
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 transition-colors">edit</span>
                  </div>
                )}
              </div>

              {/* 4. Phone Number Field (Read Only) */}
              <div className="bg-white dark:bg-[#111b21] rounded-2xl p-4 border border-zinc-100 dark:border-[#222d34] shadow-sm flex flex-col">
                <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                  Phone Number (Read Only)
                </span>
                <div className="flex justify-between items-center">
                  <span className="text-[15.5px] text-[#1c2e35]/60 dark:text-[#e9edef]/60 font-medium py-1">
                    {profile?.phone || profile?.phoneNumber || ""}
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-zinc-300 dark:text-zinc-600 select-none">lock</span>
                </div>
              </div>

            </div>
          </main>
        )}

        <Navigation activeTab="settings" />
      </div>
    );
  }

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
                logoutUser();
                router.push("/");
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
            onClick={() => setShowDeleteModal(true)}
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
      <header className={`sticky top-0 z-40 px-4 py-3 flex justify-between items-center transition-all duration-300 ${scrolled
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
              setSubPage("profile");
            }}
            aria-label="Edit Profile"
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">edit</span>
          </button>
          <button
            onClick={() => setSubPage("qr")}
            aria-label="QR Code"
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
          </button>
        </div>
      </header>

      {/* Main Settings Body */}
      <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto bg-white dark:bg-[#0b141a]">

        {/* Profile Card and Doodle Backdrop Area */}
        <div
          onClick={() => setSubPage("profile")}
          className="relative w-full overflow-hidden bg-white dark:bg-[#0b141a] py-8 px-4 flex flex-col items-center shrink-0 cursor-pointer hover:bg-zinc-50 dark:hover:bg-[#202c33]/40 transition-colors"
        >
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
            <div className="w-28 h-28 rounded-full overflow-hidden border border-zinc-100 dark:border-zinc-800/80 shadow-md relative hover:scale-[1.02] active:scale-95 transition-transform duration-200 cursor-pointer bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              {profile?.avatar ? (
                <img
                  alt="Profile"
                  src={getAvatarUrl(profile.avatar)}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="material-symbols-outlined text-[54px] text-zinc-400 dark:text-zinc-600">person</span>
              )}
            </div>

            {/* Name + Green Add Circle Icon */}
            <h2 className="text-[21px] font-bold text-[#111b21] dark:text-white mt-4 flex items-center justify-center gap-2">
              <span>{displayName}</span>
              <span className="material-symbols-outlined text-[20px] text-[#00a884] dark:text-[#ff2d55] font-bold fill">add_circle</span>
            </h2>

            {/* Phone/Username details */}
            <span className="text-[13.5px] text-[#667781] dark:text-[#8696a0] font-medium mt-1 inline-block">
              {profile?.phone || profile?.phoneNumber || ""}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-100 dark:bg-zinc-800/80 mx-5 my-1.5"></div>

        {/* Scrollable list of Settings options */}
        <div className="flex flex-col bg-white dark:bg-[#0b141a] py-1 pb-16">
          {SETTINGS_LIST.map((item, idx) => (
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#111b21] dark:bg-[#202c33] text-[#e9edef] px-4 py-2.5 rounded-lg shadow-lg text-[13.5px] font-medium tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-200 border border-zinc-200/10">
          {toastMessage}
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[150] bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#111b21] rounded-2xl p-6 w-full max-w-[340px] shadow-2xl animate-in zoom-in-95 duration-150 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3 text-red-500 mb-3">
              <span className="material-symbols-outlined text-[28px]">warning</span>
              <h3 className="text-[18px] font-bold text-[#111b21] dark:text-white">Delete account?</h3>
            </div>

            <p className="text-[13.5px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              This action is permanent and cannot be undone. You will permanently lose your chat logs, groups, and settings from AppMetaChat.
            </p>

            <div className="flex justify-end gap-3.5">
              <button
                type="button"
                disabled={deletingAccount}
                onClick={() => setShowDeleteModal(false)}
                className="text-zinc-500 font-bold text-[14.5px] px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer disabled:opacity-50 active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingAccount}
                onClick={handleDeleteAccountConfirm}
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-[14.5px] px-5 py-2.5 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 shadow-md shadow-red-500/10"
              >
                {deletingAccount ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
