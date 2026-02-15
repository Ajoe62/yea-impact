// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use client";

import { ReactNode, useEffect } from "react";
import ResponsiveLayout from "@/components/ResponsiveLayout";

// Import responsive hooks
import { useScreenSize, useOrientation } from "@/hooks/useResponsive";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function PageWrapper({
  children,
  className = "",
}: PageWrapperProps) {
  const { isMobile } = useScreenSize();
  const { isPortrait } = useOrientation();

  // Handle iOS viewport height issues (common mobile responsive bug)
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);

    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

  return (
    <div
      className={`min-h-[calc(100vh-var(--header-height,48px)-var(--footer-height,120px))] ${className}`}
      style={{
        minHeight:
          "calc(100vh - var(--header-height,48px) - var(--footer-height,120px))",
      }}
    >
      {children}
    </div>
  );
}
