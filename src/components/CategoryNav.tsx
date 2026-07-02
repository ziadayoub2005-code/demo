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
    if (activeEl && containerRef.current) {
      const container = containerRef.current;
      const rect = activeEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const scrollOffset = isRtl
        ? (containerRect.right - rect.right) - (containerRect.width / 2) + (rect.width / 2)
        : (rect.left - containerRect.left) - (containerRect.width / 2) + (rect.width / 2);
        
      container.scrollBy({
        left: isRtl ? -scrollOffset : scrollOffset,
        behavior: "smooth"
      });
    }
  }, [activeCategory, isRtl]);

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
    <div className="w-full bw-glass border-b border-neutral-900 sticky top-[72px] md:top-[88px] z-40 py-2.5 transition-all duration-300">
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
