"use client";

import React from "react";
import { MenuItem } from "@/data/menuData";

interface MenuItemCardProps {
  item: MenuItem;
  lang: "ar" | "en";
  onSelect?: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, lang }: MenuItemCardProps) {
  const isRtl = lang === "ar";

  const displayName = lang === "ar" ? item.name : item.nameEn;
  const displayDescription = lang === "ar" ? item.description : item.descriptionEn;
  const displayIngredients = lang === "ar" ? item.ingredients : item.ingredientsEn;

  const isCompact = false;
  const showImage = !isCompact && !!item.image;
  return (
    <div
      className="group relative overflow-hidden bg-neutral-950/40 border border-neutral-900/80 backdrop-blur-md rounded-2xl p-5 md:p-6 transition-all duration-500 hover:border-white hover:shadow-[0_0_35px_rgba(255,255,255,0.06)] hover:-translate-y-1.5 flex flex-col justify-between text-center h-full w-full"
      id={`item-card-${item.id}`}
    >
      {/* Premium Shimmer Sweep on Hover */}
      <div className="shimmer-line" />

      <div className="flex flex-col h-full justify-between gap-4">
        {isCompact ? (
          // COMPACT LAYOUT (Sauces, Sides, Drinks) - Direct, Beautiful, Centered
          <div className="flex flex-col items-center justify-center gap-3 w-full h-full my-auto">
            <span className="text-[7px] font-black uppercase tracking-[0.25em] text-neutral-600">
              {item.category}
            </span>
            <h3 className="text-sm md:text-base font-black text-white tracking-wide uppercase transition-colors duration-300 group-hover:text-white">
              {displayName}
            </h3>

            {/* Displaying direct options and prices */}
            {item.options && (
              <div className="flex flex-col items-center gap-1.5 mt-1 w-full">
                <div className="flex flex-wrap justify-center gap-1.5">
                  {item.options.items.map((opt, i) => (
                    <div
                      key={i}
                      className="text-[9px] font-black text-neutral-200 bg-neutral-950 border border-neutral-900 px-2 py-0.5 rounded flex items-center gap-1.5"
                    >
                      <span>{lang === "ar" ? opt.name : opt.nameEn}</span>
                      {opt.price && (
                        <span className="text-white font-extrabold border-l border-neutral-800 pl-1.5 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-1.5">
                          {opt.price}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // STANDARD CARD LAYOUT (Burgers, Pasta, Buckets, Desserts, Bites)
          <div className="flex flex-col h-full justify-between gap-4">
            
            {/* Framed Image (Inset, NOT Full Bleed - looks like an art frame) */}
            {showImage && (
              <div className="w-full relative overflow-hidden">
                <img
                  src={item.image}
                  alt={displayName}
                  className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Clean dark vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                
                {/* Floating category marker */}
                <span className="absolute top-3 left-3 text-[7px] font-black uppercase tracking-[0.2em] text-neutral-400 border border-neutral-800 bg-black/85 px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </div>
            )}

            {/* Content Details */}
            <div className="flex flex-col items-center gap-3">
              {/* Product Title */}
              <h3 className="text-lg md:text-xl font-black uppercase tracking-wider text-white transition-colors duration-300 group-hover:text-white mt-1">
                {displayName}
              </h3>

              {/* Product Description */}
              {displayDescription && (
                <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-xs text-center">
                  {displayDescription}
                </p>
              )}

              {/* In-Card Full Ingredients List (Slashes Style) */}
              {displayIngredients && displayIngredients.length > 0 && (
                <p className="text-[10px] md:text-xs text-neutral-300 font-bold tracking-wide leading-relaxed text-center max-w-xs uppercase mt-1">
                  {displayIngredients.join("  /  ")}
                </p>
              )}

              {/* Direct In-Card Options & Pricing Grid (No details modal needed!) */}
              {item.options && (
                <div className="flex flex-col items-center gap-2 mt-3 w-full border-t border-neutral-900/60 pt-3">
                  <span className="text-[8px] font-black text-neutral-500 uppercase tracking-[0.25em]">
                    {lang === "ar" ? item.options.label : item.options.labelEn}
                  </span>
                  <div className="flex justify-center gap-1.5 flex-wrap w-full">
                    {item.options.items.map((opt, i) => (
                      <div
                        key={i}
                        className="text-[9px] font-black text-neutral-200 bg-neutral-950 border border-neutral-900 px-3 py-1 rounded flex items-center gap-2 group-hover:border-neutral-800 transition-colors duration-300"
                      >
                        <span>{lang === "ar" ? opt.name : opt.nameEn}</span>
                        {opt.price && (
                          <span className="text-white font-extrabold border-l border-neutral-800 pl-2 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-2">
                            {opt.price}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
