"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Navigation({ activeTab }) {
  const router = useRouter();

  const tabs = [
    { id: "chats", label: "Chats", icon: "chat", path: "/chats", badge: "99+" },
    { id: "updates", label: "Updates", icon: "donut_large", path: "/updates", hasDot: true },
    { id: "communities", label: "Communities", icon: "groups", path: "/communities" },
    { id: "calls", label: "Calls", icon: "call", path: "/calls" },
  ];

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-white dark:bg-[#111b21] border-t border-zinc-100 dark:border-[#222d34] pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center h-[76px] w-full px-1 max-w-3xl mx-auto relative overflow-hidden">
        
        {/* Sliding Active Pill Background */}
        {activeIndex !== -1 && (
          <motion.div
            layoutId="active-nav-pill"
            className="absolute h-8 bg-[#e6f5ef] dark:bg-[#ff2d55] rounded-full z-0 pointer-events-none"
            style={{
              width: "64px",
              left: `calc(${activeIndex * 25}% + 12.5% - 32px)`,
              top: "12.5px",
            }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30,
              mass: 0.8
            }}
          />
        )}

        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              aria-label={`${tab.label} tab${isActive ? ", active" : ""}`}
              className="group flex flex-col items-center justify-center flex-1 h-full focus:outline-none hover:cursor-pointer relative z-10"
            >
              {/* Icon Container */}
              <div className="relative">
                <motion.div
                  animate={isActive ? { scale: [1, 1.2, 0.95, 1.05, 1], y: [0, -3, 1, 0] } : { scale: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex items-center justify-center rounded-full px-6 py-1 transition-colors duration-200 ${
                    isActive ? "text-[#0f8b5d] dark:text-white" : "text-[#54656f] dark:text-[#8696a0] hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[23px] transition-all duration-200`}
                    style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}
                  >
                    {tab.icon}
                  </span>
                </motion.div>

                {/* Badge Overlay */}
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#00a884] dark:bg-[#ff2d55] text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-[#111b21] min-w-[18px] text-center leading-none">
                    {tab.badge}
                  </span>
                )}

                {/* Green Dot Indicator */}
                {tab.hasDot && (
                  <span className="absolute top-0 right-1 w-2.5 h-2.5 bg-[#00a884] dark:bg-[#ff2d55] rounded-full border-2 border-white dark:border-[#111b21]"></span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[12px] mt-1.5 transition-colors tracking-wide ${
                  isActive ? "text-[#1c2e35] dark:text-white font-bold" : "text-[#54656f] dark:text-[#8696a0] font-medium"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
