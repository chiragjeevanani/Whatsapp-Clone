"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    // Format: (XXX) XXX-XXXX
    let formatted = "";
    if (value.length > 0) {
      formatted = "(" + value.substring(0, 3);
      if (value.length > 3) {
        formatted += ") " + value.substring(3, 6);
      }
      if (value.length > 6) {
        formatted += "-" + value.substring(6, 10);
      }
    }
    setPhone(formatted);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length >= 10) {
      router.push("/login/verify");
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="w-full bg-background min-h-screen font-body-md text-on-background antialiased flex flex-col items-center justify-center p-4">
      {/* Top App Bar equivalent */}
      <header className="w-full max-w-md flex justify-between items-center py-4 absolute top-0 left-0 right-0 px-4 mx-auto">
        <button
          onClick={handleBack}
          type="button"
          aria-label="Go back"
          className="p-2 -ml-2 rounded-full hover:bg-surface-variant transition-colors hover:cursor-pointer active:opacity-80"
        >
          <span className="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <div className="flex-1"></div>
        <button
          type="button"
          aria-label="More options"
          className="p-2 -mr-2 rounded-full hover:bg-surface-variant transition-colors hover:cursor-pointer active:opacity-80"
        >
          <span className="material-symbols-outlined text-on-surface">more_vert</span>
        </button>
      </header>

      {/* Main Content Container */}
      <main className="w-full max-w-md flex flex-col items-center mt-12">
        {/* Header Text */}
        <div className="text-center mb-8 w-full">
          <h1 className="font-display-lg text-display-lg text-primary mb-2 font-bold">Verify your phone number</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[280px] mx-auto text-center">
            WhatsApp will send an SMS message to verify your phone number. Carrier SMS charges may apply.
          </p>
        </div>

        {/* Form Area */}
        <form
          onSubmit={handleNext}
          className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-outline-variant/30"
        >
          {/* Country Selector */}
          <button
            type="button"
            className="w-full flex items-center justify-between py-3 border-b border-outline-variant hover:bg-surface-container/50 transition-colors focus:outline-none focus:border-secondary hover:cursor-pointer"
          >
            <span className="font-body-lg text-body-lg text-on-surface flex items-center gap-2">
              <span aria-hidden="true" className="text-2xl leading-none">🇺🇸</span>
              United States
            </span>
            <div className="flex items-center gap-2">
              <span className="font-body-lg text-body-lg text-on-surface-variant">+1</span>
              <span className="material-symbols-outlined text-on-surface-variant">arrow_drop_down</span>
            </div>
          </button>

          {/* Phone Number Input */}
          <div className="relative w-full floating-input mt-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="font-body-lg text-body-lg text-on-surface-variant border-r border-outline-variant pr-2">+1</span>
            </div>
            {/* Input field */}
            <input
              type="tel"
              id="phone"
              autoComplete="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Phone number"
              className="block w-full pl-16 pr-3 py-4 bg-surface-container-lowest border border-outline-variant rounded-full font-body-lg text-body-lg text-on-surface focus:ring-1 focus:ring-secondary focus:border-secondary transition-colors outline-none placeholder-transparent"
              required
            />
            {/* Floating Label */}
            <label
              htmlFor="phone"
              className="absolute left-16 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-lg text-body-lg transition-all duration-200 pointer-events-none origin-left ml-1 px-1"
            >
              Phone number
            </label>
          </div>

          <p className="font-label-sm text-label-sm text-on-surface-variant text-center mt-1">
            By continuing, you agree to our{" "}
            <Link href="#" className="text-secondary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-secondary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          {/* Continue Button */}
          <div className="w-full mt-4 flex justify-center">
            <button
              type="submit"
              disabled={phone.replace(/\D/g, "").length < 10}
              className="bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed text-on-primary-container font-headline-sm text-headline-sm px-8 py-3 rounded-full shadow-sm hover:opacity-90 active:scale-95 transition-all w-full max-w-[200px] flex items-center justify-center gap-1 hover:cursor-pointer font-semibold"
            >
              Next
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
