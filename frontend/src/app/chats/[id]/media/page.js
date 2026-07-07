"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";

export default function MediaGalleryPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const id = params.id;
  const [activeTab, setActiveTab] = useState("Media");

  const mediaItems = {
    Media: [
      {
        id: "m1",
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop&q=80",
        section: "LAST WEEK",
        isVideo: true
      },
      {
        id: "m2",
        src: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=200&fit=crop&q=80",
        section: "LAST WEEK"
      },
      {
        id: "m3",
        src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&fit=crop&q=80",
        section: "LAST MONTH"
      },
      {
        id: "m4",
        src: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=200&fit=crop&q=80",
        section: "MAY"
      },
      {
        id: "m5",
        src: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&fit=crop&q=80",
        section: "MAY"
      },
      {
        id: "m6",
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&fit=crop&q=80",
        section: "MAY"
      },
      {
        id: "m7",
        src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&fit=crop&q=80",
        section: "MAY"
      },
      {
        id: "m8",
        src: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&fit=crop&q=80",
        section: "MAY"
      },
      {
        id: "m9",
        src: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&fit=crop&q=80",
        section: "APRIL"
      },
      {
        id: "m10",
        src: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=200&fit=crop&q=80",
        section: "APRIL"
      },
      {
        id: "m11",
        src: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&fit=crop&q=80",
        section: "APRIL"
      }
    ],
    Docs: [
      { id: "d1", name: "Project_Brief_v2.pdf", size: "2.4 MB", date: "LAST WEEK" },
      { id: "d2", name: "Figma_Tokens_v1.json", size: "542 KB", date: "LAST MONTH" },
      { id: "d3", name: "Invoice_Cleanzo_June.xlsx", size: "1.1 MB", date: "MAY" }
    ],
    Links: [
      { id: "l1", url: "https://amzn.in/d/0dpdAi7W", title: "Lifelong 3-in-1 Foldable Electric Mosquito Racket", domain: "amzn.in", date: "LAST WEEK" },
      { id: "l2", url: "https://youtu.be/uBotyv_TSZg", title: "YouTube Video Clip Promo - Kittu Music", domain: "youtube.com", date: "MAY" }
    ]
  };

  const handleBack = () => {
    router.push(`/chats/${id}`);
  };

  const renderTabContent = () => {
    if (activeTab === "Docs") {
      return (
        <div className="space-y-4 px-4 pt-4">
          {mediaItems.Docs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-zinc-200/60 rounded-xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:bg-zinc-50"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#00a884] text-3xl">description</span>
                <div>
                  <p className="text-[14.5px] font-bold text-zinc-800 truncate w-56">{doc.name}</p>
                  <p className="text-[12px] text-zinc-500">{doc.size} · {doc.date}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-zinc-500">download</span>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "Links") {
      return (
        <div className="space-y-4 px-4 pt-4">
          {mediaItems.Links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="block bg-white border border-zinc-200/60 rounded-xl p-4 shadow-sm hover:bg-zinc-50 transition-colors"
            >
              <p className="text-[14.5px] font-bold text-zinc-800">{link.title}</p>
              <div className="flex items-center gap-1 mt-1.5 text-[12.5px] text-[#00a884] font-semibold">
                <span className="material-symbols-outlined text-[15px]">link</span>
                <span>{link.domain}</span>
              </div>
              <span className="block text-[11px] text-zinc-400 mt-1">{link.date}</span>
            </a>
          ))}
        </div>
      );
    }

    // Default "Media" 3-column Grid
    const sections = ["LAST WEEK", "LAST MONTH", "MAY", "APRIL"];

    return (
      <div className="flex flex-col">
        {sections.map((sectionName) => {
          const sectionItems = mediaItems.Media.filter(
            (item) => item.section === sectionName
          );
          if (sectionItems.length === 0) return null;

          return (
            <div key={sectionName} className="mb-4">
              {/* Section Header */}
              <div className="px-4 py-2 sticky top-[104px] z-20 bg-white/95 backdrop-blur-sm">
                <h2 className="text-[13px] font-bold text-zinc-500 uppercase tracking-wide">
                  {sectionName}
                </h2>
              </div>

              {/* 3-column Grid */}
              <div className="grid grid-cols-3 gap-[3px] px-3.5 mt-1">
                {sectionItems.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square bg-zinc-100 overflow-hidden relative cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                  >
                    <img
                      src={item.src}
                      alt="Gallery asset"
                      className="w-full h-full object-cover"
                    />
                    {item.isVideo && (
                      <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[32px] fill">
                          play_circle
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white text-[#1c2e35] min-h-screen flex flex-col items-center font-sans antialiased">
      {/* Mobile Shell Container */}
      <main className="w-full max-w-md bg-white flex flex-col relative shadow-2xl min-h-screen pb-12">
        
        {/* Fixed Header */}
        <header className="sticky top-0 w-full z-30 bg-white flex flex-col pt-safe">
          <div className="flex items-center h-[56px] px-3 border-b border-zinc-100/50">
            <button
              onClick={handleBack}
              aria-label="Back"
              className="w-9 h-9 flex items-center justify-center text-[#1c2e35] active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[19px] font-bold text-[#1c2e35] ml-4">
              All media
            </h1>
          </div>

          {/* Gallery Tabs (Equal Widths) */}
          <div className="flex border-b border-zinc-100 w-full">
            {["Media", "Docs", "Links"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-center py-3.5 border-b-[3px] font-bold text-[14.5px] transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "border-[#00a884] text-[#00a884]"
                      : "border-transparent text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 mt-1">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
