// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import UserMenu from "./UserMenu";

interface NavLink {
  href: string;
  label: string;
}

interface ResponsiveNavbarProps {
  links: NavLink[];
  userEmail?: string | null;
}

export default function ResponsiveNavbar({
  links,
  userEmail,
}: ResponsiveNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled ? "bg-white shadow-md" : "bg-white/95"
      }`}
      style={{ "--header-height": "48px" } as React.CSSProperties}
    >
      <div className="container mx-auto px-4 py-1.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-5 items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-700 transition-colors font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
            {userEmail && <UserMenu userEmail={userEmail} />}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-700 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            aria-label="Toggle menu"
            style={{ padding: "4px" }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
          <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-lg rounded-b-lg py-1 px-4 border-t border-gray-100 z-50 mt-0.5">
            {userEmail && (
              <div className="border-b border-gray-100 py-2 mb-2">
                <p className="text-sm font-medium text-gray-900 px-3">
                  {userEmail}
                </p>
              </div>
            )}
            <nav className="flex flex-col space-y-2 py-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-blue-700 transition-colors py-1.5 px-3 rounded-md hover:bg-gray-50 text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {userEmail && (
                <button
                  onClick={async () => {
                    const { logout } = await import("@/app/logout/actions");
                    await logout();
                  }}
                  className="text-left text-gray-700 hover:text-blue-700 transition-colors py-1.5 px-3 rounded-md hover:bg-gray-50 text-sm"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
