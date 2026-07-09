"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(59);
  const [verified, setVerified] = useState(false);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleInputChange = (index, value) => {
    // Keep only single numeric digit
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
        // Clear previous input and focus it
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs[index - 1].current.focus();
      } else {
        // Clear current input
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handleResend = () => {
    setTimeLeft(59);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      setVerified(true);
      // Simulate redirection after a brief checkmark animation
      setTimeout(() => {
        router.push("/chats");
      }, 1000);
    }
  };

  const handleBack = () => {
    router.push("/login");
  };

  return (
    <div className="w-full bg-background min-h-screen text-on-background antialiased flex flex-col items-center justify-center p-4">
      {/* Back Header */}
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

      {/* Main Container */}
      <main className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-lg p-8 flex flex-col gap-6 border border-outline-variant mt-12">
        {/* Header */}
        <header className="flex flex-col gap-2 text-center">
          <h1 className="font-display-lg text-display-lg text-on-surface font-bold">Enter code</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            We&apos;ve sent a 6-digit code to your phone number.
          </p>
        </header>

        {/* OTP Input Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-1 md:gap-2" id="otp-container">
            {code.map((val, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="number"
                maxLength={1}
                value={val}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="otp-input w-12 h-14 md:w-14 md:h-16 text-center font-headline-md text-headline-md rounded-lg border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                autoFocus={idx === 0}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 items-center">
            <button
              type="submit"
              disabled={code.join("").length < 6 || verified}
              className={`w-full h-12 text-on-primary rounded-lg font-headline-sm text-headline-sm transition-colors shadow-sm active:scale-[0.98] flex items-center justify-center gap-1 hover:cursor-pointer font-semibold ${
                verified ? "bg-secondary hover:bg-secondary" : "bg-primary-container hover:bg-primary"
              }`}
            >
              <span>{verified ? "Verified" : "Verify"}</span>
              <span className="material-symbols-outlined">
                {verified ? "check_circle" : "arrow_forward"}
              </span>
            </button>

            <div className="flex items-center gap-1 font-body-md text-body-md text-on-surface-variant">
              {timeLeft > 0 ? (
                <span>
                  Resend in <span className="font-medium">0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary font-medium hover:underline focus:outline-none hover:cursor-pointer"
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
