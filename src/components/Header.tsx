"use client";

import React, { useState } from "react";

interface HeaderProps {
  lang: "ar" | "en";
  setLang: (lang: "ar" | "en") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({ lang, setLang, searchQuery, setSearchQuery }: HeaderProps) {
  const isRtl = lang === "ar";
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="w-full bg-black/90 backdrop-blur-md border-b border-neutral-900/60 sticky top-0 z-50 transition-all duration-300">
      {/* Top subtle brand bar */}
      <div className="w-full bg-neutral-950 border-b border-neutral-900/40 py-1.5 px-4 text-center">
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-400">
          {isRtl ? "✦ تجربة تذوق استثنائية بلونين ✦" : "✦ An Exceptional Two-Tone Culinary Experience ✦"}
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
        {/* Left Side: Language Toggle (Minimal & Styled) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="relative px-3.5 py-1.5 rounded-md border border-neutral-800 text-[10px] font-black uppercase tracking-wider text-neutral-400 hover:text-white hover:border-white transition-all duration-300 bg-neutral-950"
            aria-label="Toggle language"
            id="lang-toggle-desktop"
          >
            {lang === "ar" ? "English" : "عربي"}
            {/* Tiny dot indicator */}
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-300"></span>
            </span>
          </button>
        </div>

        {/* Center: Branding & Logo */}
        <div className="flex flex-col items-center justify-center text-center select-none absolute left-1/2 -translate-x-1/2">
          <h1 className="text-xl md:text-2xl font-black tracking-[0.3em] font-heading text-white flex items-center gap-2 uppercase">
            BLACK<span className="text-neutral-500 font-light">&</span>WHITE
          </h1>
          <p className="hidden md:block text-[9px] text-neutral-500 font-extrabold uppercase tracking-[0.35em] mt-1">
            {isRtl ? "القائمة المحدودة الفاخرة" : "Exclusive Premium Menu"}
          </p>
        </div>

        {/* Right Side: Search bar (Beautiful & Expandable) */}
        <div className="flex items-center justify-end w-40 md:w-64">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder={isRtl ? "ابحث هنا..." : "Search..."}
              className={`w-full px-3.5 py-1.5 bg-neutral-950 border rounded-md text-xs text-white placeholder-neutral-600 focus:outline-none transition-all duration-300 ${
                isSearchFocused || searchQuery
                  ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.08)] md:w-64"
                  : "border-neutral-800 hover:border-neutral-700"
              }`}
              style={{ direction: isRtl ? "rtl" : "ltr" }}
              id="menu-search-input"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-[10px] font-black uppercase"
                aria-label="Clear search"
              >
                {isRtl ? "مسح" : "Clear"}
              </button>
            ) : (
              <span className={`absolute top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none text-[11px] ${
                isRtl ? "left-3" : "right-3"
              }`}>
                🔍
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
