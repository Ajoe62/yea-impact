"use client";

import { useState, useEffect, ReactNode } from 'react';

interface ResponsiveColumnProps {
  children: ReactNode;
  className?: string;
  desktop?: 1 | 2 | 3 | 4 | 6 | 12;
  tablet?: 1 | 2 | 3 | 4 | 6 | 12; 
  mobile?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// Column layout component that adapts to screen size
export default function ResponsiveGrid({
  children,
  className = '',
  desktop = 3, // Default to 3 columns on desktop
  tablet = 2,  // Default to 2 columns on tablet
  mobile = 1,  // Default to 1 column on mobile
  gap = 'md'
}: ResponsiveColumnProps) {
  // Map number of columns to corresponding Tailwind classes
  const columnMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };

  // Map gap sizes to Tailwind classes
  const gapMap = {
    'none': 'gap-0',
    'xs': 'gap-1',
    'sm': 'gap-2',
    'md': 'gap-4',
    'lg': 'gap-6',
    'xl': 'gap-8',
  };

  return (
    <div 
      className={`grid grid-cols-${mobile} sm:${columnMap[tablet]} lg:${columnMap[desktop]} ${gapMap[gap]} ${className}`}
    >
      {children}
    </div>
  );
}

// Responsive Card that adapts to container/parent width
export function ResponsiveCard({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string 
}) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md ${className}`}>
      {children}
    </div>
  );
}

// A responsive container with adaptive padding based on screen size
export function ResponsiveContainer({ 
  children, 
  className = '',
  fluid = false,
}: { 
  children: ReactNode; 
  className?: string;
  fluid?: boolean; 
}) {
  return (
    <div className={`
      ${fluid ? 'w-full' : 'container mx-auto'} 
      px-4 sm:px-6 md:px-8 
      ${className}`
    }>
      {children}
    </div>
  );
}

// A section with responsive spacing
export function ResponsiveSection({ 
  children, 
  className = '',
  spacing = 'md',
}: { 
  children: ReactNode; 
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl'; 
}) {
  // Map spacing to Tailwind classes
  const spacingMap = {
    'sm': 'py-4 md:py-6',
    'md': 'py-6 md:py-10',
    'lg': 'py-8 md:py-12',
    'xl': 'py-10 md:py-16',
  };

  return (
    <section className={`${spacingMap[spacing]} ${className}`}>
      {children}
    </section>
  );
}
