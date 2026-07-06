"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MenuItem } from "@/data/menuData";
import { Plus } from "lucide-react";
import SaudiRiyalIcon from "./SaudiRiyalIcon";

interface MenuItemCardProps {
  item: MenuItem;
  lang: "ar" | "en";
  onOpen: () => void;
}

export default function MenuItemCard({ item, lang, onOpen }: MenuItemCardProps) {
  const isRtl = lang === "ar";

  const displayName = isRtl ? item.name : item.nameEn;
  let displayDescription = isRtl ? item.description : item.descriptionEn;
  
  if (!displayDescription && item.ingredients && item.ingredients.length > 0) {
    displayDescription = item.ingredients.join(" + ");
  }

  const currentPrice = item.price;

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        className="group relative flex flex-col bg-[#0a0a0a] border border-neutral-900 rounded-3xl overflow-hidden transition-all duration-500 hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] cursor-pointer h-full"
        id={`item-card-${item.id}`}
        onClick={onOpen}
      >
        {/* Product Image */}
        {item.image ? (
          <div className="w-full h-56 relative overflow-hidden bg-black flex-shrink-0">
            <Image
              src={item.image}
              alt={displayName}
              fill
              unoptimized={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            {/* Elegant overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            
            {/* Price Badge - Floating and Chic */}
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest shadow-xl flex items-center gap-1.5">
              <span>{currentPrice}</span>
              <SaudiRiyalIcon className="w-2.5 h-3 text-white" />
            </div>
          </div>
        ) : (
          <div className="w-full h-32 bg-neutral-900 flex items-center justify-center border-b border-neutral-800">
             <span className="text-neutral-700 text-sm font-light uppercase tracking-widest">
               {isRtl ? "لا توجد صورة" : "No Image"}
             </span>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 relative">
          <div className="mb-6">
            <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider text-white">
              {displayName}
            </h3>
            {displayDescription && (
              <p className="text-xs text-neutral-300 font-light leading-relaxed mt-2 line-clamp-2">
                {displayDescription}
              </p>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between">
            {!item.image && (
               <div className="font-bold text-sm tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                 <span>{currentPrice}</span>
                 <SaudiRiyalIcon className="w-2.5 h-3 text-white" />
               </div>
            )}
            
            {/* Sleek Add Button */}
            <button
              className={`ml-auto rtl:mr-auto rtl:ml-0 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 bg-white text-black hover:bg-[#D4AF37] hover:scale-110 shadow-lg`}
              aria-label={isRtl ? "أضف للسلة" : "Add to Cart"}
            >
              <Plus className="w-5 h-5" strokeWidth={3} />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
