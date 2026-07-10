"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Key, Sparkles, RefreshCw } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  // Dynamic business client accounts
  const [businesses, setBusinesses] = useState([
    { name: "Acme Corp", user: "acme", pass: "acme123" },
    { name: "Globex Industries", user: "globex", pass: "globex123" },
    { name: "Initech Systems", user: "initech", pass: "initech123" }
  ]);

  // Load custom accounts on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("zetto_sandbox_accounts");
      if (saved) {
        setBusinesses(JSON.parse(saved));
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    const userLower = username.toLowerCase().trim();
    
    setTimeout(() => {
      setLoading(false);
      
      // Check Super Admin first
      if (userLower === "admin" && password === "admin123") {
        localStorage.setItem("zetto_current_role", "admin");
        localStorage.removeItem("zetto_current_business");
        router.push("/dashboard");
        return;
      }

      // Check dynamic business registry
      const matchedBiz = businesses.find(b => b.user.toLowerCase() === userLower && b.pass === password);
      if (matchedBiz) {
        localStorage.setItem("zetto_current_role", "business");
        localStorage.setItem("zetto_current_business", matchedBiz.name);
        router.push(`/developer?business=${encodeURIComponent(matchedBiz.name)}&role=business`);
      } else {
        alert("Invalid credentials. Please select one of the sandbox credentials below or log in as admin.");
      }
    }, 800);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#09090b] text-foreground p-4">
      <div className="w-full max-w-md glass p-8 rounded-2xl border border-border flex flex-col gap-6 relative overflow-hidden shadow-2xl">
        
        {/* Glow decoration */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-[#09090b] font-black text-2xl">Z</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-extrabold tracking-tight text-xl">Welcome to Zetto Admin</span>
            <span className="text-xs text-muted-foreground font-medium">Premium Messaging Control Board</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-muted-foreground block">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs pl-10 pr-3.5 py-3 bg-secondary/40 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-muted-foreground block">Security Password</label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-3.5 py-3 bg-secondary/40 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-all font-mono"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-xs py-3 rounded-xl shadow-md hover:bg-primary/95 transition-all mt-2 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Unlock Session
              </>
            )}
          </button>
        </form>

        {/* Mock Credentials Sandbox Help */}
        <div className="text-left border-t border-border/40 pt-4 space-y-2">
          <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">Sandbox Login Accounts (Click to auto-fill):</span>
          
          <div className="max-h-[170px] overflow-y-auto pr-1 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground bg-secondary/20 p-2 rounded-lg border border-border/50 font-mono">
              <div 
                onClick={() => { setUsername("admin"); setPassword("admin123"); }}
                className="cursor-pointer hover:bg-primary/10 hover:text-foreground p-2 rounded-lg border border-transparent hover:border-primary/20 transition-all text-left col-span-2"
              >
                <span className="font-bold text-foreground">Super Admin</span><br />
                user: <span className="text-primary font-semibold">admin</span><br />
                pass: <span className="text-primary font-semibold">admin123</span>
              </div>
              
              {businesses.map((biz) => (
                <div 
                  key={biz.user}
                  onClick={() => { setUsername(biz.user); setPassword(biz.pass); }}
                  className="cursor-pointer hover:bg-primary/10 hover:text-foreground p-2 rounded-lg border border-transparent hover:border-primary/20 transition-all text-left"
                >
                  <span className="font-bold text-foreground truncate block">{biz.name}</span>
                  user: <span className="text-primary font-semibold">{biz.user}</span><br />
                  pass: <span className="text-primary font-semibold">{biz.pass}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-border/40">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Authorized Personnel Only</span>
        </div>
      </div>
    </div>
  );
}
