"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, useMotionValue } from "framer-motion";
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
  
  const pathnameIndex = TABS.indexOf(pathname);
  const [localIndex, setLocalIndex] = useState(pathnameIndex !== -1 ? pathnameIndex : 0);
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const dragX = useMotionValue(0);
  const [hideNavbar, setHideNavbar] = useState(false);

  // Sync local index with route path when pathname changes (e.g. browser history navigation)
  useEffect(() => {
    if (pathnameIndex !== -1 && pathnameIndex !== localIndex) {
      setLocalIndex(pathnameIndex);
    }
  }, [pathname]);

  useEffect(() => {
    const handleHideNav = (e) => {
      setHideNavbar(e.detail);
    };
    window.addEventListener("hide-bottom-nav", handleHideNav);
    return () => window.removeEventListener("hide-bottom-nav", handleHideNav);
  }, []);

  useEffect(() => {
    setHideNavbar(false);
  }, [localIndex]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth;
        setWidth(newWidth);
        // Only initialize dragX on initial layout/resize to avoid breaking spring animation transitions
        if (dragX.get() === 0 && localIndex > 0) {
          dragX.set(-localIndex * newWidth);
        }
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // initial calculation
    return () => window.removeEventListener("resize", handleResize);
  }, [localIndex]);

  const handleTabChange = (index) => {
    setLocalIndex(index);
    window.history.pushState(null, "", TABS[index]);
  };

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    let targetIndex = localIndex;
    if (offset < -SWIPE_THRESHOLD || velocity < -400) {
      if (localIndex < TABS.length - 1) {
        targetIndex = localIndex + 1;
      }
    } else if (offset > SWIPE_THRESHOLD || velocity > 400) {
      if (localIndex > 0) {
        targetIndex = localIndex - 1;
      }
    }

    if (targetIndex !== localIndex) {
      setLocalIndex(targetIndex);
      window.history.pushState(null, "", TABS[targetIndex]);
    }
  };

  // If not one of the main sliding tabs, render normally
  if (pathnameIndex === -1) {
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
            left: localIndex < TABS.length - 1 ? -((localIndex + 1) * width) : -localIndex * width, 
            right: localIndex > 0 ? -((localIndex - 1) * width) : -localIndex * width 
          }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          animate={{ x: -localIndex * width }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          style={{ x: dragX, width: `${TABS.length * 100}%` }}
          className="absolute top-0 bottom-0 flex cursor-grab active:cursor-grabbing"
        >
          <div className="h-full relative overflow-y-auto" style={{ width: `${100 / TABS.length}%`, touchAction: "pan-y" }}>
            <ChatsPage />
          </div>
          <div className="h-full relative overflow-y-auto" style={{ width: `${100 / TABS.length}%`, touchAction: "pan-y" }}>
            <UpdatesPage />
          </div>
          <div className="h-full relative overflow-y-auto" style={{ width: `${100 / TABS.length}%`, touchAction: "pan-y" }}>
            <CommunitiesPage />
          </div>
          <div className="h-full relative overflow-y-auto" style={{ width: `${100 / TABS.length}%`, touchAction: "pan-y" }}>
            <CallsPage />
          </div>
        </motion.div>
      </div>
      {!hideNavbar && (
        <Navigation 
          activeTab={TABS[localIndex].substring(1)} 
          dragX={dragX} 
          width={width} 
          onTabChange={handleTabChange}
        />
      )}
    </div>
  );
}
