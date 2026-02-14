// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use client";

import Image from "next/image";
import { useState } from "react";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  quality?: number;
  onLoad?: () => void;
}

/**
 * A responsive image component that:
 * 1. Uses proper sizing strategies
 * 2. Implements loading states
 * 3. Provides responsive sizes
 * 4. Has fallback for loading failures
 */
export default function ResponsiveImage({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  fill = false,
  quality = 85,
  onLoad,
}: ResponsiveImageProps) {
  const [isLoading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`overflow-hidden relative ${
        isLoading ? "bg-gray-100 animate-pulse" : ""
      } ${className}`}
    >
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          className={`transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          } ${fill ? "object-cover" : ""}`}
          onLoad={() => {
            setLoading(false);
            if (onLoad) onLoad();
          }}
          onError={() => {
            setLoading(false);
            setHasError(true);
          }}
          sizes={sizes}
          quality={quality}
          priority={priority}
          fill={fill}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 opacity-75"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

/**
 * Background image component that adapts to container size
 */
export function ResponsiveBackground({
  src,
  alt,
  className = "",
  priority = false,
  quality = 85,
  children,
}: ResponsiveImageProps & { children?: React.ReactNode }) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className={`transition-opacity duration-500 z-0 object-cover ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setLoading(false)}
        quality={quality}
        priority={priority}
        sizes="100vw"
      />
      {/* Optional overlay */}
      {!isLoading && children}
    </div>
  );
}
