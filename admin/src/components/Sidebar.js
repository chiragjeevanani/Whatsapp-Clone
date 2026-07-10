import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Layers, 
  Radio, 
  PhoneCall, 
  AlertOctagon, 
  Send, 
  Settings, 
  LogOut,
  FileText
} from "lucide-react";

export default function Sidebar({ activeSegment }) {
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, segment: "dashboard" },
    { name: "Users", href: "/users", icon: Users, segment: "users" },
    { name: "Chats", href: "/chats", icon: MessageSquare, segment: "chats" },
    { name: "Communities", href: "/communities", icon: Layers, segment: "communities" },
    { name: "Channels", href: "/channels", icon: Radio, segment: "channels" },
    { name: "Calls", href: "/calls", icon: PhoneCall, segment: "calls" },
    { name: "Moderation", href: "/moderation", icon: AlertOctagon, segment: "moderation", badge: 14 },
    { name: "Broadcasts", href: "/broadcasts", icon: Send, segment: "broadcasts" },
    { name: "Settings", href: "/settings", icon: Settings, segment: "settings" },
    { name: "System Logs", href: "/logs", icon: FileText, segment: "logs" }
  ];

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0 shrink-0 select-none transition-colors duration-200">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-6 border-b border-border gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
          <span className="text-[#09090b] font-bold text-lg">Z</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-sm text-foreground">ZETTO ADMIN</span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Premium Control</span>
        </div>
      </div>

      {/* Nav Menu Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSegment === item.segment;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 group font-medium ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-105 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-primary-foreground text-primary" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer Section */}
      <div className="p-4 border-t border-border bg-card">
        <Link 
          href="/login" 
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/15 transition-all duration-150 font-medium"
        >
          <LogOut className="w-4 h-4 text-muted-foreground" />
          <span>Exit Session</span>
        </Link>
      </div>
    </aside>
  );
}
