"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import { MOCK_CHATS } from "@/lib/mockData";

export default function ChatsOverviewPage() {
  const [chats, setChats] = useState(MOCK_CHATS);

  const columns = [
    {
      key: "name",
      label: "Conversation / Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
            row.isGroup 
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
              : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
          }`}>
            {row.name.charAt(0)}
          </div>
          <span className="font-bold text-xs text-foreground">{row.name}</span>
        </div>
      )
    },
    {
      key: "type",
      label: "Chat Type",
      sortable: true,
      render: (row) => (
        <Badge variant={row.isGroup ? "success" : "info"}>
          {row.isGroup ? "Group Chat" : "Direct Message"}
        </Badge>
      )
    },
    {
      key: "members",
      label: "Audience Size",
      sortable: true,
      render: (row) => `${row.members} users`
    },
    {
      key: "messagesCount",
      label: "Messages",
      sortable: true,
      render: (row) => row.messagesCount.toLocaleString()
    },
    {
      key: "lastActive",
      label: "Last Activity",
      sortable: true
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button 
          onClick={() => alert(`Details for conversation "${row.name}" coming soon.`)}
          className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary-hover text-foreground transition-colors cursor-pointer text-[11px] font-bold border border-border/50"
        >
          Audit logs
        </button>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 select-none">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Message Sessions</h2>
          <p className="text-xs text-muted-foreground">Monitor statistics on direct messaging and groups.</p>
        </div>

        <div className="glass p-6 rounded-xl border border-border">
          <DataTable 
            columns={columns} 
            data={chats} 
            searchableKey="name" 
            placeholder="Search conversation..." 
          />
        </div>
      </div>
    </AdminLayout>
  );
}
