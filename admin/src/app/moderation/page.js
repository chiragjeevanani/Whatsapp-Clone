"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import { MOCK_REPORTS } from "@/lib/mockData";

export default function ModerationPage() {
  const [reports, setReports] = useState(MOCK_REPORTS);

  const columns = [
    {
      key: "id",
      label: "Report ID",
      sortable: true
    },
    {
      key: "type",
      label: "Resource",
      sortable: true,
      render: (row) => <Badge variant="default">{row.type}</Badge>
    },
    {
      key: "preview",
      label: "Content Preview",
      render: (row) => <span className="italic text-muted-foreground">&quot;{row.preview}&quot;</span>
    },
    {
      key: "reporter",
      label: "Reporter",
      sortable: true
    },
    {
      key: "reportedUser",
      label: "Reported Account",
      sortable: true
    },
    {
      key: "reason",
      label: "Violation Category",
      sortable: true,
      render: (row) => <Badge variant="danger">{row.reason}</Badge>
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === "Pending" ? "warning" : "success"}>
          {row.status}
        </Badge>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleResolve(row.id)}
            className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 text-[11px] font-bold cursor-pointer"
          >
            Resolve
          </button>
          <button 
            onClick={() => handleDismiss(row.id)}
            className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary-hover text-muted-foreground border border-border text-[11px] font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )
    }
  ];

  const handleResolve = (id) => {
    if (confirm("Perform moderation resolution on reported item?")) {
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: "Resolved" } : r));
    }
  };

  const handleDismiss = (id) => {
    if (confirm("Dismiss this report record?")) {
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 select-none">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Content Moderation</h2>
          <p className="text-xs text-muted-foreground">Review flagged system accounts, messages, groups, and reports.</p>
        </div>

        <div className="glass p-6 rounded-xl border border-border">
          <DataTable 
            columns={columns} 
            data={reports} 
            searchableKey="reporter" 
            placeholder="Search by reporter..." 
          />
        </div>
      </div>
    </AdminLayout>
  );
}
