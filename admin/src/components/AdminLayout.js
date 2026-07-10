"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [activeSegment, setActiveSegment] = useState("dashboard");
  const [role, setRole] = useState("admin");

  useEffect(() => {
    // Automatically determine active menu segment from pathname
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const segment = path.split("/")[1] || "dashboard";
      
      const savedRole = localStorage.getItem("zetto_current_role") || "admin";
      setRole(savedRole);

      // Enforce authorization checks: business role is restricted to developer and settings sections
      if (savedRole === "business" && segment !== "developer" && segment !== "settings" && segment !== "login") {
        const businessName = localStorage.getItem("zetto_current_business") || "Acme Corp";
        router.replace(`/developer?business=${encodeURIComponent(businessName)}&role=business`);
      } else {
        setActiveSegment(segment);
      }
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Premium Collapsible Navigation Sidebar */}
      <Sidebar activeSegment={activeSegment} role={role} />

      {/* Main Workspace Frame container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar with Action Utilities */}
        <Topbar title={activeSegment.charAt(0).toUpperCase() + activeSegment.slice(1)} />

        {/* Workspace Canvas Frame scrollable viewport */}
        <main className="flex-1 overflow-y-auto px-8 py-6 w-full max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
