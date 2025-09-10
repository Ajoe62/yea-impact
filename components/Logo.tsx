"use client";

import React from 'react';
import Image from 'next/image';
import { useState } from 'react';

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
          width={140}
          height={40}
          className="object-contain"
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-700 rounded-full mr-2 flex items-center justify-center text-white font-bold">
            Y
          </div>
          <span className="text-xl font-bold text-green-700">
            YEA Foundation
          </span>
        </div>
      )}
    </div>
  );
}
