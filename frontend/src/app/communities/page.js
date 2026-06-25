"use client";

import Navigation from "@/components/Navigation";

export default function CommunitiesPage() {
  return (
    <div className="w-full bg-white text-[#1c2e35] antialiased min-h-screen flex flex-col pb-24 font-sans select-none">
      {/* Top Header */}
      <header className="sticky top-0 bg-white z-40 px-4 py-3.5 flex justify-between items-center">
        <h1 className="text-[22px] font-bold text-[#1c2e35] font-sans">Communities</h1>
        <div className="flex items-center text-[#3b4a54]">
          <button aria-label="More options" className="p-1 hover:bg-zinc-100 rounded-full transition-colors active:scale-95">
            <span className="material-symbols-outlined text-[24px]">more_vert</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-3xl mx-auto">
        {/* New Community Row */}
        <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-zinc-50 active:bg-zinc-100 transition-colors">
          <div className="relative shrink-0 mr-4">
            <div className="w-[48px] h-[48px] rounded-[12px] bg-[#dfe5e7] text-[#54656f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] fill">groups</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#00a884] text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
              <span className="material-symbols-outlined text-[12px] font-bold">add</span>
            </div>
          </div>
          <span className="text-[16px] font-bold text-[#1c2e35]">New community</span>
        </div>

        {/* Thick Divider */}
        <div className="h-3 bg-[#f5f6f6] border-t border-b border-zinc-100/80"></div>

        {/* Zara Ali Community */}
        <section className="flex flex-col">
          {/* Community Header */}
          <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer border-b border-zinc-100">
            <div className="w-[48px] h-[48px] rounded-[12px] overflow-hidden shrink-0 mr-4 border border-zinc-100 bg-zinc-100 flex items-center justify-center">
              <img
                className="w-full h-full object-cover"
                alt="Zara Ali Community avatar"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80"
              />
            </div>
            <span className="text-[16.5px] font-bold text-[#1c2e35]">Zara Ali</span>
          </div>

          {/* Sub-items */}
          <div className="flex flex-col">
            {/* New Group LinkedIn Agent added */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer">
              <div className="w-[48px] h-[48px] rounded-full bg-[#e6f5ef] text-[#0f8b5d] flex items-center justify-center shrink-0 mr-4">
                <span className="material-symbols-outlined text-[24px]">notifications</span>
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-[14.5px] text-[#667781] truncate font-normal">
                  New group "Linkedin Agent" added
                </p>
              </div>
              <div className="shrink-0 mr-1">
                <span className="w-2.5 h-2.5 bg-[#00a884] rounded-full inline-block"></span>
              </div>
            </div>

            {/* Announcements */}
            <div className="flex items-start px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer">
              <div className="w-[48px] h-[48px] rounded-[12px] bg-[#e6f5ef] text-[#0f8b5d] flex items-center justify-center shrink-0 mr-4">
                <span className="material-symbols-outlined text-[24px]">campaign</span>
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="text-[15.5px] font-bold text-[#1c2e35] truncate">Announcements</h4>
                  <span className="text-[12px] text-[#667781] shrink-0 font-medium">Yesterday</span>
                </div>
                <p className="text-[13.5px] text-[#667781] truncate font-normal">
                  +92 306 0969860: Kesi k pas number...
                </p>
              </div>
              <div className="shrink-0 self-end mr-1 text-[#8696a0]">
                <span className="inline-block text-[11px] font-semibold text-zinc-500 border border-zinc-200 rounded px-1.5 py-0.5 bg-zinc-50 leading-none">
                  Archived
                </span>
              </div>
            </div>

            {/* earning house */}
            <div className="flex items-start px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer">
              <div className="w-[48px] h-[48px] rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 mr-4 border border-zinc-100">
                <span className="text-[9px] font-bold tracking-tight text-center leading-tight uppercase p-1">Earning House</span>
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="text-[15.5px] font-bold text-[#1c2e35] truncate">earning house</h4>
                  <span className="text-[12px] text-[#667781] shrink-0 font-medium">11:57</span>
                </div>
                <p className="text-[13.5px] text-[#667781] truncate font-normal">
                  +91 97830 06665 joined using a group link.
                </p>
              </div>
            </div>

            {/* View all */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer text-[#54656f]">
              <span className="material-symbols-outlined text-[20px] shrink-0 mr-7 ml-3.5">chevron_right</span>
              <span className="text-[15px] font-semibold">View all</span>
            </div>
          </div>
        </section>

        {/* Thick Divider */}
        <div className="h-3 bg-[#f5f6f6] border-t border-b border-zinc-100/80"></div>

        {/* GDG OnCampus Community */}
        <section className="flex flex-col">
          {/* Community Header */}
          <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer border-b border-zinc-100">
            {/* GDG Colorful Bracket Logo SVG */}
            <div className="w-[48px] h-[48px] rounded-[12px] overflow-hidden shrink-0 mr-4 border border-zinc-100 bg-[#f8f9fa] flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                <path d="M7.5 18L3 12L7.5 6" stroke="#4285F4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5 6L21 12L16.5 18" stroke="#EA4335" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 19L14 5" stroke="#FBBC05" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="2" fill="#34A853" />
              </svg>
            </div>
            <span className="text-[16.5px] font-bold text-[#1c2e35] truncate max-w-[80%]">
              GDG OnCampus, Sunstone, Sage University I...
            </span>
          </div>

          {/* Sub-items */}
          <div className="flex flex-col">
            {/* Announcements */}
            <div className="flex items-start px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer">
              <div className="w-[48px] h-[48px] rounded-[12px] bg-[#e6f5ef] text-[#0f8b5d] flex items-center justify-center shrink-0 mr-4">
                <span className="material-symbols-outlined text-[24px]">campaign</span>
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="text-[15.5px] font-bold text-[#1c2e35] truncate">Announcements</h4>
                  <span className="text-[12px] text-[#667781] shrink-0 font-medium">19/06/2026</span>
                </div>
                <p className="text-[13.5px] text-[#667781] truncate font-normal">
                  +91 88897 01865: Odoo India is hosting its...
                </p>
              </div>
              <div className="shrink-0 self-end mr-1 text-[#8696a0]">
                <span className="material-symbols-outlined text-[19px]">notifications_off</span>
              </div>
            </div>

            {/* Frontend Dev Debugshala */}
            <div className="flex items-start px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer">
              <div className="w-[48px] h-[48px] rounded-full bg-[#dfe5e7] text-[#54656f] flex items-center justify-center shrink-0 mr-4">
                <span className="material-symbols-outlined text-[26px] fill opacity-80">groups</span>
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="text-[15.5px] font-bold text-[#1c2e35] truncate">
                    Frontend Dev Debugshala X GDG...
                  </h4>
                  <span className="text-[12px] text-[#667781] shrink-0 font-medium">13/06/2026</span>
                </div>
                <p className="text-[13.5px] text-[#667781] truncate font-normal">
                  +91 89570 71248 joined from the community
                </p>
              </div>
              <div className="shrink-0 self-end mr-1 text-[#8696a0]">
                <span className="material-symbols-outlined text-[19px]">notifications_off</span>
              </div>
            </div>

            {/* View all */}
            <div className="flex items-center px-4 py-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer text-[#54656f]">
              <span className="material-symbols-outlined text-[20px] shrink-0 mr-7 ml-3.5">chevron_right</span>
              <span className="text-[15px] font-semibold">View all</span>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab="communities" />
    </div>
  );
}
