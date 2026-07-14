"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { verifyOtp } from "../../../services/auth/verify";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyPage() {
  const router = useRouter();
  const { loginUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(59);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Force light theme on verify screen
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

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Extract phone number from URL parameters safely on client side
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPhoneNumber(params.get("phone") || "");
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleInputChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Auto-focus next input
    if (digit !== "" && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (code[index] === "" && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs[index - 1].current.focus();
      } else {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handleResend = () => {
    setTimeLeft(59);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length === 6 && !loading) {
      setLoading(true);
      setError("");
      try {
        const response = await verifyOtp(phoneNumber, fullCode);
        
        // Save session through AuthContext
        if (response?.data?.tokens?.accessToken && response?.data?.user) {
          loginUser(response.data.user, response.data.tokens.accessToken);
        }
        
        if (response?.data?.tokens?.refreshToken) {
          localStorage.setItem("refreshToken", response.data.tokens.refreshToken);
        }
        
        setVerified(true);
        setTimeout(() => {
          router.push("/chats");
        }, 1000);
      } catch (err) {
        setError(err.message || "Invalid code. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    router.push("/login");
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #e8f5e9 0%, #f1f8e9 30%, #ffffff 60%, #e0f2f1 100%)",
      }}
    >
      {/* Decorative background circles */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, #25d366, transparent 70%)" }} />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #006d2f, transparent 70%)" }} />

      {/* Main Content */}
      <main className="w-full max-w-[400px] flex flex-col items-center px-5 animate-[fadeInUp_0.5s_ease-out]">
        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl p-5 sm:p-6 flex flex-col items-center gap-6 relative"
          style={{
            background: "rgba(255, 255, 255, 0.72)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 4px 32px rgba(0, 109, 47, 0.06), 0 1px 4px rgba(0,0,0,0.04)",
            border: "1px solid rgba(255, 255, 255, 0.7)",
          }}
        >
          {/* Back button inside card */}
          <button
            onClick={handleBack}
            type="button"
            aria-label="Go back"
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-zinc-200/50 transition-all hover:cursor-pointer active:scale-95 z-10"
          >
            <span className="material-symbols-outlined text-zinc-500 text-[20px]">arrow_back</span>
          </button>
          {/* Logo */}
          <div className="mb-1">
            <img
              src="/logo.png?v=2"
              alt="AppMetaChat"
              width={140}
              height={140}
              className="object-contain drop-shadow-md"
              priority="true"
            />
          </div>

          {/* Title + Subtitle */}
          <div className="text-center">
            <h1 className="text-[20px] font-semibold text-zinc-800 tracking-tight mb-1">
              Enter code
            </h1>
            <p className="text-[13.5px] text-zinc-500 max-w-[280px] leading-relaxed">
              We&apos;ve sent a 6-digit code to your phone number.
            </p>
          </div>

           {/* OTP Inputs */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2 w-full px-1" id="otp-container">
            {code.map((val, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={val}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-full h-12 sm:h-14 text-center font-bold text-[18px] sm:text-[20px] rounded-xl border border-zinc-200 bg-white/50 focus:border-[#006d2f] focus:ring-2 focus:ring-[#006d2f]/20 outline-none transition-all text-zinc-800"
                autoFocus={idx === 0}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-[12.5px] text-red-500 font-medium text-center w-full px-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-4 w-full items-center">
            {/* Verify Button */}
            <button
              type="submit"
              disabled={code.join("").length < 6 || loading || verified}
              className={`w-full h-[50px] rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-300 hover:cursor-pointer active:scale-[0.98] ${
                code.join("").length === 6 && !loading && !verified
                  ? "bg-[#006d2f] text-white shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/30 hover:brightness-105"
                  : verified
                  ? "bg-[#006b5f] text-white shadow-md"
                  : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              }`}
            >
              <span>{loading ? "Verifying..." : verified ? "Verified" : "Verify"}</span>
              {!loading && (
                <span className="material-symbols-outlined text-[20px]">
                  {verified ? "check_circle" : "arrow_forward"}
                </span>
              )}
            </button>

            {/* Timer / Resend Action */}
            <div className="flex items-center gap-1 text-[13px] text-zinc-500 mt-1">
              {timeLeft > 0 ? (
                <span>
                  Resend in <span className="font-semibold text-[#006d2f]">0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-[#006d2f] font-semibold hover:underline focus:outline-none hover:cursor-pointer"
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>
        </form>
      </main>

      {/* Fade-in animation keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
