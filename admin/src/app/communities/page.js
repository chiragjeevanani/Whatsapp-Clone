"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import { MOCK_COMMUNITIES } from "@/lib/mockData";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState(MOCK_COMMUNITIES);

  const columns = [
    {
      key: "name",
      label: "Community",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-500 font-bold">
            {row.name.charAt(0)}
          </div>
          <span className="font-bold text-xs text-foreground">{row.name}</span>
        </div>
      )
    },
    {
      key: "groupsCount",
      label: "Linked Groups",
      sortable: true,
      render: (row) => `${row.groupsCount} groups`
    },
    {
      key: "membersCount",
      label: "Total Members",
      sortable: true,
      render: (row) => `${row.membersCount} members`
    },
    {
      key: "createdBy",
      label: "Created By",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "warning"}>
          {row.status}
        </Badge>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button 
          onClick={() => alert(`Community "${row.name}" management details coming soon.`)}
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
          <h2 className="text-xl font-bold tracking-tight text-foreground">Communities</h2>
          <p className="text-xs text-muted-foreground">Audit multi-group user communities and announcement details.</p>
        </div>

        <div className="glass p-6 rounded-xl border border-border">
          <DataTable 
            columns={columns} 
            data={communities} 
            searchableKey="name" 
            placeholder="Search communities..." 
          />
        </div>
      </div>
    </AdminLayout>
  );
}
