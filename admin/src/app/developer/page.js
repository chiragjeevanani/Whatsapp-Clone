"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import StatCard from "@/components/StatCard";
import { 
  Key, 
  Terminal, 
  Send, 
  FileText, 
  Activity, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Play, 
  RefreshCw, 
  AlertCircle,
  HelpCircle,
  FileCode2,
  Users2,
  Sliders,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Shield,
  Briefcase,
  CheckCircle,
  XCircle,
  Coins,
  Calendar,
  X
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip
} from "recharts";

export default function DeveloperPage() {
  // --- View Role Mode ---
  // "admin" = Super Admin (approves templates, manages keys across businesses)
  // "business" = Business Client (sends campaigns, views stats, requests templates)
  const [roleMode, setRoleMode] = useState("business");
  
  // Selected Business (for the Business client view or Admin context)
  const [selectedBusiness, setSelectedBusiness] = useState("Acme Corp");
  const [activeTab, setActiveTab] = useState("overview");

  // State flag for hydration sync
  const [mounted, setMounted] = useState(false);

  // --- Mock Data & States with LocalStorage Persistence ---

  // Businesses List (Dynamic Accounts)
  const [businesses, setBusinesses] = useState([
    { name: "Acme Corp", user: "acme", pass: "acme123" },
    { name: "Globex Industries", user: "globex", pass: "globex123" },
    { name: "Initech Systems", user: "initech", pass: "initech123" }
  ]);

  // API Keys
  const [apiKeys, setApiKeys] = useState([
    { id: "key_1", business: "Acme Corp", name: "Acme Production", token: "zetto_live_83f2a1b9d7c490a", scope: ["Send Messages", "Read Messages"], created: "2026-06-12", messageBalance: 5000, expiryDate: "2026-09-12", status: "Active" },
    { id: "key_2", business: "Globex Industries", name: "Globex Staging", token: "zetto_test_10d9e8c7b6a5f4e", scope: ["Send Messages"], created: "2026-07-01", messageBalance: 0, expiryDate: "2026-08-01", status: "Depleted" },
    { id: "key_3", business: "Acme Corp", name: "Acme Sandbox", token: "zetto_test_ff382bc194901ea", scope: ["Send Messages"], created: "2026-07-08", messageBalance: 2500, expiryDate: "2026-06-30", status: "Expired" }
  ]);

  // Templates
  const [templates, setTemplates] = useState([
    { id: "tpl_1", business: "Acme Corp", name: "welcome_alert", language: "English (US)", category: "UTILITY", body: "Hello {{1}}, welcome to Acme! Your registration was successful.", status: "Approved" },
    { id: "tpl_2", business: "Globex Industries", name: "delivery_update", language: "English (US)", category: "UTILITY", body: "Hi {{1}}, your order #{{2}} has been shipped and will arrive by {{3}}.", status: "Approved" },
    { id: "tpl_3", business: "Acme Corp", name: "summer_sale_promo", language: "English (US)", category: "MARKETING", body: "Flash Sale! Get {{1}}% off on all products. Use code {{2}} at checkout.", status: "Approved" },
    { id: "tpl_4", business: "Initech Systems", name: "system_downtime", language: "English (US)", category: "UTILITY", body: "Initech Alert: System maintenance scheduled for {{1}}.", status: "Pending Approval" }
  ]);

  // Campaigns
  const [campaigns, setCampaigns] = useState([
    { id: "cmp_1", business: "Acme Corp", name: "July Launch Promo", template: "summer_sale_promo", recipientsCount: 1500, status: "Completed", sentDate: "2026-07-08" },
    { id: "cmp_2", business: "Globex Industries", name: "Onboarding Batch", template: "delivery_update", recipientsCount: 380, status: "Completed", sentDate: "2026-07-09" }
  ]);

  // --- Load localStorage on mount ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBiz = localStorage.getItem("zetto_sandbox_accounts");
      const savedKeys = localStorage.getItem("zetto_api_keys_v3");
      const savedTemplates = localStorage.getItem("zetto_templates_v3");
      const savedCampaigns = localStorage.getItem("zetto_campaigns_v3");

      if (savedBiz) setBusinesses(JSON.parse(savedBiz));
      if (savedKeys) setApiKeys(JSON.parse(savedKeys));
      if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
      if (savedCampaigns) setCampaigns(JSON.parse(savedCampaigns));

      const params = new URLSearchParams(window.location.search);
      const role = params.get("role");
      const biz = params.get("business");
      if (role) setRoleMode(role);
      if (biz) setSelectedBusiness(biz);

      setMounted(true);
    }
  }, []);

  // Save states ONLY AFTER mounting has loaded stored values
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem("zetto_sandbox_accounts", JSON.stringify(businesses));
      localStorage.setItem("zetto_api_keys_v3", JSON.stringify(apiKeys));
      localStorage.setItem("zetto_templates_v3", JSON.stringify(templates));
      localStorage.setItem("zetto_campaigns_v3", JSON.stringify(campaigns));
    }
  }, [businesses, apiKeys, templates, campaigns, mounted]);

  // Copy helpers
  const [copiedId, setCopiedId] = useState(null);
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- Admin Functions ---
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyBusiness, setNewKeyBusiness] = useState("Acme Corp");
  const [newKeyScopes, setNewKeyScopes] = useState(["Send Messages"]);
  const [initialBalance, setInitialBalance] = useState("5000");
  const [expiryDays, setExpiryDays] = useState("30");

  const [newBizName, setNewBizName] = useState("");
  const [newBizUser, setNewBizUser] = useState("");
  const [newBizPass, setNewBizPass] = useState("");

  const handleCreateBusiness = (e) => {
    e.preventDefault();
    if (!newBizName.trim() || !newBizUser.trim() || !newBizPass.trim()) return;
    
    // Check if account already exists
    if (businesses.find(b => b.user.toLowerCase() === newBizUser.toLowerCase().trim())) {
      alert("Username already taken inside the Sandbox registry!");
      return;
    }

    const newAccount = {
      name: newBizName.trim(),
      user: newBizUser.toLowerCase().trim(),
      pass: newBizPass.trim()
    };

    setBusinesses([...businesses, newAccount]);
    setNewBizName("");
    setNewBizUser("");
    setNewBizPass("");
    alert("New Business Credentials created successfully! Available on login screen.");
  };

  const handleDeleteBusiness = (userToDelete) => {
    if (confirm("Are you sure you want to delete this business client account? All its sandbox login configs will be cleared.")) {
      setBusinesses(businesses.filter(b => b.user !== userToDelete));
    }
  };

  const handleCreateKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const randomHex = Math.random().toString(16).substring(2, 17);
    
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + Number(expiryDays));

    const newKey = {
      id: "key_" + Date.now(),
      business: newKeyBusiness,
      name: newKeyName,
      token: `zetto_live_${randomHex}`,
      scope: newKeyScopes,
      created: new Date().toISOString().split("T")[0],
      messageBalance: Number(initialBalance),
      expiryDate: expiry.toISOString().split("T")[0],
      status: "Active"
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
  };

  const handleToggleScope = (scope) => {
    if (newKeyScopes.includes(scope)) {
      setNewKeyScopes(newKeyScopes.filter(s => s !== scope));
    } else {
      setNewKeyScopes([...newKeyScopes, scope]);
    }
  };

  const handleDeleteKey = (id) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  const handleApproveTemplate = (id) => {
    setTemplates(templates.map(t => t.id === id ? { ...t, status: "Approved" } : t));
  };

  const handleRejectTemplate = (id) => {
    setTemplates(templates.map(t => t.id === id ? { ...t, status: "Rejected" } : t));
  };

  // --- Business Client Functions ---
  const [tplName, setTplName] = useState("");
  const [tplCategory, setTplCategory] = useState("UTILITY");
  const [tplBody, setTplBody] = useState("");

  const handleRequestTemplate = (e) => {
    e.preventDefault();
    if (!tplName.trim() || !tplBody.trim()) return;
    const newTpl = {
      id: "tpl_" + Date.now(),
      business: selectedBusiness,
      name: tplName.toLowerCase().replace(/\s+/g, "_"),
      language: "English (US)",
      category: tplCategory,
      body: tplBody,
      status: "Pending Approval"
    };
    setTemplates([...templates, newTpl]);
    setTplName("");
    setTplBody("");
    alert("Template submitted to Zetto Admin for approval!");
  };

  const [campName, setCampName] = useState("");
  const [campTemplate, setCampTemplate] = useState("");
  const [csvContent, setCsvContent] = useState("");
  const [campaignProgress, setCampaignProgress] = useState(null);
  const [currentProgressVal, setCurrentProgressVal] = useState(0);

  // Dynamic Key Recharge State
  const [rechargeTargetKey, setRechargeTargetKey] = useState(null);
  const [rechargeOption, setRechargeOption] = useState("add_5k");

  const handleRunCampaign = (e) => {
    e.preventDefault();
    if (!campName.trim() || !campTemplate) return;
    
    // Find first active, non-expired, non-depleted key for this business
    const businessKeys = apiKeys.filter(k => k.business === selectedBusiness);
    const activeKey = businessKeys.find(k => {
      const isExpired = new Date(k.expiryDate) < new Date();
      return k.messageBalance > 0 && !isExpired;
    });

    if (!activeKey) {
      alert("Campaign Dispatch Aborted: You do not have any Active API keys with a message balance. Please recharge or issue a new key.");
      return;
    }

    const lines = csvContent.split("\n").filter(line => line.trim().length > 0);
    const count = lines.length > 0 ? lines.length : 120;

    // Deduct message balance immediately or on dispatch complete
    const updatedKeys = apiKeys.map(k => {
      if (k.id === activeKey.id) {
        const remaining = Math.max(0, k.messageBalance - count);
        return {
          ...k,
          messageBalance: remaining,
          status: remaining <= 0 ? "Depleted" : k.status
        };
      }
      return k;
    });

    setApiKeys(updatedKeys);
    setCampaignProgress({ name: campName, total: count });
    setCurrentProgressVal(0);
  };

  useEffect(() => {
    if (campaignProgress) {
      const interval = setInterval(() => {
        setCurrentProgressVal(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            const completedCampaign = {
              id: "cmp_" + Date.now(),
              business: selectedBusiness,
              name: campaignProgress.name,
              template: campTemplate,
              recipientsCount: campaignProgress.total,
              status: "Completed",
              sentDate: new Date().toISOString().split("T")[0]
            };
            setCampaigns([completedCampaign, ...campaigns]);
            setCampaignProgress(null);
            setCampName("");
            setCampTemplate("");
            setCsvContent("");
            return 0;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [campaignProgress, campTemplate, campaigns, selectedBusiness]);

  // Handle Recharge Action
  const handleRechargeSubmit = (e) => {
    e.preventDefault();
    if (!rechargeTargetKey) return;

    const updatedKeys = apiKeys.map(k => {
      if (k.id === rechargeTargetKey.id) {
        let addedBalance = 0;
        let addedDays = 0;

        if (rechargeOption === "add_5k") addedBalance = 5000;
        if (rechargeOption === "add_20k") addedBalance = 20000;
        if (rechargeOption === "extend_30") addedDays = 30;
        if (rechargeOption === "extend_90") addedDays = 90;

        const currentExpiry = new Date(k.expiryDate);
        const baseDate = currentExpiry < new Date() ? new Date() : currentExpiry;
        if (addedDays > 0) {
          baseDate.setDate(baseDate.getDate() + addedDays);
        }

        const newBalance = k.messageBalance + addedBalance;
        const newExpiryDate = baseDate.toISOString().split("T")[0];

        return {
          ...k,
          messageBalance: newBalance,
          expiryDate: newExpiryDate,
          status: (newBalance > 0 && new Date(newExpiryDate) >= new Date()) ? "Active" : k.status
        };
      }
      return k;
    });

    setApiKeys(updatedKeys);
    setRechargeTargetKey(null);
    alert("API Key recharged successfully! Status set to Active.");
  };

  // --- Filtering based on Role View ---
  const currentBusinessKeys = apiKeys.filter(k => k.business === selectedBusiness);
  const currentBusinessTemplates = templates.filter(t => t.business === selectedBusiness);
  const currentBusinessCampaigns = campaigns.filter(c => c.business === selectedBusiness);

  // Stats specific to the active business or global
  const activeDeliveriesCount = roleMode === "admin"
    ? campaigns.reduce((acc, c) => acc + c.recipientsCount, 0)
    : currentBusinessCampaigns.reduce((acc, c) => acc + c.recipientsCount, 0);

  const MOCK_API_USAGE = [
    { name: "Mon", calls: roleMode === "admin" ? 18000 : 5400 },
    { name: "Tue", calls: roleMode === "admin" ? 22000 : 6100 },
    { name: "Wed", calls: roleMode === "admin" ? 21000 : 5900 },
    { name: "Thu", calls: roleMode === "admin" ? 28000 : 7800 },
    { name: "Fri", calls: roleMode === "admin" ? 31000 : 8900 },
    { name: "Sat", calls: roleMode === "admin" ? 24000 : 6200 },
    { name: "Sun", calls: roleMode === "admin" ? 38000 : 9200 }
  ];

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
      <div className="space-y-6">
        
        {/* Simulator Control Board */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5 text-primary" />
            <div className="text-left">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block">Simulator Sandbox</span>
              <span className="text-xs text-muted-foreground">Switch personas to simulate Admin approvals vs Business Client campaign dispatches.</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-background border border-border/80 p-1.5 rounded-lg">
            <button
              onClick={() => { setRoleMode("business"); setActiveTab("overview"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                roleMode === "business" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Business Dashboard
            </button>
            <button
              onClick={() => { setRoleMode("admin"); setActiveTab("overview"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                roleMode === "admin" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Super Admin View
            </button>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {roleMode === "admin" ? "Super Controls" : "Client Portal"}
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                {roleMode === "admin" ? "Developer Operations" : `${selectedBusiness} API Panel`}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {roleMode === "admin" 
                ? "Manage developers credentials, approve marketing templates, and audit platform traffic." 
                : "Generate API credentials, request message templates, and run target promotional campaigns."}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {roleMode === "business" && (
              <select
                value={selectedBusiness}
                onChange={(e) => setSelectedBusiness(e.target.value)}
                className="text-xs px-3 py-2 bg-background border border-border rounded-lg text-foreground font-semibold focus:outline-none focus:border-primary"
              >
                {businesses.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
              </select>
            )}
            <button 
              onClick={() => setActiveTab("docs")} 
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                activeTab === "docs" 
                  ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                  : "bg-secondary text-foreground hover:bg-secondary/80 border-border"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              API References
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-border/40 gap-1 overflow-x-auto pb-px">
          {(roleMode === "admin" 
            ? [
                { id: "overview", label: "Overview", icon: Activity },
                { id: "keys", label: "API Keys Manager", icon: Key },
                { id: "accounts", label: "Client Accounts", icon: Users2 },
                { id: "templates", label: "Template Approvals", icon: FileText },
                { id: "campaigns", label: "Platform Campaigns", icon: Send }
              ]
            : [
                { id: "overview", label: "Overview", icon: Activity },
                { id: "keys", label: "API Credentials", icon: Key },
                { id: "templates", label: "Templates Manager", icon: FileText },
                { id: "campaigns", label: "Campaigns Builder", icon: Send }
              ]
          ).map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  isSelected 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Panel Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <StatCard 
                title={roleMode === "admin" ? "Total Messages Sent (All)" : "Delivered Messages"} 
                value={(activeDeliveriesCount + (roleMode === "admin" ? 284000 : 42100)).toLocaleString()} 
                change="+14.2%" 
                icon={MessageSquare} 
              />
              <StatCard 
                title={roleMode === "admin" ? "Global API Credentials" : "Business API Keys"} 
                value={roleMode === "admin" ? apiKeys.length.toString() : currentBusinessKeys.length.toString()} 
                change="Active" 
                icon={Key} 
              />
              <StatCard 
                title="Webhook Latency" 
                value="99.9%" 
                change="0.2ms latency" 
                icon={TrendingUp} 
              />
            </div>

            {/* Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass p-6 rounded-xl border border-border flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-foreground">API Load Traffic</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">API request loads simulated for the current scope.</p>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_API_USAGE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#121214", borderColor: "#27272a", fontSize: 11 }} />
                      <Area type="monotone" dataKey="calls" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorCalls)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Endpoint Status */}
              <div className="glass p-6 rounded-xl border border-border flex flex-col justify-between gap-4">
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-bold tracking-tight text-foreground">Active Interface Services</h3>
                  <div className="space-y-3">
                    {[
                      { route: "POST /v1/messages", status: "Operational", time: "18ms", load: "High" },
                      { route: "POST /v1/templates", status: "Operational", time: "42ms", load: "Low" },
                      { route: "GET /v1/analytics", status: "Operational", time: "120ms", load: "Medium" }
                    ].map((api, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border/40 text-xs">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-foreground font-mono">{api.route}</span>
                          <span className="text-[10px] text-muted-foreground">{api.load} Load</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-emerald-400 font-semibold block">{api.status}</span>
                          <span className="text-[10px] text-muted-foreground">{api.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 pt-2 border-t border-border/20">
                  <AlertCircle className="w-3.5 h-3.5 text-primary" />
                  Rates reset dynamically at midnight.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "keys" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Keys Creator (Super Admin Only) */}
            {roleMode === "admin" ? (
              <div className="glass p-6 rounded-xl border border-border h-fit">
                <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" /> Generate Client Key
                </h3>
                <form onSubmit={handleCreateKey} className="space-y-4 mt-4 text-left">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Select Business Account</label>
                    <select
                      value={newKeyBusiness}
                      onChange={(e) => setNewKeyBusiness(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                    >
                      {businesses.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Token Name / Description</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Production Key"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Initial Messages</label>
                      <input
                        type="number"
                        required
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Expiry Period</label>
                      <select
                        value={expiryDays}
                        onChange={(e) => setExpiryDays(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                      >
                        <option value="7">7 Days</option>
                        <option value="30">30 Days</option>
                        <option value="90">90 Days</option>
                        <option value="365">1 Year</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-2">Scope Permissions</label>
                    <div className="space-y-2">
                      {["Send Messages", "Read Messages", "Manage Templates"].map(scope => {
                        const isSelected = newKeyScopes.includes(scope);
                        return (
                          <button
                            type="button"
                            key={scope}
                            onClick={() => handleToggleScope(scope)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition-all ${
                              isSelected 
                                ? "bg-primary/10 border-primary text-primary font-medium" 
                                : "bg-secondary border-border text-muted-foreground"
                            }`}
                          >
                            <span>{scope}</span>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-xs py-2.5 rounded-lg shadow hover:bg-primary/95 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Issue Token
                  </button>
                </form>
              </div>
            ) : (
              <div className="glass p-6 rounded-xl border border-border h-fit text-left space-y-3">
                <Shield className="w-8 h-8 text-primary" />
                <h3 className="text-sm font-bold tracking-tight text-foreground">Business API Keys Info</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your credentials are created and managed by Zetto Administrators. If you need a new token, scope expansion, or key rotation, please contact your platform manager.
                </p>
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Active Client Profile</span>
                  <span className="text-xs font-semibold text-foreground">{selectedBusiness}</span>
                </div>
              </div>
            )}

            {/* Issued Credentials List */}
            <div className="lg:col-span-2 glass p-6 rounded-xl border border-border flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-primary" /> 
                  {roleMode === "admin" ? "Global Issued Credentials" : `${selectedBusiness} API Keys`}
                </h3>
                <div className="space-y-4 mt-5">
                  {(roleMode === "admin" ? apiKeys : currentBusinessKeys).length === 0 ? (
                    <div className="text-center py-10">
                      <HelpCircle className="w-8 h-8 text-muted-foreground/60 mx-auto" />
                      <p className="text-xs text-muted-foreground mt-2">No active API keys found.</p>
                    </div>
                  ) : (
                    (roleMode === "admin" ? apiKeys : currentBusinessKeys).map(key => {
                      const isExpired = new Date(key.expiryDate) < new Date();
                      const currentStatus = key.messageBalance <= 0 
                        ? "Depleted" 
                        : isExpired 
                          ? "Expired" 
                          : "Active";

                      return (
                        <div key={key.id} className="p-4 rounded-xl bg-secondary/40 border border-border/50 space-y-3">
                          <div className="flex justify-between items-start text-left">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-foreground">{key.name}</span>
                                {roleMode === "admin" && (
                                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[9px] font-bold uppercase">{key.business}</span>
                                )}
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                  currentStatus === "Active" ? "bg-emerald-500/10 text-emerald-400" :
                                  currentStatus === "Expired" ? "bg-red-500/10 text-red-400" :
                                  "bg-amber-500/10 text-amber-400"
                                }`}>
                                  {currentStatus}
                                </span>
                              </div>
                              <div className="flex gap-1.5 mt-1.5">
                                {key.scope.map(s => (
                                  <span key={s} className="bg-secondary text-muted-foreground px-2 py-0.5 rounded text-[9px] font-semibold">{s}</span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              {roleMode === "business" && (
                                <button
                                  onClick={() => setRechargeTargetKey(key)}
                                  className="flex items-center gap-1 text-[9px] font-bold bg-primary text-primary-foreground px-2.5 py-1 rounded hover:bg-primary/90 transition-all"
                                >
                                  <Coins className="w-3 h-3" /> Recharge
                                </button>
                              )}
                              {roleMode === "admin" && (
                                <button 
                                  onClick={() => handleDeleteKey(key.id)}
                                  className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Balance & Expiry details */}
                          <div className="grid grid-cols-2 gap-4 bg-secondary/20 p-2.5 rounded-lg text-xs text-left">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Coins className="w-3.5 h-3.5 text-primary" />
                              <div>
                                <span className="text-[10px] block font-semibold uppercase">Remaining Balance</span>
                                <span className="font-bold text-foreground font-mono">{key.messageBalance.toLocaleString()} messages</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5 text-primary" />
                              <div>
                                <span className="text-[10px] block font-semibold uppercase">Expiry Date</span>
                                <span className="font-bold text-foreground">{key.expiryDate}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 bg-zinc-950 border border-border/40 p-2.5 rounded-lg font-mono text-[10px] text-zinc-200 justify-between">
                            <span className="truncate">{key.token}</span>
                            <button 
                              onClick={() => copyToClipboard(key.token, key.id)}
                              className="text-primary hover:text-primary/80 transition-all p-1"
                            >
                              {copiedId === key.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Client Accounts Management Tab (Admin Only) */}
        {activeTab === "accounts" && roleMode === "admin" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-xl border border-border h-fit">
              <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-primary" /> Create Business Account
              </h3>
              <form onSubmit={handleCreateBusiness} className="space-y-4 mt-4 text-left">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Business Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wayne Enterprises"
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Client Username</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. wayne"
                    value={newBizUser}
                    onChange={(e) => setNewBizUser(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Client Password</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. wayne123"
                    value={newBizPass}
                    onChange={(e) => setNewBizPass(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-xs py-2.5 rounded-lg shadow hover:bg-primary/95 transition-all"
                >
                  Create Account Credentials
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 glass p-6 rounded-xl border border-border">
              <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                <Users2 className="w-4 h-4 text-primary" /> Active Sandbox Registries
              </h3>
              <div className="space-y-4 mt-5">
                {businesses.map((biz) => (
                  <div key={biz.user} className="flex justify-between items-center p-4 rounded-xl bg-secondary/40 border border-border/50 text-left">
                    <div>
                      <span className="text-xs font-bold text-foreground block">{biz.name}</span>
                      <div className="flex gap-4 mt-1.5 text-[10px] text-muted-foreground font-mono">
                        <span>Username: <strong className="text-foreground">{biz.user}</strong></span>
                        <span>Password: <strong className="text-foreground">{biz.pass}</strong></span>
                      </div>
                    </div>
                    {biz.user !== "acme" && biz.user !== "globex" && biz.user !== "initech" && (
                      <button 
                        onClick={() => handleDeleteBusiness(biz.user)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create/Request Template */}
            {roleMode === "business" ? (
              <div className="glass p-6 rounded-xl border border-border h-fit">
                <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-primary" /> Request New Template
                </h3>
                <form onSubmit={handleRequestTemplate} className="space-y-4 mt-4 text-left">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Template Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. loyalty_promo"
                      value={tplName}
                      onChange={(e) => setTplName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Category</label>
                    <select
                      value={tplCategory}
                      onChange={(e) => setTplCategory(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="UTILITY">UTILITY</option>
                      <option value="MARKETING">MARKETING</option>
                      <option value="AUTHENTICATION">AUTHENTICATION</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Template Body Content</label>
                      <span className="text-[10px] text-primary/80 font-mono">Use {"{{1}}"} for parameters</span>
                    </div>
                    <textarea
                      required
                      rows={4}
                      placeholder="Hello {{1}}, your order total is {{2}}."
                      value={tplBody}
                      onChange={(e) => setTplBody(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none font-sans"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-xs py-2.5 rounded-lg shadow hover:bg-primary/95 transition-all"
                  >
                    Submit for Approval
                  </button>
                </form>
              </div>
            ) : (
              <div className="glass p-6 rounded-xl border border-border h-fit text-left space-y-3">
                <Shield className="w-8 h-8 text-primary" />
                <h3 className="text-sm font-bold tracking-tight text-foreground">Platform Moderation</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  As Zetto Super Admin, you review custom templates submitted by businesses. Approve templates to let clients use them in active campaigns immediately, or reject inappropriate items.
                </p>
              </div>
            )}

            {/* Template List & Approvals */}
            <div className="lg:col-span-2 glass p-6 rounded-xl border border-border flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primary" /> 
                  {roleMode === "admin" ? "Template Submissions Audit" : `${selectedBusiness} Templates`}
                </h3>
                
                <div className="space-y-4 mt-5">
                  {(roleMode === "admin" ? templates : currentBusinessTemplates).map(tpl => (
                    <div key={tpl.id} className="p-4 rounded-xl bg-secondary/40 border border-border/50 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground font-mono">{tpl.name}</span>
                          <span className={`text-[9px] px-2 py-0.5 font-bold rounded-full ${
                            tpl.category === "MARKETING" ? "bg-amber-400/10 text-amber-400" : "bg-primary/10 text-primary"
                          }`}>
                            {tpl.category}
                          </span>
                          {roleMode === "admin" && (
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[9px] font-bold uppercase">{tpl.business}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            tpl.status === "Approved" ? "bg-emerald-500/10 text-emerald-400" :
                            tpl.status === "Rejected" ? "bg-red-500/10 text-red-400" :
                            "bg-amber-500/10 text-amber-400"
                          }`}>
                            {tpl.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-foreground bg-secondary/60 p-3 rounded-lg border border-border/40 leading-relaxed text-left">
                        {tpl.body}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
                          Language: {tpl.language}
                        </span>
                        
                        {roleMode === "admin" && tpl.status === "Pending Approval" && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleApproveTemplate(tpl.id)}
                              className="flex items-center gap-1 text-[9px] font-bold bg-emerald-500 text-white px-2 py-1 rounded hover:bg-emerald-600 transition-all"
                            >
                              <CheckCircle className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={() => handleRejectTemplate(tpl.id)}
                              className="flex items-center gap-1 text-[9px] font-bold bg-destructive text-destructive-foreground px-2 py-1 rounded hover:bg-destructive/90 transition-all"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create Campaign (Business Only) */}
            {roleMode === "business" ? (
              <div className="glass p-6 rounded-xl border border-border h-fit">
                <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-primary" /> Setup Campaign Dispatch
                </h3>
                
                {campaignProgress ? (
                  <div className="py-10 text-center space-y-4">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-foreground">Broadcasting Campaign</p>
                      <p className="text-[10px] text-muted-foreground">Sending {campaignProgress.total} promotional messages...</p>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden border border-border/60">
                      <div 
                        className="bg-primary h-full transition-all duration-200" 
                        style={{ width: `${currentProgressVal}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-mono text-primary font-semibold">{currentProgressVal}% complete</span>
                  </div>
                ) : (
                  <form onSubmit={handleRunCampaign} className="space-y-4 mt-4 text-left">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Campaign Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Summer Launch Promo"
                        value={campName}
                        onChange={(e) => setCampName(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Select Approved Template</label>
                      <select
                        required
                        value={campTemplate}
                        onChange={(e) => setCampTemplate(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                      >
                        <option value="">-- Choose Template --</option>
                        {currentBusinessTemplates.filter(t => t.status === "Approved").map(tpl => (
                          <option key={tpl.id} value={tpl.name}>{tpl.name} ({tpl.category})</option>
                        ))}
                      </select>
                      {currentBusinessTemplates.filter(t => t.status === "Approved").length === 0 && (
                        <span className="text-[9px] text-destructive block mt-1.5 text-left">No approved templates available. Please create and wait for admin approval first.</span>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Recipient Contacts List</label>
                        <span className="text-[10px] text-muted-foreground font-mono">1 line per phone number</span>
                      </div>
                      <textarea
                        rows={5}
                        placeholder="+919999999999&#10;+918888888888&#10;+917777777777"
                        value={csvContent}
                        onChange={(e) => setCsvContent(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none font-mono"
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={currentBusinessTemplates.filter(t => t.status === "Approved").length === 0}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-xs py-2.5 rounded-lg shadow hover:bg-primary/95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="w-3.5 h-3.5" /> Dispatch Campaign
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="glass p-6 rounded-xl border border-border h-fit text-left space-y-3">
                <Shield className="w-8 h-8 text-primary" />
                <h3 className="text-sm font-bold tracking-tight text-foreground">Campaign Audit Controls</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Platform Administrators monitor total messages sent across all client campaigns. Use this view to review client traffic and check throughput statistics.
                </p>
              </div>
            )}

            {/* Campaign Logs */}
            <div className="lg:col-span-2 glass p-6 rounded-xl border border-border flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-primary" /> Campaign Logs
                </h3>
                <div className="space-y-4 mt-5 font-left">
                  {(roleMode === "admin" ? campaigns : currentBusinessCampaigns).map(camp => (
                    <div key={camp.id} className="p-4 rounded-xl bg-secondary/40 border border-border/50 space-y-3 text-left">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">{camp.name}</span>
                            {roleMode === "admin" && (
                              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[9px] font-bold uppercase">{camp.business}</span>
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">Template: {camp.template}</div>
                        </div>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          {camp.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-border/20">
                        <span className="text-muted-foreground font-semibold">Recipients: <span className="text-foreground">{camp.recipientsCount.toLocaleString()}</span></span>
                        <span className="text-muted-foreground font-semibold uppercase">{camp.sentDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documentation Drawer/Tab */}
        {activeTab === "docs" && (
          <div className="glass p-6 rounded-xl border border-border text-left space-y-6">
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h3 className="text-base font-extrabold tracking-tight text-foreground flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-primary" /> API Reference Documentation
              </h3>
              <button 
                onClick={() => setActiveTab("overview")} 
                className="text-xs font-semibold text-primary hover:underline"
              >
                Close Docs
              </button>
            </div>

            <div className="space-y-6 text-sm text-foreground">
              {/* Sending Messages API */}
              <div className="space-y-3 text-left">
                <h4 className="text-sm font-bold text-foreground">1. Send Text Message</h4>
                <p className="text-xs text-muted-foreground">Send custom or transactional text notifications dynamically via HTTPS POST request.</p>
                <div className="p-3 bg-zinc-950 border border-border/60 rounded-lg text-xs font-mono select-all overflow-x-auto text-[#06b6d4]">
                  curl -X POST https://api.zetto.com/v1/messages \<br />
                  &nbsp;&nbsp;-H "Authorization: Bearer zetto_live_YOUR_KEY" \<br />
                  &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                  &nbsp;&nbsp;{"-d '{\"to\": \"+919999999999\", \"message\": \"Hi, your OTP code is 9128.\"}'"}
                </div>
              </div>

              {/* Sending Template Campaigns */}
              <div className="space-y-3 text-left">
                <h4 className="text-sm font-bold text-foreground">2. Send Template Message</h4>
                <p className="text-xs text-muted-foreground">Use approved templates for automated utility or customer support messages.</p>
                <div className="p-3 bg-zinc-950 border border-border/60 rounded-lg text-xs font-mono select-all overflow-x-auto text-[#06b6d4]">
                  curl -X POST https://api.zetto.com/v1/messages \<br />
                  &nbsp;&nbsp;-H "Authorization: Bearer zetto_live_YOUR_KEY" \<br />
                  &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                  &nbsp;&nbsp;{"-d '{\"to\": \"+919999999999\", \"template\": \"welcome_alert\", \"parameters\": [\"Chirag\"]}'"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Key Recharge Dialog Overlay */}
      {rechargeTargetKey && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 text-left relative">
            <button 
              onClick={() => setRechargeTargetKey(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Coins className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-extrabold text-sm text-foreground">Recharge API Key</h3>
                <span className="text-[10px] text-muted-foreground">Key ID: {rechargeTargetKey.name}</span>
              </div>
            </div>

            <form onSubmit={handleRechargeSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">Select Recharge Package</label>
                <div className="space-y-2.5">
                  {[
                    { id: "add_5k", label: "Add 5,000 Messages", price: "$10.00" },
                    { id: "add_20k", label: "Add 20,000 Messages", price: "$30.00" },
                    { id: "extend_30", label: "Extend Expiry by 30 Days", price: "$5.00" },
                    { id: "extend_90", label: "Extend Expiry by 90 Days", price: "$12.00" }
                  ].map(option => (
                    <button
                      type="button"
                      key={option.id}
                      onClick={() => setRechargeOption(option.id)}
                      className={`w-full flex justify-between items-center p-3 rounded-xl border text-xs transition-all ${
                        rechargeOption === option.id 
                          ? "border-primary bg-primary/10 text-primary font-bold" 
                          : "border-border bg-secondary/20 text-muted-foreground"
                      }`}
                    >
                      <span>{option.label}</span>
                      <span>{option.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground leading-relaxed bg-secondary/35 p-3 rounded-lg flex gap-2">
                <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                Recharges process instantly in mock payment mode. Status transitions back to Active.
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-bold text-xs py-2.5 rounded-xl hover:bg-primary/95 transition-all shadow-md"
              >
                Confirm Recharge & Pay
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
