"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [about, setAbout] = useState("Available for chat...");
  const [image, setImage] = useState("");

  const handleContinue = (e) => {
    e.preventDefault();
    if (name.trim()) {
      router.push("/chats");
    }
  };

  return (
    <div className="w-full bg-background min-h-screen text-on-background font-body-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.12)] p-6 md:p-8 flex flex-col gap-6 border border-outline-variant">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-display-lg md:text-display-lg text-primary mb-1 font-bold">
            Profile Setup
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Let&apos;s get your profile ready for messaging.
          </p>
        </div>

        {/* Photo Upload */}
        <div className="flex justify-center relative group w-fit mx-auto cursor-pointer">
          <div className="w-32 h-32 rounded-full bg-surface-container-high border-2 border-outline-variant flex items-center justify-center overflow-hidden relative transition-colors duration-200 group-hover:border-primary">
            {image ? (
              <img src={image} alt="Avatar Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-4xl text-outline-variant group-hover:text-primary transition-colors duration-200">
                person
              </span>
            )}
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-inverse-surface/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="material-symbols-outlined text-on-primary mb-1">photo_camera</span>
              <span className="font-label-sm text-label-sm text-on-primary">Upload</span>
            </div>
          </div>
          {/* Quick Edit Badge */}
          <button
            type="button"
            className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-on-primary hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-container-lowest active:scale-95 hover:cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleContinue} className="flex flex-col gap-4">
          {/* Name Input */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="display-name">
              Display Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="display-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-12 bg-surface-container-lowest border border-outline-variant rounded-full px-4 font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors transition-shadow"
                required
              />
            </div>
          </div>

          {/* About / Bio Input */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="about">
              About
            </label>
            <div className="relative">
              <textarea
                id="about"
                maxLength={139}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Available for chat..."
                rows={3}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors transition-shadow resize-none"
              />
              <div className="absolute bottom-3 right-4 font-label-sm text-label-sm text-outline-variant">
                {about.length}/139
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full h-12 mt-2 bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed text-on-primary rounded-lg font-headline-sm text-headline-sm shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-2 focus:ring-offset-surface-container-lowest active:scale-[0.98] flex items-center justify-center gap-1 hover:cursor-pointer font-semibold"
          >
            <span>Continue</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </form>
      </div>
    </div>
  );
}
