"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import Badge from "@/components/Badge";

export default function SettingsPage() {
  const [appName, setAppName] = useState("Zetto Messenger");
  const [registrations, setRegistrations] = useState(true);
  const [mediaLimit, setMediaLimit] = useState("16");
  const [msgLimit, setMsgLimit] = useState("4096");

  const handleSave = (e) => {
    e.preventDefault();
    alert("System configuration settings updated successfully!");
  };

  return (
    <AdminLayout>
      <div className="space-y-8 select-none">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">App settings</h2>
          <p className="text-xs text-muted-foreground">Adjust global parameters, messaging features, and media restrictions.</p>
        </div>

        <div className="glass p-6 rounded-xl border border-border max-w-2xl text-left">
          <form onSubmit={handleSave} className="space-y-6 text-xs font-semibold text-foreground">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground uppercase text-[10px] tracking-wider">Application Name</label>
                <input 
                  type="text" 
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full bg-[#121214] border border-border rounded-lg px-3.5 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground uppercase text-[10px] tracking-wider">Max Media Upload (MB)</label>
                <select 
                  value={mediaLimit}
                  onChange={(e) => setMediaLimit(e.target.value)}
                  className="w-full bg-[#121214] border border-border rounded-lg px-3.5 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="16">16 MB</option>
                  <option value="32">32 MB</option>
                  <option value="64">64 MB</option>
                  <option value="128">128 MB</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground uppercase text-[10px] tracking-wider">Max Message Length (chars)</label>
                <input 
                  type="number" 
                  value={msgLimit}
                  onChange={(e) => setMsgLimit(e.target.value)}
                  className="w-full bg-[#121214] border border-border rounded-lg px-3.5 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5 justify-center">
                <label className="text-muted-foreground uppercase text-[10px] tracking-wider mb-2">Registration Status</label>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setRegistrations(!registrations)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${registrations ? "bg-primary" : "bg-zinc-800"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-[#09090b] transition-transform duration-200 ${registrations ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                  <span className="text-xs text-muted-foreground">{registrations ? "New registrations active" : "Registrations locked"}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border/65 pt-5">
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-hover text-[#09090b] font-bold px-5 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Save configurations
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
