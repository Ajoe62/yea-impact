// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use client";

import { useState } from "react";
import Image from "next/image";

export default function Logo() {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="flex items-center">
        <div className="w-7 h-7 bg-blue-700 rounded-full mr-2 flex items-center justify-center text-white font-bold">
          Y
        </div>
        <span className="text-base font-bold text-blue-700">
          YEA Foundation
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <div className="relative">
        <Image
          src="/images/yea_logo.png"
          alt="YEA Foundation Logo"
          width={120}
          height={32}
          className="object-contain"
          priority
          onError={() => setImageError(true)}
        />
      </div>
    </div>
  );
}
