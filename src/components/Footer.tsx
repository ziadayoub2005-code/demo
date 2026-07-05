"use client";

import React from "react";
import LogoSVG from "@/components/LogoSVG";
import Link from "next/link";

export default function Footer({ lang = "ar" }: { lang?: "ar" | "en" }) {
  const isRtl = lang === "ar";
  
  return (
    <footer className="w-full border-t border-neutral-900/60 py-12 bg-neutral-950/20 relative z-10 text-neutral-500 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-start" style={{ direction: isRtl ? "rtl" : "ltr" }}>
        
        {/* Brand & Logo */}
        <div className="flex flex-col gap-2 items-center md:items-start select-none">
          <div className="w-16 h-16 relative mb-2 opacity-55">
            <LogoSVG className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-light">
            {isRtl ? "فن الطهو بلونين" : "Culinary art in black and white"}
          </span>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">
            {isRtl ? "روابط سريعة" : "Quick Links"}
          </h4>
          <Link href="/menu" className="text-sm hover:text-white transition-colors">{isRtl ? "القائمة" : "Menu"}</Link>
          <Link href="/about" className="text-sm hover:text-white transition-colors">{isRtl ? "من نحن" : "About Us"}</Link>
          <Link href="/contact" className="text-sm hover:text-white transition-colors">{isRtl ? "تواصل معنا" : "Contact"}</Link>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">
            {isRtl ? "تابعنا" : "Follow Us"}
          </h4>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              {/* Instagram Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              {/* Twitter/X Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              {/* Snapchat Icon (custom shape approx) */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.666 4.354a3.123 3.123 0 0 0 -1.5 5.5v.5c-.6 0 -1.332 -1 -1.332 -1s-.906 -1 -1.416 -1c-.496 0 -1.026 .648 -1.026 1.406c0 1.258 2.062 2.64 2.87 3.328c.478 .4 1.188 .828 2.238 .828v1a2 2 0 0 1 -2 2a1.83 1.83 0 0 0 -1 3.5h7c1.332 0 2.5 -1.258 2.5 -2.5c0 -1.258 -1.168 -2.5 -2.5 -2.5a2 2 0 0 1 -2 -2v-1c1.05 0 1.76 -.428 2.238 -.828c.808 -.688 2.87 -2.07 2.87 -3.328c0 -.758 -.53 -1.406 -1.026 -1.406c-.51 0 -1.416 1 -1.416 1s-.732 1 -1.332 1v-.5a3.123 3.123 0 0 0 -1.5 -5.5z"></path></svg>
            </a>
          </div>
        </div>
        
      </div>
      
      <div className="max-w-6xl mx-auto px-6 mt-12 text-center text-[10px] font-medium tracking-widest text-neutral-600">
        © {new Date().getFullYear()} {isRtl ? "بلاك وايت. جميع الحقوق محفوظة." : "BLACK WHITE. All rights reserved."}
      </div>
    </footer>
  );
}
