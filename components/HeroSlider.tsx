// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

// Define the image data
const heroImages = [
  {
    src: "/images/yea_banner.jpg",
    alt: "Young Africans engaged in skill development and leadership activities",
  },
  {
    src: "/images/yea_banner-1.jpg",
    alt: "YEA Foundation community outreach program",
  },
  {
    src: "/images/yea_banner-2.jpg",
    alt: "Youth empowerment workshop in Africa",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    loop: true,
    slides: {
      perView: 1,
      spacing: 0,
    },
  });

  // Auto advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (instanceRef.current) {
        instanceRef.current.next();
      }
    }, 5000); // Change slide every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [instanceRef]);

  return (
    <div className="relative h-full">
      <div ref={sliderRef} className="keen-slider h-full">
        {heroImages.map((image, idx) => (
          <div key={idx} className="keen-slider__slide relative h-full">
            {/* Use onLoadingComplete to ensure the image is loaded correctly */}
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover rounded-lg"
              priority={idx === 0} // Only prioritize the first image
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      {loaded && instanceRef.current && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === idx ? "bg-white w-6" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
