"use client";

import { useRef, ReactNode, useEffect, useState } from "react";
import { motion, useInView, Variant, useAnimation } from "framer-motion";
import useScroll from "@/hooks/useScroll";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scale";
  threshold?: number;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  once = false,
  animation = "fadeIn",
  threshold = 0.2, // How much of the element needs to be in view
}: AnimatedSectionProps) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const { scrolling, direction } = useScroll();

  // Use a more configurable way to detect when element is in view
  const isInView = useInView(ref, {
    once,
    margin: "-10% 0px -10% 0px",
    amount: threshold,
  });

  // This effect runs whenever the scroll position or element visibility changes
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [isInView, controls, once, scrolling]);

  // Define animation variants with smoother, more subtle animations
  const variants = {
    hidden: {
      opacity: 0,
      y: animation === "slideUp" ? 15 : 0, // Even more subtle
      x: animation === "slideLeft" ? 15 : animation === "slideRight" ? -15 : 0,
      scale: animation === "scale" ? 0.98 : 1,
    } as Variant,
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.9, // Even smoother animation
        ease: "easeOut",
        delay: delay || 0,
      },
    } as Variant,
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{ type: "tween" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
