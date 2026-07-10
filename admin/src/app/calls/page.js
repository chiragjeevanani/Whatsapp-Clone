"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import { MOCK_CALLS } from "@/lib/mockData";

export default function CallsPage() {
  const [calls, setCalls] = useState(MOCK_CALLS);

  const columns = [
    {
      key: "caller",
      label: "Initiator",
      sortable: true
    },
    {
      key: "receiver",
      label: "Recipient",
      sortable: true
    },
    {
      key: "type",
      label: "Call Type",
      sortable: true,
      render: (row) => (
        <Badge variant="info">
          {row.type}
        </Badge>
      )
    },
    {
      key: "duration",
      label: "Duration",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === "Completed" ? "success" : "danger"}>
          {row.status}
        </Badge>
      )
    },
    {
      key: "date",
      label: "Call Time",
      sortable: true
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 select-none">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Call Session Records</h2>
          <p className="text-xs text-muted-foreground">Monitor voice and video session connectivity logs.</p>
        </div>

        <div className="glass p-6 rounded-xl border border-border">
          <DataTable 
            columns={columns} 
            data={calls} 
            searchableKey="caller" 
            placeholder="Search by initiator..." 
          />
        </div>
      </div>
    </AdminLayout>
  );
}
