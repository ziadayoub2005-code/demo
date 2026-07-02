"use client";

import React, { useEffect } from "react";
import { MenuItem } from "@/data/menuData";

interface ItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  lang: "ar" | "en";
}

export default function ItemModal({ item, isOpen, onClose, lang }: ItemModalProps) {
  const isRtl = lang === "ar";

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const displayName = lang === "ar" ? item.name : item.nameEn;
  const displayDescription = lang === "ar" ? item.description : item.descriptionEn;
  const displayIngredients = lang === "ar" ? item.ingredients : item.ingredientsEn;
  const displayOptions = item.options;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadein"
      onClick={onClose}
      id="item-details-modal-overlay"
    >
      <div
        className="relative w-full max-w-lg bg-neutral-950 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-2xl max-h-[85vh] sm:max-h-none overflow-y-auto sm:overflow-visible shadow-[0_0_50px_rgba(255,255,255,0.06)] animate-slideup p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
        style={{ direction: isRtl ? "rtl" : "ltr" }}
        id="item-details-modal"
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1 bg-neutral-800 rounded-full mx-auto mb-5 sm:hidden" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 rtl:left-auto rtl:right-4 text-neutral-500 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 p-2 rounded-full transition-all duration-200"
          aria-label="Close modal"
          id="close-modal-btn"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Category Tag */}
        <div className="mb-2 mt-2 sm:mt-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 border border-neutral-900 px-2.5 py-1 rounded bg-neutral-950">
            {item.category}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-black font-heading text-white tracking-wide mb-3">
          {displayName}
        </h2>

        {/* Description */}
        {displayDescription && (
          <p className="text-sm md:text-base text-neutral-400 font-light leading-relaxed mb-6">
            {displayDescription}
          </p>
        )}

        {/* Ingredients Section */}
        {displayIngredients && displayIngredients.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3 border-b border-neutral-900 pb-2">
              {isRtl ? "المكونات الأساسية" : "Main Ingredients"}
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm text-neutral-300 font-medium">
              {displayIngredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Options / Pricing / Sizes Section */}
        {displayOptions && (
          <div className="mb-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3 border-b border-neutral-900 pb-2">
              {isRtl ? displayOptions.label : displayOptions.labelEn}
            </h4>
            <div className="flex flex-col gap-2">
              {displayOptions.items.map((opt, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-neutral-900 bg-neutral-950/40 hover:border-neutral-800 transition-colors duration-200"
                >
                  <span className="text-sm text-neutral-200 font-semibold">
                    {lang === "ar" ? opt.name : opt.nameEn}
                  </span>
                  {opt.price && (
                    <span className="text-sm text-white font-extrabold font-heading">
                      {opt.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close CTA */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="w-full md:w-auto px-6 py-3 bg-white text-black font-extrabold text-sm rounded-lg hover:bg-neutral-200 transition-all duration-300 uppercase tracking-wider"
            id="modal-close-confirm-btn"
          >
            {isRtl ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
