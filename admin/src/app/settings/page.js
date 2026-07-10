"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { User, Lock, Key, Shield, Sparkles, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState("admin");
  const [currentBusinessName, setCurrentBusinessName] = useState("");

  // Super Admin App Configs State
  const [appName, setAppName] = useState("Zetto Messenger");
  const [registrations, setRegistrations] = useState(true);
  const [mediaLimit, setMediaLimit] = useState("16");
  const [msgLimit, setMsgLimit] = useState("4096");

  // Business Account state
  const [businesses, setBusinesses] = useState([]);
  const [activeBusiness, setActiveBusiness] = useState(null);

  // Business profile/pass forms
  const [displayName, setDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("zetto_current_role") || "admin";
      const savedBusinessName = localStorage.getItem("zetto_current_business") || "";
      const savedBizList = localStorage.getItem("zetto_sandbox_accounts");

      setRole(savedRole);
      setCurrentBusinessName(savedBusinessName);

      if (savedBizList) {
        const parsedList = JSON.parse(savedBizList);
        setBusinesses(parsedList);
        
        // Find matching active account
        const matched = parsedList.find(b => b.name === savedBusinessName);
        if (matched) {
          setActiveBusiness(matched);
          setDisplayName(matched.name);
        }
      }

      setMounted(true);
    }
  }, []);

  // Handle Admin Configurations Save
  const handleAdminSave = (e) => {
    e.preventDefault();
    alert("System configuration settings updated successfully!");
  };

  // Handle Business Settings/Password Change Save
  const handleBusinessSave = (e) => {
    e.preventDefault();
    if (!activeBusiness) return;

    // Validate current password
    if (currentPassword !== activeBusiness.pass) {
      alert("Verification Failed: Current password does not match.");
      return;
    }

    // Validate new password matching
    if (newPassword && newPassword !== confirmPassword) {
      alert("Validation Error: New passwords do not match.");
      return;
    }

    const updatedBusinesses = businesses.map(b => {
      if (b.user === activeBusiness.user) {
        return {
          ...b,
          name: displayName.trim() || b.name,
          pass: newPassword ? newPassword : b.pass
        };
      }
      return b;
    });

    // Save updated credentials
    setBusinesses(updatedBusinesses);
    localStorage.setItem("zetto_sandbox_accounts", JSON.stringify(updatedBusinesses));
    
    // Update current session metadata if name changed
    if (displayName.trim() && displayName.trim() !== activeBusiness.name) {
      localStorage.setItem("zetto_current_business", displayName.trim());
      
      // Update template registry references and key registry references
      const savedKeys = localStorage.getItem("zetto_api_keys_v3");
      const savedTemplates = localStorage.getItem("zetto_templates_v3");
      const savedCampaigns = localStorage.getItem("zetto_campaigns_v3");

      if (savedKeys) {
        const updatedKeys = JSON.parse(savedKeys).map(k => k.business === activeBusiness.name ? { ...k, business: displayName.trim() } : k);
        localStorage.setItem("zetto_api_keys_v3", JSON.stringify(updatedKeys));
      }
      if (savedTemplates) {
        const updatedTpls = JSON.parse(savedTemplates).map(t => t.business === activeBusiness.name ? { ...t, business: displayName.trim() } : t);
        localStorage.setItem("zetto_templates_v3", JSON.stringify(updatedTpls));
      }
      if (savedCampaigns) {
        const updatedCamps = JSON.parse(savedCampaigns).map(c => c.business === activeBusiness.name ? { ...c, business: displayName.trim() } : c);
        localStorage.setItem("zetto_campaigns_v3", JSON.stringify(updatedCamps));
      }
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    alert("Profile and password settings updated successfully!");
    window.location.reload(); // Refresh session layout context
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#09090b]">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center animate-pulse">
          <span className="text-[#09090b] font-bold text-xl">Z</span>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 select-none text-left">
        <div className="flex flex-col gap-1.5 border-b border-border/40 pb-5">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            {role === "admin" ? "Global System Settings" : "Business Profile Settings"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {role === "admin" 
              ? "Adjust global parameters, messaging features, and media restrictions." 
              : "Update your business credentials, credentials description, and change account passwords."}
          </p>
        </div>

        {role === "admin" ? (
          /* Super Admin App Settings */
          <div className="glass p-6 rounded-xl border border-border max-w-2xl">
            <form onSubmit={handleAdminSave} className="space-y-6 text-xs font-semibold text-foreground">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground uppercase text-[10px] tracking-wider">Application Name</label>
                  <input 
                    type="text" 
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground uppercase text-[10px] tracking-wider">Max Media Upload (MB)</label>
                  <select 
                    value={mediaLimit}
                    onChange={(e) => setMediaLimit(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2 text-foreground focus:outline-none focus:border-primary"
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
                    className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2 text-foreground focus:outline-none focus:border-primary"
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

              <div className="border-t border-border/40 pt-5">
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer text-xs"
                >
                  Save app configurations
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Business Profile Settings & Change Password */
          <div className="glass p-6 rounded-xl border border-border max-w-2xl">
            {activeBusiness ? (
              <form onSubmit={handleBusinessSave} className="space-y-6 text-xs font-semibold text-foreground">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Account Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground uppercase text-[10px] tracking-wider flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-primary" /> Business display Name
                    </label>
                    <input 
                      type="text" 
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2 text-foreground focus:outline-none focus:border-primary font-medium"
                    />
                  </div>

                  {/* Username (Locked) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground uppercase text-[10px] tracking-wider flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-primary" /> Sandbox Login Username
                    </label>
                    <input 
                      type="text" 
                      disabled
                      value={activeBusiness.user}
                      className="w-full bg-secondary/50 border border-border rounded-lg px-3.5 py-2 text-muted-foreground focus:outline-none cursor-not-allowed font-mono"
                    />
                  </div>
                </div>

                <div className="border-t border-border/40 pt-5 space-y-4">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">Security Credentials Update</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Current password */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-muted-foreground uppercase text-[10px] tracking-wider">Current Password</label>
                      <input 
                        type="password" 
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2 text-foreground focus:outline-none focus:border-primary font-mono"
                      />
                    </div>

                    <div className="hidden md:block"></div>

                    {/* New password */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-muted-foreground uppercase text-[10px] tracking-wider">New Password (Optional)</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2 text-foreground focus:outline-none focus:border-primary font-mono"
                      />
                    </div>

                    {/* Confirm new password */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-muted-foreground uppercase text-[10px] tracking-wider">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2 text-foreground focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/40 pt-5">
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer text-xs"
                  >
                    Save business credentials
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Account profile registry missing. Log in through the sandbox registry first.
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
