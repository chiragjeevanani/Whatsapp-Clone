"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { login } from "../../services/auth/login";

const INDIA_COUNTRY = { name: "India", code: "+91" };

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getMinMaxPhoneLength = (countryCode) => {
    if (countryCode === "+1") return { min: 10, max: 10 };
    if (countryCode === "+91") return { min: 10, max: 10 };
    if (countryCode === "+44") return { min: 10, max: 11 };
    return { min: 8, max: 12 };
  };

  const formatPhoneNumber = (digits, countryCode) => {
    if (countryCode === "+1") {
      let formatted = "";
      if (digits.length > 0) {
        formatted = "(" + digits.substring(0, 3);
        if (digits.length > 3) formatted += ") " + digits.substring(3, 6);
        if (digits.length > 6) formatted += "-" + digits.substring(6, 10);
      }
      return formatted;
    } else if (countryCode === "+91") {
      let formatted = "";
      if (digits.length > 0) {
        formatted = digits.substring(0, 5);
        if (digits.length > 5) formatted += " " + digits.substring(5, 10);
      }
      return formatted;
    } else if (countryCode === "+44") {
      let formatted = "";
      if (digits.length > 0) {
        formatted = digits.substring(0, 5);
        if (digits.length > 5) formatted += " " + digits.substring(5, 11);
      }
      return formatted;
    } else {
      let parts = [];
      for (let i = 0; i < digits.length; i += 4) {
        parts.push(digits.substring(i, i + 4));
      }
      return parts.join(" ");
    }
  };

  const handlePhoneChange = (e) => {
    const { max } = getMinMaxPhoneLength(INDIA_COUNTRY.code);
    const digits = e.target.value.replace(/\D/g, "").substring(0, max);
    setPhone(formatPhoneNumber(digits, INDIA_COUNTRY.code));
  };

  const { min } = getMinMaxPhoneLength(INDIA_COUNTRY.code);
  const isPhoneValid = phone.replace(/\D/g, "").length >= min;

  const handleNext = async (e) => {
    e.preventDefault();
    if (isPhoneValid && !loading) {
      setLoading(true);
      setError("");
      const fullPhoneNumber = INDIA_COUNTRY.code + phone.replace(/\s+/g, "");
      try {
        await login(fullPhoneNumber);
        router.push(`/login/verify?phone=${encodeURIComponent(fullPhoneNumber)}`);
      } catch (err) {
        setError(err.message || "Failed to request OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    router.push("/");
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
        {/* Form Card — logo, title, inputs all inside */}
        <form
          onSubmit={handleNext}
          className="w-full rounded-2xl p-6 flex flex-col items-center gap-5 relative"
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
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-on-surface/5 transition-all hover:cursor-pointer active:scale-95 z-10"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">arrow_back</span>
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
          <h1 className="text-[20px] font-semibold text-on-surface tracking-tight">
            Enter your phone number
          </h1>
          <p className="text-[13.5px] text-on-surface-variant text-center leading-relaxed max-w-[280px] -mt-3 mb-1">
            We will send you an SMS to verify your number.
          </p>
          {/* Country Selector (Static Display, Premium Feel) */}
          <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-surface-container/30 border border-outline-variant/20 w-full select-none">
            <Image
              src="https://flagcdn.com/w40/in.png"
              alt="India flag"
              width={22}
              height={15}
              className="rounded-[2px] shrink-0 shadow-sm"
              unoptimized
            />
            <span className="text-on-surface text-[14.5px] font-medium flex-1 text-left">India</span>
          </div>

          {/* Split Phone Input Fields */}
          <div className="flex gap-2.5 w-full">
            {/* Country Code Block */}
            <div className="w-[72px] h-[52px] rounded-xl border border-outline-variant/30 bg-surface-container/20 flex items-center justify-center font-semibold text-on-surface text-[15px] select-none shrink-0">
              {INDIA_COUNTRY.code}
            </div>

            {/* Phone Number Field */}
            <div
              className={`flex-1 min-w-0 h-[52px] flex items-center gap-2 rounded-xl border-2 transition-all duration-200 px-3.5 bg-white/50 ${
                isFocused ? "border-primary shadow-[0_0_0_3px_rgba(37,211,102,0.12)]" : "border-outline-variant/30 hover:border-outline-variant/50"
              }`}
            >
              <input
                type="tel"
                id="phone"
                autoComplete="tel"
                value={phone}
                onChange={handlePhoneChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Phone number"
                className="flex-1 min-w-0 bg-transparent py-3 text-on-surface text-[15px] outline-none placeholder:text-on-surface-variant/40 caret-primary"
                required
                autoFocus
              />
              {phone && (
                <button
                  type="button"
                  onClick={() => setPhone("")}
                  className="p-1 rounded-full hover:bg-on-surface/5 transition-colors"
                  aria-label="Clear phone number"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-[12.5px] text-error font-medium text-center w-full px-2">
              {error}
            </p>
          )}

          {/* Terms */}
          <p className="text-[11.5px] text-on-surface-variant text-center leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="#" className="text-primary font-medium hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary font-medium hover:underline">
              Privacy Policy
            </Link>
          </p>

          {/* Next Button */}
          <button
            type="submit"
            disabled={!isPhoneValid || loading}
            className={`w-full h-[50px] rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-300 hover:cursor-pointer active:scale-[0.98] ${
              isPhoneValid && !loading
                ? "bg-primary text-on-primary shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:brightness-105"
                : "bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed"
            }`}
          >
            {loading ? "Sending..." : "Next"}
            {!loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
          </button>
        </form>

        {/* Carrier notice */}
        <p className="text-[11.5px] text-on-surface-variant/60 mt-5 text-center">
          Carrier SMS charges may apply
        </p>
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
