"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import { MOCK_USERS } from "@/lib/mockData";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);

  const columns = [
    {
      key: "name",
      label: "User / Account Details",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center overflow-hidden border border-border shadow-inner">
            {row.avatar ? (
              <img src={row.avatar} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-xs text-primary">
                {row.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-xs text-foreground block">{row.name}</span>
            <span className="text-[10px] text-muted-foreground font-semibold">{row.username || "N/A"}</span>
          </div>
        </div>
      )
    },
    {
      key: "phone",
      label: "Phone Contact",
      sortable: true
    },
    {
      key: "status",
      label: "State",
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "danger"}>
          {row.status}
        </Badge>
      )
    },
    {
      key: "lastSeen",
      label: "Activity",
      sortable: true
    },
    {
      key: "messagesSent",
      label: "Messages Sent",
      sortable: true,
      render: (row) => row.messagesSent.toLocaleString()
    },
    {
      key: "joinedDate",
      label: "Registration",
      sortable: true
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Link 
            href={`/users/${row.id}`} 
            className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary-hover text-foreground transition-colors cursor-pointer text-[11px] font-bold border border-border/50"
          >
            Manage
          </Link>
          {row.status === "Active" ? (
            <button 
              onClick={() => toggleBan(row.id, "Banned")}
              className="px-2.5 py-1 rounded bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors cursor-pointer text-[11px] font-bold border border-destructive/20"
            >
              Suspend
            </button>
          ) : (
            <button 
              onClick={() => toggleBan(row.id, "Active")}
              className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors cursor-pointer text-[11px] font-bold border border-emerald-500/20"
            >
              Activate
            </button>
          )}
        </div>
      )
    }
  ];

  const toggleBan = (id, newStatus) => {
    if (confirm(`Are you sure you want to change this user status to ${newStatus}?`)) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 select-none">
        {/* Page Header */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">User Directory</h2>
          <p className="text-xs text-muted-foreground">Browse registered users, audit profiles, adjust system state parameters.</p>
        </div>

        {/* Users Table */}
        <div className="glass p-6 rounded-xl border border-border">
          <DataTable 
            columns={columns} 
            data={users} 
            searchableKey="name" 
            placeholder="Search by user name..." 
          />
        </div>
      </div>
    </AdminLayout>
  );
}
