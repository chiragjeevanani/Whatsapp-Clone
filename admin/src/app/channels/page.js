"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import { MOCK_CHANNELS } from "@/lib/mockData";

export default function ChannelsPage() {
  const [channels, setChannels] = useState(MOCK_CHANNELS);

  const columns = [
    {
      key: "name",
      label: "Channel",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-500 font-bold">
            {row.name.charAt(0)}
          </div>
          <span className="font-bold text-xs text-foreground">{row.name}</span>
        </div>
      )
    },
    {
      key: "followers",
      label: "Followers Count",
      sortable: true,
      render: (row) => row.followers.toLocaleString()
    },
    {
      key: "createdBy",
      label: "Publisher",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "danger"}>
          {row.status}
        </Badge>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button 
          onClick={() => alert(`Channel "${row.name}" configuration coming soon.`)}
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
          <h2 className="text-xl font-bold tracking-tight text-foreground">Broadcast Channels</h2>
          <p className="text-xs text-muted-foreground">Verify status updates, verify channel creators and audit feeds.</p>
        </div>

        <div className="glass p-6 rounded-xl border border-border">
          <DataTable 
            columns={columns} 
            data={channels} 
            searchableKey="name" 
            placeholder="Search channels..." 
          />
        </div>
      </div>
    </AdminLayout>
  );
}
