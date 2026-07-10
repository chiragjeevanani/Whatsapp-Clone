"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import Badge from "@/components/Badge";

export default function BroadcastsPage() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipientSegment, setRecipientSegment] = useState("all");
  const [broadcasts, setBroadcasts] = useState([
    { id: 1, subject: "Welcome to Premium Zetto", content: "Enjoy fast, simple and secure chat messaging...", segment: "All Users", date: "15 Jun 2026", status: "Delivered" },
    { id: 2, subject: "Scheduled Maintenance Notification", content: "Zetto system services will undergo scheduled upgrades...", segment: "Beta Testers", date: "24 Jun 2026", status: "Scheduled" }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    const newBroadcast = {
      id: Date.now(),
      subject,
      content,
      segment: recipientSegment === "all" ? "All Users" : "Beta Segments",
      date: "Today, Now",
      status: "Delivered"
    };

    setBroadcasts([newBroadcast, ...broadcasts]);
    setSubject("");
    setContent("");
    alert("System message broadcast sent successfully!");
  };

  return (
    <AdminLayout>
      <div className="space-y-8 select-none">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Global Announcements</h2>
          <p className="text-xs text-muted-foreground">Broadcast critical updates and system announcements to all active users.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Creator Form */}
          <div className="glass p-6 rounded-xl border border-border lg:col-span-1">
            <h3 className="text-sm font-bold tracking-tight text-foreground mb-4">Compose Broadcast</h3>
            <form onSubmit={handleSend} className="space-y-4 text-xs text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground font-semibold uppercase text-[10px]">Subject Header</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="App update alert..." 
                  className="w-full bg-[#121214] border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground font-semibold uppercase text-[10px]">Recipient Filters</label>
                <select 
                  value={recipientSegment}
                  onChange={(e) => setRecipientSegment(e.target.value)}
                  className="w-full bg-[#121214] border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Registered Users</option>
                  <option value="active">Active Only (24h)</option>
                  <option value="beta">Beta Testing Group</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground font-semibold uppercase text-[10px]">Broadcast Body</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type message content..." 
                  rows={4}
                  className="w-full bg-[#121214] border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-[#09090b] font-bold py-2 rounded-lg transition-colors cursor-pointer"
              >
                Transmit Broadcast
              </button>
            </form>
          </div>

          {/* Broadcasts History list */}
          <div className="glass p-6 rounded-xl border border-border lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-tight text-foreground">Announcement History</h3>
            <div className="space-y-4 overflow-y-auto max-h-[360px] pr-2 text-left">
              {broadcasts.map((b) => (
                <div key={b.id} className="border-b border-border/40 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-foreground block">{b.subject}</span>
                    <Badge variant={b.status === "Delivered" ? "success" : "warning"}>{b.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{b.content}</p>
                  <div className="flex gap-4 items-center mt-2.5 text-[10px] text-muted-foreground font-semibold">
                    <span>Target: {b.segment}</span>
                    <span>•</span>
                    <span>Sent: {b.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
