"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect root visitors to the Dashboard home
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#09090b]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center animate-pulse">
          <span className="text-[#09090b] font-bold text-xl">Z</span>
        </div>
        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Redirecting to Dashboard...</span>
      </div>
    </div>
  );
}
