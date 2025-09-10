"use client";

import React, { useState, useRef, useEffect } from "react";
import { useScreenSize } from "@/hooks/useResponsive";

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  defaultTab?: string;
  className?: string;
}

export default function ResponsiveTabs({
  tabs,
  defaultTab,
  className = "",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");
  const tabsRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useScreenSize();

  // Scroll active tab into view on mobile
  useEffect(() => {
    if (isMobile && tabsRef.current) {
      const activeTabElement = tabsRef.current.querySelector(
        `[data-tab-id="${activeTab}"]`
      );

      if (activeTabElement) {
        const tabsContainer = tabsRef.current;
        const tabLeft = (activeTabElement as HTMLElement).offsetLeft;
        const tabWidth = (activeTabElement as HTMLElement).offsetWidth;
        const scrollLeft = tabsContainer.scrollLeft;
        const containerWidth = tabsContainer.offsetWidth;

        // Calculate the center position for the tab
        const centerPos = tabLeft - containerWidth / 2 + tabWidth / 2;

        tabsContainer.scrollTo({
          left: centerPos,
          behavior: "smooth",
        });
      }
    }
  }, [activeTab, isMobile]);

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile-optimized scrollable tabs */}
      <div
        ref={tabsRef}
        className="flex overflow-x-auto no-scrollbar mb-4 border-b border-gray-200"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 whitespace-nowrap text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === tab.id
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
            }`}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTab === tab.id ? "block" : "hidden"}`}
            role="tabpanel"
            aria-labelledby={tab.id}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
