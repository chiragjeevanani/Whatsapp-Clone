"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import { MOCK_CHATS } from "@/lib/mockData";

export default function GroupsPage() {
  const [groups, setGroups] = useState(MOCK_CHATS.filter(c => c.isGroup));

  const columns = [
    {
      key: "name",
      label: "Group Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500 font-bold">
            {row.name.charAt(0)}
          </div>
          <span className="font-bold text-xs text-foreground">{row.name}</span>
        </div>
      )
    },
    {
      key: "members",
      label: "Members Count",
      sortable: true,
      render: (row) => `${row.members} members`
    },
    {
      key: "messagesCount",
      label: "Total Messages",
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
          onClick={() => alert(`Group "${row.name}" management panel coming soon.`)}
          className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary-hover text-foreground transition-colors cursor-pointer text-[11px] font-bold border border-border/50"
        >
          Manage
        </button>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 select-none">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Group Chats</h2>
          <p className="text-xs text-muted-foreground">Monitor and manage user-created group discussions.</p>
        </div>

        <div className="glass p-6 rounded-xl border border-border">
          <DataTable 
            columns={columns} 
            data={groups} 
            searchableKey="name" 
            placeholder="Search groups..." 
          />
        </div>
      </div>
    </AdminLayout>
  );
}
