"use client";

import React from "react";

interface MarqueeTextProps {
  text: string;
  tilt?: number; // angle in degrees
  theme?: "gold" | "dark";
  direction?: "left" | "right";
}

export default function MarqueeText({ 
  text, 
  tilt = 0, 
  theme = "gold",
  direction = "left" 
}: MarqueeTextProps) {
  // Duplicating text to ensure a seamless infinite loop
  const duplicatedText = Array(15).fill(text).join("  •  ");

  const bgClass = theme === "gold" ? "bg-[#D4AF37] border-[#B8942E]" : "bg-[#0a0a0a] border-neutral-800";
  const textClass = theme === "gold" ? "text-black" : "text-white";
  const animationClass = direction === "left" ? "animate-marquee" : "animate-marquee-reverse";

  return (
    <div 
      className={`w-[110%] -ml-[5%] border-y py-4 overflow-hidden flex items-center select-none shadow-2xl relative z-20 ${bgClass}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className={`whitespace-nowrap flex items-center ${animationClass}`}>
        <span className={`font-black uppercase tracking-[0.25em] text-xs md:text-sm mx-4 ${textClass}`}>
          {duplicatedText}
        </span>
        <span className={`font-black uppercase tracking-[0.25em] text-xs md:text-sm mx-4 ${textClass}`}>
          {duplicatedText}
        </span>
      </div>
      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
          display: inline-block;
          animation: marquee-reverse 40s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        /* RTL support: we ensure the marquee always flows consistently */
        :global([dir="rtl"]) .animate-marquee {
           animation: marquee-rtl 40s linear infinite;
        }
        :global([dir="rtl"]) .animate-marquee-reverse {
           animation: marquee-rtl-reverse 40s linear infinite;
        }
        @keyframes marquee-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(50%);
          }
        }
        @keyframes marquee-rtl-reverse {
          0% {
            transform: translateX(50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
