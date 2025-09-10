"use client";

import { useState, useEffect } from "react";

// Screen size breakpoints that match Tailwind's defaults
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

// Hook to detect screen size
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({
        width,
        height,
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg,
      });
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
}

// Hook to detect device orientation
export function useOrientation() {
  const [orientation, setOrientation] = useState({
    isPortrait: true,
    isLandscape: false,
    angle: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOrientationChange = () => {
      const angle = window.screen.orientation
        ? window.screen.orientation.angle
        : window.orientation || 0;
      const isPortrait = angle === 0 || angle === 180;
      const isLandscape = angle === 90 || angle === -90;

      setOrientation({
        isPortrait,
        isLandscape,
        angle,
      });
    };

    // Set initial orientation
    handleOrientationChange();

    // Add event listener
    window.addEventListener("orientationchange", handleOrientationChange);

    // Clean up
    return () =>
      window.removeEventListener("orientationchange", handleOrientationChange);
  }, []);

  return orientation;
}

// Hook for detecting touch support
export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore
      navigator.msMaxTouchPoints > 0;

    setIsTouch(isTouchDevice);
  }, []);

  return isTouch;
}

// Hook for detecting scroll position
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
    direction: "none" as "up" | "down" | "none",
    lastY: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const direction =
            currentScrollY > lastScrollY
              ? "down"
              : currentScrollY < lastScrollY
              ? "up"
              : "none";

          setScrollPosition({
            x: window.scrollX,
            y: currentScrollY,
            direction,
            lastY: lastScrollY,
          });

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    // Set initial position
    setScrollPosition({
      x: window.scrollX,
      y: window.scrollY,
      direction: "none",
      lastY: window.scrollY,
    });

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollPosition;
}
