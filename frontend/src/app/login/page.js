"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const COUNTRIES = [
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
  { name: "Russia", code: "+7", flag: "🇷🇺" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "Indonesia", code: "+62", flag: "🇮🇩" },
];

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const getMinMaxPhoneLength = (countryCode) => {
    if (countryCode === "+1") return { min: 10, max: 10 };
    if (countryCode === "+91") return { min: 10, max: 10 };
    if (countryCode === "+44") return { min: 10, max: 11 };
    return { min: 8, max: 12 };
  };

  const formatPhoneNumber = (digits, countryCode) => {
    if (countryCode === "+1") {
      // Format: (XXX) XXX-XXXX
      let formatted = "";
      if (digits.length > 0) {
        formatted = "(" + digits.substring(0, 3);
        if (digits.length > 3) {
          formatted += ") " + digits.substring(3, 6);
        }
        if (digits.length > 6) {
          formatted += "-" + digits.substring(6, 10);
        }
      }
      return formatted;
    } else if (countryCode === "+91") {
      // Format: XXXXX XXXXX
      let formatted = "";
      if (digits.length > 0) {
        formatted = digits.substring(0, 5);
        if (digits.length > 5) {
          formatted += " " + digits.substring(5, 10);
        }
      }
      return formatted;
    } else if (countryCode === "+44") {
      // Format: XXXXX XXXXXX
      let formatted = "";
      if (digits.length > 0) {
        formatted = digits.substring(0, 5);
        if (digits.length > 5) {
          formatted += " " + digits.substring(5, 11);
        }
      }
      return formatted;
    } else {
      // Generic format: groups of 4 digits
      let parts = [];
      for (let i = 0; i < digits.length; i += 4) {
        parts.push(digits.substring(i, i + 4));
      }
      return parts.join(" ");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Re-format phone number when country changes
  useEffect(() => {
    const { max } = getMinMaxPhoneLength(selectedCountry.code);
    const digits = phone.replace(/\D/g, "").substring(0, max);
    setPhone(formatPhoneNumber(digits, selectedCountry.code));
  }, [selectedCountry]);

  const handlePhoneChange = (e) => {
    const { max } = getMinMaxPhoneLength(selectedCountry.code);
    const digits = e.target.value.replace(/\D/g, "").substring(0, max);
    setPhone(formatPhoneNumber(digits, selectedCountry.code));
  };

  const { min } = getMinMaxPhoneLength(selectedCountry.code);
  const isPhoneValid = phone.replace(/\D/g, "").length >= min;

  const handleNext = (e) => {
    e.preventDefault();
    if (isPhoneValid) {
      router.push("/login/verify");
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  const filteredCountries = COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.includes(searchQuery)
  );

  const paddingLeftClass = selectedCountry.code.length > 3 ? "pl-22" : selectedCountry.code.length > 2 ? "pl-18" : "pl-16";
  const labelLeftClass = selectedCountry.code.length > 3 ? "left-22" : selectedCountry.code.length > 2 ? "left-18" : "left-16";

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
            Zetto will send an SMS message to verify your phone number. Carrier SMS charges may apply.
          </p>
        </div>

        {/* Form Area */}
        <form
          onSubmit={handleNext}
          className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-outline-variant/30 relative"
        >
          {/* Country Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between py-3 border-b border-outline-variant hover:bg-surface-container/50 transition-colors focus:outline-none focus:border-secondary hover:cursor-pointer"
            >
              <span className="font-body-lg text-body-lg text-on-surface flex items-center gap-2">
                <span aria-hidden="true" className="text-2xl leading-none">{selectedCountry.flag}</span>
                {selectedCountry.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-body-lg text-body-lg text-on-surface-variant">{selectedCountry.code}</span>
                <span className="material-symbols-outlined text-on-surface-variant">arrow_drop_down</span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl max-h-60 overflow-y-auto flex flex-col">
                <div className="sticky top-0 bg-surface-container-lowest p-2 border-b border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-body-md text-on-surface outline-none py-1 placeholder-on-surface-variant/60"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="p-1 hover:bg-surface-variant rounded-full text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-sm leading-none">close</span>
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <button
                        key={country.name}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(country);
                          setIsDropdownOpen(false);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-variant transition-colors text-left hover:cursor-pointer"
                      >
                        <span className="font-body-md text-on-surface flex items-center gap-2">
                          <span aria-hidden="true" className="text-xl">{country.flag}</span>
                          {country.name}
                        </span>
                        <span className="font-body-md text-on-surface-variant">{country.code}</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-body-md text-on-surface-variant">
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="relative w-full floating-input mt-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="font-body-lg text-body-lg text-on-surface-variant border-r border-outline-variant pr-2">
                {selectedCountry.code}
              </span>
            </div>
            {/* Input field */}
            <input
              type="tel"
              id="phone"
              autoComplete="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Phone number"
              className={`block w-full ${paddingLeftClass} pr-3 py-4 bg-surface-container-lowest border border-outline-variant rounded-full font-body-lg text-body-lg text-on-surface focus:ring-1 focus:ring-secondary focus:border-secondary transition-colors outline-none placeholder-transparent`}
              required
            />
            {/* Floating Label */}
            <label
              htmlFor="phone"
              className={`absolute ${labelLeftClass} top-1/2 -translate-y-1/2 text-on-surface-variant font-body-lg text-body-lg transition-all duration-200 pointer-events-none origin-left ml-1 px-1`}
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
              disabled={!isPhoneValid}
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

