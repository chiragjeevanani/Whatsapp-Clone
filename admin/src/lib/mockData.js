export const MOCK_STATS = {
  totalUsers: 14204,
  totalUsersChange: "+12.4%",
  activeUsers24h: 3840,
  activeUsersChange: "+8.2%",
  messagesToday: 94820,
  messagesTodayChange: "+15.1%",
  activeGroups: 842,
  activeGroupsChange: "+4.3%",
  totalCallsToday: 1240,
  totalCallsChange: "+2.7%",
  totalCommunities: 128,
  totalCommunitiesChange: "+6.1%",
  reportedContent: 14,
  reportedContentChange: "-3",
  storageUsed: "142.8 GB",
  storageUsedChange: "+4.2 GB"
};

export const MOCK_USER_GROWTH = [
  { date: "06/10", users: 11200 },
  { date: "06/15", users: 11800 },
  { date: "06/20", users: 12300 },
  { date: "06/25", users: 12900 },
  { date: "06/30", users: 13400 },
  { date: "07/05", users: 13900 },
  { date: "07/10", users: 14204 }
];

export const MOCK_MESSAGES_VOLUME = [
  { day: "Mon", count: 78000 },
  { day: "Tue", count: 81000 },
  { day: "Wed", count: 85000 },
  { day: "Thu", count: 92000 },
  { day: "Fri", count: 89000 },
  { day: "Sat", count: 94000 },
  { day: "Sun", count: 94820 }
];

export const MOCK_PLATFORMS = [
  { name: "Android", value: 68 },
  { name: "iOS", value: 24 },
  { name: "Web / Desktop", value: 8 }
];

export const MOCK_ACTIVITIES = [
  { id: 1, type: "report", user: "Praveen Jaiswal", description: "reported group 'Free Crypto Alerts' for spam", time: "5 mins ago" },
  { id: 2, type: "registration", user: "Rayan MOCARD", description: "registered a new account via +91 90590 55803", time: "12 mins ago" },
  { id: 3, type: "community", user: "Chirag (You)", description: "created a new community 'Appzeto Developers'", time: "45 mins ago" },
  { id: 4, type: "channel", user: "Sarkari Jobs", description: "posted an update to 12.8k followers", time: "1 hour ago" },
  { id: 5, type: "report", user: "Kittu", description: "reported message containing phishing link", time: "2 hours ago" }
];

export const MOCK_USERS = [
  {
    id: "chirag",
    name: "Chirag (You)",
    phone: "+91 99999 99999",
    username: "@Chiragjeevanani",
    status: "Active",
    lastSeen: "Online",
    joinedDate: "12 Jan 2026",
    messagesSent: 4892,
    about: "Available for chat...",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtSTDTUitRQB5aG-ZcdFAsyFdP86mWxvW55CsH3fDZwlfJQzUR8Xav3ghPt6k07h7ujn8WjMnfUwokeODYvQGKKOm7F33aNS0EEnqaoctdIhY8ELBRO8tQR6mKm8_M0WvqegMqhtKgIxXjkXMfUbV5OAZ2iz0uoTKeVH-5FFp1KbmYjoXhls-OIQUHDnNB91KgpZba0PQ5hk-LVeGan4gFJdAzjvJk3mHfnEHBA8mO8nDZBHLChXewILCZaO_GNayQUdKeTWP5oeQ",
    device: "iPhone 15 Pro",
    os: "iOS 17.4",
    appVersion: "v2.4.1"
  },
  {
    id: "kittu",
    name: "Kittu",
    phone: "+91 88888 88888",
    username: "@kittu_dev",
    status: "Active",
    lastSeen: "Today, 12:49",
    joinedDate: "15 Jan 2026",
    messagesSent: 2901,
    about: "Busy coding.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD209t6Zin8k_HGjBSvGIRB_KONmSIL8sbz2S-MQFb6yxRje3Ge3PGp-yyOH_yZg4mCb_u8FkyApwL2yhfjFnLSiwHkH3lawFQHkpZmSRXx5D7BGsdZYSdvP6PhIeM3t9PjrvbV02NUdZMoHPGEZ-ZwJRlrv8enxQjqxirmtclZn9U_UQz7m55E9_VQNGreM6hRVv44INUgYZ7PQRf4Oct93w5plsG6f9LeRAuAOZt_QSgliP9AOs46NF7TylHhikGVRGfXyCWVFLo",
    device: "OnePlus 11",
    os: "Android 14",
    appVersion: "v2.4.0"
  },
  {
    id: "praveen",
    name: "Praveen Jaiswal",
    phone: "+91 77777 77777",
    username: "@praveen_j",
    status: "Active",
    lastSeen: "Today, 11:29",
    joinedDate: "03 Feb 2026",
    messagesSent: 1204,
    about: "Exploring life.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwQrgxOsMS1XWAnphaxw8os32Nkd0OyGaUCh4ajkQScMRmv-tZ1xTQfgLOlboD17H-5Q8XkMsgCNonvqt7oUFQcAe9ryGmn9cMAwkTpD58X9U_qG-UwP9ppKXDU-pRgjA7JHMLu_PgtT8k6IT-DjpPsz4kD8EXPGEUwvOHGv-3Gw9lOpsIw9PDFwNQk5c3wN6I4ztIjpTTGJ5U7ltKTOxLJVo_lm-mJkMdAWjTxhFi9fhTDvbcQNsRRl1cG_7vSsSZto-zZwjvlPw",
    device: "Samsung S24 Ultra",
    os: "Android 14",
    appVersion: "v2.4.1"
  },
  {
    id: "scammer",
    name: "Crypto Booster Bot",
    phone: "+1 (555) 019-2834",
    username: "@free_crypto_bot",
    status: "Banned",
    lastSeen: "Blocked 09/07/2026",
    joinedDate: "08 Jul 2026",
    messagesSent: 450,
    about: "Multiply your money instantly!!!",
    avatar: null,
    device: "Emulator / API Client",
    os: "Linux",
    appVersion: "v2.3.9"
  }
];

export const MOCK_REPORTS = [
  {
    id: "REP-101",
    type: "Message",
    preview: "Send me your password or card details to verify...",
    reporter: "Kittu",
    reportedUser: "Crypto Booster Bot",
    reason: "Scam / Phishing",
    status: "Pending",
    date: "Today, 10:14"
  },
  {
    id: "REP-102",
    type: "Group",
    preview: "Group name: 'Free Crypto Alerts'",
    reporter: "Praveen Jaiswal",
    reportedUser: "Crypto Booster Bot",
    reason: "Spam",
    status: "Pending",
    date: "Today, 09:30"
  }
];

export const MOCK_CHATS = [
  { id: "appzeto-official", name: "Appzeto_Official", isGroup: true, members: 12, messagesCount: 382, lastActive: "Today, 12:00" },
  { id: "chirag-kittu", name: "Chirag & Kittu", isGroup: false, members: 2, messagesCount: 894, lastActive: "Today, 12:49" },
  { id: "free-crypto", name: "Free Crypto Alerts", isGroup: true, members: 124, messagesCount: 450, lastActive: "Today, 09:30" }
];

export const MOCK_COMMUNITIES = [
  { id: "com-1", name: "Appzeto Developers", groupsCount: 4, membersCount: 42, createdBy: "Chirag", status: "Active", date: "15 Jun 2026" },
  { id: "com-2", name: "Indore Tech Meetups", groupsCount: 2, membersCount: 184, createdBy: "Kittu", status: "Active", date: "20 Jun 2026" }
];

export const MOCK_CHANNELS = [
  { id: "chan-1", name: "Sarkari Jobs Info", followers: 12840, createdBy: "Balram Yadav", status: "Active", date: "10 Feb 2026" },
  { id: "chan-2", name: "Gemini Premium Tech", followers: 98300, createdBy: "Google Deepmind", status: "Active", date: "01 Jan 2026" }
];

export const MOCK_CALLS = [
  { id: 1, caller: "Rayan MOCARD", receiver: "Chirag", type: "Video", duration: "12m 45s", status: "Completed", date: "Today, 17:30" },
  { id: 2, caller: "Rayan MOCARD", receiver: "Chirag", type: "Voice", duration: "0m 0s", status: "Missed", date: "23 Jun, 19:37" },
  { id: 3, caller: "Sheetal Ma'am Appzeto", receiver: "Chirag", type: "Voice", duration: "5m 20s", status: "Completed", date: "23 Jun, 14:54" }
];
