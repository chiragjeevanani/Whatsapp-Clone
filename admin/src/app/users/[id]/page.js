"use client";

import React, { use, useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import Badge from "@/components/Badge";
import { MOCK_USERS } from "@/lib/mockData";
import Link from "next/link";
import { 
  ArrowLeft, 
  Smartphone, 
  Layers, 
  Shield, 
  Ban, 
  Trash2, 
  MessageSquareOff,
  Database
} from "lucide-react";

export default function UserDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const userId = params.id;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const foundUser = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
    setUser(foundUser);
  }, [userId]);

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-muted-foreground">Loading account profile...</div>
      </AdminLayout>
    );
  }

  const handleAction = (act) => {
    alert(`Action "${act}" simulated successfully.`);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 select-none">
        {/* Back Link header */}
        <div className="flex items-center gap-4">
          <Link href="/users" className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">{user.name}</h2>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Account Detail View</span>
          </div>
        </div>

        {/* User Workspace Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Identity & Profile details Card */}
          <div className="glass p-6 rounded-xl border border-border flex flex-col items-center gap-5">
            <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center overflow-hidden border-2 border-border shadow-md">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-3xl text-primary">{user.name.charAt(0)}</span>
              )}
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-foreground">{user.name}</h3>
              <span className="text-xs text-muted-foreground block font-semibold">{user.username || "No Username"}</span>
              <span className="text-xs text-muted-foreground block font-semibold">{user.phone}</span>
              <div className="pt-2">
                <Badge variant={user.status === "Active" ? "success" : "danger"}>
                  {user.status}
                </Badge>
              </div>
            </div>

            <div className="w-full border-t border-border/60 my-2"></div>

            <div className="w-full space-y-3.5 text-xs text-left">
              <div>
                <span className="text-muted-foreground font-semibold uppercase text-[9px] tracking-wider block">Bio Statement</span>
                <span className="text-foreground font-medium mt-0.5 block">{user.about || "Available for chat..."}</span>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold uppercase text-[9px] tracking-wider block">Account Registry</span>
                <span className="text-foreground font-medium mt-0.5 block">{user.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Activity / Device configuration details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* System Statistics panel */}
            <div className="glass p-6 rounded-xl border border-border">
              <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2 mb-5">
                <Database className="w-4 h-4 text-primary" />
                <span>Usage Metrics</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/40">
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase block">Messages Sent</span>
                  <span className="text-lg font-bold text-foreground mt-0.5 block">{user.messagesSent?.toLocaleString() || "0"}</span>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/40">
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase block">Groups Joined</span>
                  <span className="text-lg font-bold text-foreground mt-0.5 block">12</span>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/40">
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase block">Calls Completed</span>
                  <span className="text-lg font-bold text-foreground mt-0.5 block">32</span>
                </div>
              </div>
            </div>

            {/* Device Info Panel */}
            <div className="glass p-6 rounded-xl border border-border">
              <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2 mb-5">
                <Smartphone className="w-4 h-4 text-primary" />
                <span>Active Device session</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-left">
                <div>
                  <span className="text-muted-foreground font-semibold uppercase text-[9px] tracking-wider block">Device Identifier</span>
                  <span className="text-foreground font-medium mt-0.5 block">{user.device || "iPhone 15 Pro"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-semibold uppercase text-[9px] tracking-wider block">Operating System</span>
                  <span className="text-foreground font-medium mt-0.5 block">{user.os || "iOS 17.4"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-semibold uppercase text-[9px] tracking-wider block">App Version</span>
                  <span className="text-foreground font-medium mt-0.5 block">{user.appVersion || "v2.4.1"}</span>
                </div>
              </div>
            </div>

            {/* Moderation Controls Panel */}
            <div className="glass p-6 rounded-xl border border-border">
              <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2 mb-5 text-destructive">
                <Shield className="w-4 h-4" />
                <span>Admin Actions Console</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => handleAction("toggle-ban")}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/25 text-destructive border border-destructive/20 text-xs font-bold transition-all cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Toggle Ban Status</span>
                </button>
                <button 
                  onClick={() => handleAction("restrict-broadcast")}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 text-amber-500 border border-amber-500/20 text-xs font-bold transition-all cursor-pointer"
                >
                  <MessageSquareOff className="w-3.5 h-3.5" />
                  <span>Restrict Messages</span>
                </button>
                <button 
                  onClick={() => handleAction("purge")}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-foreground border border-border text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge User Data</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
