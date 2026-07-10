"use client";

import React, { use, useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function AdminLayout({ children }) {
  const [activeSegment, setActiveSegment] = useState("dashboard");

  useEffect(() => {
    // Automatically determine active menu segment from pathname
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const segment = path.split("/")[1] || "dashboard";
      setActiveSegment(segment);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Premium Collapsible Navigation Sidebar */}
      <Sidebar activeSegment={activeSegment} />

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
