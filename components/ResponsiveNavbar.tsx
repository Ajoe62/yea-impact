"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";

interface MobileNavProps {
  links: {
    href: string;
    label: string;
  }[];
}

export default function ResponsiveNavbar({ links }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      const closeMenu = () => setIsOpen(false);
      document.addEventListener("click", closeMenu);
      return () => document.removeEventListener("click", closeMenu);
    }
  }, [isOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled ? "bg-white shadow-md" : "bg-white/95"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo with fallback */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-green-700 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-green-700 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-lg rounded-b-lg py-2 px-4 border-t border-gray-100 z-50">
            <nav className="flex flex-col space-y-3 py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-green-700 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
