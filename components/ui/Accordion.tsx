"use client";

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

interface AccordionProps {
  title: string;
  children: ReactNode;
  initiallyOpen?: boolean;
  className?: string;
}

export default function Accordion({ 
  title, 
  children, 
  initiallyOpen = false,
  className = '',
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <button
        className="flex justify-between items-center w-full py-4 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-gray-800">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pb-4 text-gray-600"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
