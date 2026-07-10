"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";

export default function LogsPage() {
  const [logs, setLogs] = useState([
    { id: 1, action: "AUTH_LOGIN", detail: "Admin Principal signed in from IP 192.168.1.15", severity: "INFO", time: "Today, 14:50" },
    { id: 2, action: "USER_BAN", detail: "Account @free_crypto_bot banned permanently for spam", severity: "WARN", time: "Today, 10:14" },
    { id: 3, action: "CONFIG_CHANGE", detail: "Global upload limit changed from 16MB to 32MB", severity: "INFO", time: "Yesterday, 18:20" },
    { id: 4, action: "API_ERROR", detail: "SMS gateway provider returned validation error code 429", severity: "ERROR", time: "Yesterday, 11:05" }
  ]);

  const columns = [
    {
      key: "time",
      label: "Timestamp",
      sortable: true
    },
    {
      key: "action",
      label: "System Event",
      sortable: true,
      render: (row) => <span className="font-mono text-primary font-bold">{row.action}</span>
    },
    {
      key: "detail",
      label: "Logs Detail",
      render: (row) => <span className="text-muted-foreground">{row.detail}</span>
    },
    {
      key: "severity",
      label: "Severity",
      sortable: true,
      render: (row) => (
        <Badge variant={row.severity === "ERROR" ? "danger" : row.severity === "WARN" ? "warning" : "success"}>
          {row.severity}
        </Badge>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 select-none">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">System Audit Trail</h2>
          <p className="text-xs text-muted-foreground">Audit administrative actions, login details, and API transaction logs.</p>
        </div>

        <div className="glass p-6 rounded-xl border border-border">
          <DataTable 
            columns={columns} 
            data={logs} 
            searchableKey="action" 
            placeholder="Filter by event name..." 
          />
        </div>
      </div>
    </AdminLayout>
  );
}
