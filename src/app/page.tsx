"use client";

import React, { useState, useEffect } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import LogoSVG from "@/components/LogoSVG";
import { categories, menuItems, MenuItem } from "@/data/menuData";

export default function Home() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  
  // Cinematic Intro Phases:
  // "loading" - Logo is centered, large, doing electric draw.
  // "transitioning" - Logo shrinks and flies up, rest of page fades in.
  // "completed" - Intro overlay is unmounted, standard document flow runs.
  const [introPhase, setIntroPhase] = useState<"loading" | "transitioning" | "completed">("loading");

  const isRtl = lang === "ar";

  // Sync document attributes (dir and lang) on client side
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Timers for Intro phases
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIntroPhase("transitioning");
    }, 2500); // 2.5s centered draw

    const timer2 = setTimeout(() => {
      setIntroPhase("completed");
    }, 3700); // 1.2s smooth slide transition

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Filter items based on search query
  const filteredItems = menuItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = item.name.toLowerCase().includes(query) || item.nameEn.toLowerCase().includes(query);
    const descMatch = (item.description?.toLowerCase().includes(query)) || (item.descriptionEn?.toLowerCase().includes(query));
    const ingredientsMatch = item.ingredients?.some(i => i.toLowerCase().includes(query)) || item.ingredientsEn?.some(i => i.toLowerCase().includes(query));
    return nameMatch || descMatch || ingredientsMatch;
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white relative bg-grid-dots pb-20 overflow-x-hidden">
      
      {/* CINEMATIC LOGO INTRO SCREEN */}
      {introPhase !== "completed" && (
        <div
          className={`fixed inset-0 bg-black z-50 flex items-center justify-center transition-all duration-[1200ms] ease-in-out ${
            introPhase === "transitioning" ? "bg-transparent pointer-events-none" : ""
          }`}
        >
          {/* Ambient Volumetric Backdrop Glow */}
          <div className={`absolute w-96 h-96 md:w-[600px] md:h-[600px] rounded-full bg-white/10 blur-[110px] pointer-events-none transition-opacity duration-1000 ${
            introPhase === "loading" ? "opacity-100 animate-pulse" : "opacity-0"
          }`} />

          <div
            className={`transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) transform ${
              introPhase === "loading"
                ? "scale-100 translate-y-0"
                : "scale-[0.8] md:scale-[0.78] -translate-y-[calc(50vh-128px)] md:-translate-y-[calc(50vh-184px)]"
            }`}
          >
            {/* The Logo shines with a liquid silver sweep and glows like a portal */}
            <LogoSVG
              className="w-40 h-40 md:w-56 md:h-56 filter drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]"
              animate={introPhase === "loading"}
            />
          </div>
        </div>
      )}

      {/* Floating Language Switcher */}
      <button
        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
        className={`fixed top-6 left-6 rtl:left-auto rtl:right-6 z-40 px-4 py-2 rounded-full border border-neutral-800 text-[10px] font-black uppercase tracking-wider text-neutral-400 bg-black/90 backdrop-blur-md hover:text-white hover:border-white transition-all duration-500 shadow-lg ${
          introPhase === "loading" ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        id="lang-toggle-floating"
      >
        {lang === "ar" ? "English" : "عربي"}
      </button>

      {/* Main Container - Fades in as the logo flies up */}
      <main 
        className={`flex-1 max-w-5xl mx-auto w-full px-6 pt-16 md:pt-24 z-10 transition-opacity duration-[1200ms] ease-out ${
          introPhase === "loading" ? "opacity-0" : "opacity-100"
        }`}
      >
        
        {/* BRAND HERO SECTION */}
        <section className="flex flex-col items-center justify-center text-center mb-16 select-none">
          {/* Main Logo SVG Wrapper - hidden during transition to prevent double rendering */}
          <div 
            className={`w-32 h-32 md:w-44 md:h-44 relative mb-6 transition-opacity duration-300 ${
              introPhase === "completed" ? "opacity-100" : "opacity-0"
            }`}
          >
            <LogoSVG className="w-full h-full object-contain" />
          </div>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-neutral-500 mt-2">
            {isRtl ? "قائمة المأكولات الفاخرة" : "Premium Culinary Menu"}
          </span>
          <div className="w-12 h-[1px] bg-neutral-800 my-6" />
        </section>

        {/* CENTRED SEARCH BAR */}
        <section className="max-w-md mx-auto w-full mb-20">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? "ابحث في القائمة..." : "Search the menu..."}
              className="w-full px-6 py-3 bg-neutral-950 border border-neutral-900 focus:border-white rounded-full text-xs md:text-sm text-white placeholder-neutral-600 focus:outline-none transition-all duration-300 text-center"
              style={{ direction: isRtl ? "rtl" : "ltr" }}
              id="menu-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500 hover:text-white font-black uppercase tracking-wider"
                aria-label="Clear search"
              >
                {isRtl ? "إلغاء" : "Clear"}
              </button>
            )}
          </div>
        </section>

        {/* SEARCH RESULTS OR VERTICAL EDITORIAL LAYOUT */}
        {searchQuery ? (
          // Search Results View
          <section className="animate-slideup">
            <div className="flex flex-col items-center justify-center mb-12 text-center select-none">
              <span className="text-[9px] font-black tracking-[0.4em] text-neutral-500 uppercase mb-2">
                {isRtl ? "البحث" : "Search"}
              </span>
              <h2 className="text-xl md:text-3xl font-black tracking-[0.2em] uppercase font-heading text-white border-y border-neutral-900 py-4 px-10 w-full max-w-md">
                {isRtl ? `نتائج البحث (${filteredItems.length})` : `Search Results (${filteredItems.length})`}
              </h2>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    lang={lang}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 border border-dashed border-neutral-900 rounded-2xl bg-neutral-950/40">
                <span className="text-3xl block mb-4">🔍</span>
                <p className="text-neutral-500 text-xs md:text-sm font-medium">
                  {isRtl
                    ? "لم نجد أي نتائج تطابق بحثك. جرب كلمات أخرى."
                    : "No items match your search. Try using different keywords."}
                </p>
              </div>
            )}
          </section>
        ) : (
          // Editorial Vertical Feed Layout (No tabs, clean vertical hierarchy)
          <div className="flex flex-col gap-20 md:gap-28">
            {categories.map((cat, idx) => {
              const catItems = menuItems.filter((item) => item.category === cat.id);
              if (catItems.length === 0) return null;

              const isCompactCat = ["sauces", "sides", "drinks"].includes(cat.id);

              return (
                <section
                  key={cat.id}
                  id={`category-section-${cat.id}`}
                >
                  {/* Category Title Header (Centered & Bold) */}
                  <div className="flex flex-col items-center justify-center mb-12 text-center select-none">
                    <span className="text-[9px] font-black tracking-[0.4em] text-neutral-500 uppercase mb-2">
                      {String(idx + 1).padStart(2, "0")} / {isRtl ? "قسم" : "Category"}
                    </span>
                    <h2 className="text-xl md:text-3xl font-black tracking-[0.2em] uppercase font-heading text-white border-y border-neutral-900 py-4 px-10 w-full max-w-md">
                      {isRtl ? cat.name : cat.nameEn}
                    </h2>
                  </div>

                  {/* Category Items Grid */}
                  <div className={
                    isCompactCat
                      ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  }>
                    {catItems.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        lang={lang}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-neutral-900/60 py-12 mt-28 bg-neutral-950/20 relative z-10 text-neutral-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          <div className="flex flex-col gap-1 md:items-start select-none">
            <div className="w-16 h-16 relative mb-2 opacity-55">
              <LogoSVG className="w-full h-full object-contain" />
            </div>
            <span className="text-xs font-light">
              {isRtl ? "فن الطهو بلونين" : "Culinary art in black and white"}
            </span>
          </div>
          
          <div className="text-xs font-medium tracking-wide">
            © {new Date().getFullYear()} {isRtl ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </div>
        </div>
      </footer>

      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-white text-black p-3 rounded-full hover:bg-neutral-200 shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95"
          aria-label="Scroll to top"
          id="scroll-to-top-btn"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
