// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use client";

import { useState, useEffect } from "react";

export default function useScroll() {
  const [scrolling, setScrolling] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        setDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setDirection("up");
      }

      setLastScrollY(currentScrollY);
      setScrolling(true);

      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set scrolling to false after user stops scrolling
      timeoutId = setTimeout(() => {
        setScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [lastScrollY]);

  return { scrolling, direction };
}
