"use client";

import React from "react";
import Image from "next/image";
import { useState } from "react";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`flex items-center ${className}`}>
      {!imageError ? (
        <Image
          src="/images/yea_logo.png"
          alt="YEA Foundation Logo"
          width={120}
          height={32}
          className="object-contain"
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex items-center">
          <div className="w-7 h-7 bg-green-700 rounded-full mr-2 flex items-center justify-center text-white font-bold">
            Y
          </div>
          <span className="text-base font-bold text-green-700">
            YEA Foundation
          </span>
        </div>
      )}
    </div>
  );
}
