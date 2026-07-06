"use client";

import React, { useRef, useEffect } from "react";
import { Category } from "@/data/menuData";

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  lang: "ar" | "en";
}

export default function CategoryNav({
  categories,
  activeCategory,
  setActiveCategory,
  lang
}: CategoryNavProps) {
  const isRtl = lang === "ar";
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll active item into view inside the horizontal nav container
  useEffect(() => {
    const activeEl = containerRef.current?.querySelector(`[data-category-id="${activeCategory}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });
    }
  }, [activeCategory]);

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    const element = document.getElementById(`category-section-${id}`);
    if (element) {
      const headerOffset = 140; // Height of header + category nav
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="w-full bg-[#000000]/95 backdrop-blur-2xl border-b border-neutral-900 sticky top-[64px] z-40 py-3">
      <div className="max-w-6xl mx-auto px-4">
        <div
          ref={containerRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap py-1 select-none"
          style={{ direction: isRtl ? "rtl" : "ltr" }}
          id="category-nav-scroll-container"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                data-category-id={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
                  isActive
                    ? "bg-white text-black font-extrabold shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-950 border border-transparent hover:border-neutral-900"
                }`}
                id={`cat-btn-${cat.id}`}
              >
                {lang === "ar" ? cat.name : cat.nameEn}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
