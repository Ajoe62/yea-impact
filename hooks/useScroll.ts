// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use client";

import { useState, useEffect } from "react";

interface ScrollInfo {
  scrollY: number;
  direction: "up" | "down" | null;
  scrolling: boolean;
}

export default function useScroll(): ScrollInfo {
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    scrollY: 0,
    direction: null,
    scrolling: false,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    let scrollTimeout: NodeJS.Timeout;

    const updateScrollInfo = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";

      setScrollInfo({
        scrollY,
        direction,
        scrolling: true,
      });

      lastScrollY = scrollY;
      ticking = false;

      // Reset scrolling state after scrolling stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrollInfo((prev) => ({ ...prev, scrolling: false }));
      }, 150);
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollInfo);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return scrollInfo;
}
