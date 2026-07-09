"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import ChatsPage from "@/app/chats/page";
import UpdatesPage from "@/app/updates/page";
import CommunitiesPage from "@/app/communities/page";
import CallsPage from "@/app/calls/page";
import Navigation from "@/components/Navigation";

const SWIPE_THRESHOLD = 80; // minimum distance in px to register a swipe
const TABS = ["/chats", "/updates", "/communities", "/calls"];

export default function SwipeNavigation({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const currentIndex = TABS.indexOf(pathname);
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // initial calculation
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    let targetIndex = currentIndex;
    if (offset < -SWIPE_THRESHOLD || velocity < -400) {
      if (currentIndex < TABS.length - 1) {
        targetIndex = currentIndex + 1;
      }
    } else if (offset > SWIPE_THRESHOLD || velocity > 400) {
      if (currentIndex > 0) {
        targetIndex = currentIndex - 1;
      }
    }

    if (targetIndex !== currentIndex) {
      router.push(TABS[targetIndex]);
    }
  };

  // If not one of the main sliding tabs, render normally
  if (currentIndex === -1) {
    return <>{children}</>;
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden flex-grow bg-white dark:bg-[#0b141a] flex flex-col"
    >
      <div className="relative w-full flex-grow overflow-hidden">
        <motion.div
          drag="x"
          dragDirectionLock
          dragConstraints={{ 
            left: currentIndex < TABS.length - 1 ? -((currentIndex + 1) * width) : -currentIndex * width, 
            right: currentIndex > 0 ? -((currentIndex - 1) * width) : -currentIndex * width 
          }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          animate={{ x: -currentIndex * width }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="absolute top-0 bottom-0 flex cursor-grab active:cursor-grabbing"
          style={{ width: `${TABS.length * 100}%` }}
        >
          <div className="h-full" style={{ width: `${100 / TABS.length}%` }}>
            <ChatsPage />
          </div>
          <div className="h-full" style={{ width: `${100 / TABS.length}%` }}>
            <UpdatesPage />
          </div>
          <div className="h-full" style={{ width: `${100 / TABS.length}%` }}>
            <CommunitiesPage />
          </div>
          <div className="h-full" style={{ width: `${100 / TABS.length}%` }}>
            <CallsPage />
          </div>
        </motion.div>
      </div>
      <Navigation activeTab={TABS[currentIndex].substring(1)} />
    </div>
  );
}
