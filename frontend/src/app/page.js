"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // Force light theme on welcome screen
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    if (isDark) {
      html.classList.remove("dark");
    }
    return () => {
      // Re-enable dark theme if it was set in localStorage or by system preference
      const storedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
        html.classList.add("dark");
      }
    };
  }, []);

  useEffect(() => {
    // Redirect if already logged in
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/chats");
    }
  }, [router]);

  const handleAgree = useCallback(() => {
    router.push("/login");
  }, [router]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-10 py-8 w-full max-w-md mx-auto min-h-screen">
      {/* Illustration */}
      <div className="mb-8 w-full max-w-[280px] aspect-square rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden shadow-sm relative group">
        <img
          alt="Connectivity Illustration"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFyMdxP0Fj0oErfa8bs_tM7YaCIJNp474oXvofCsy1NXkNnsDqchpHRpkgDDuuL2-2PeZQNGVKyOli0Dwf0eemNtiKKxR-ElFhk4jranw8UTwcN3SErUnNd4Z1zIrqdbnqJ3aq8otsjpTUDV9NJPpEweKaXuoLVrASA5iGcGx8VWWkkNW3TuIFmKgYMkgUfUyuFkxTMz-LOulPgxCLJ_nG_29-XpVGIBPlxBV5Y0m8Br-NOM-dOGRY7GkdvJd5wKkBO_G4KKCdqaI"
          decoding="async"
        />
      </div>

      {/* Typography */}
      <div className="text-center mb-8 w-full">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-display-lg md:text-display-lg text-on-surface mb-4">
          Welcome to Premium Messenger
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[300px] mx-auto">
          Fast, simple, and secure messaging across all your devices.
        </p>
      </div>

      {/* Action Area */}
      <div className="w-full flex flex-col gap-4 items-center mt-auto">
        {/* Terms and Privacy */}
        <p className="font-label-md text-label-md text-on-surface-variant text-center max-w-[320px]">
          Read our{" "}
          <Link href="#" className="text-primary hover:underline underline-offset-2">
            Privacy Policy
          </Link>
          . Tap &quot;Agree and continue&quot; to accept the{" "}
          <Link href="#" className="text-primary hover:underline underline-offset-2">
            Terms of Service
          </Link>
          .
        </p>

        {/* Primary Button */}
        <button
          onClick={handleAgree}
          className="w-full max-w-[320px] h-[48px] bg-primary-container text-on-primary-container font-headline-sm text-headline-sm rounded-lg shadow-sm hover:shadow-md hover:cursor-pointer active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-2 font-semibold"
        >
          Agree and continue
        </button>
      </div>
    </main>
  );
}
