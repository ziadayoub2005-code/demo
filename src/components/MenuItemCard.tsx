"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MenuItem } from "@/data/menuData";
import { useCart } from "@/context/CartContext";

interface MenuItemCardProps {
  item: MenuItem;
  lang: "ar" | "en";
}

export default function MenuItemCard({ item, lang }: MenuItemCardProps) {
  const isRtl = lang === "ar";
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  const displayName = lang === "ar" ? item.name : item.nameEn;
  let displayDescription = lang === "ar" ? item.description : item.descriptionEn;
  
  if (!displayDescription) {
    const ingredients = lang === "ar" ? item.ingredients : item.ingredientsEn;
    if (ingredients && ingredients.length > 0) {
      displayDescription = ingredients.join(" + ");
    }
  }

  const currentPrice = item.options?.items[selectedOptionIndex]?.price || item.price;

  const handleAdd = () => {
    let itemToAdd = item;
    if (item.options && item.options.items.length > 0) {
      const selectedOption = item.options.items[selectedOptionIndex];
      itemToAdd = {
        ...item,
        id: `${item.id}-${selectedOptionIndex}`,
        name: `${item.name} (${selectedOption.name})`,
        nameEn: `${item.nameEn} (${selectedOption.nameEn})`,
        price: selectedOption.price || item.price,
      };
    }
    addToCart(itemToAdd, quantity);
    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className="group relative flex flex-col bg-neutral-950/40 border border-neutral-900/80 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-500 hover:border-neutral-700 hover:shadow-[0_0_35px_rgba(255,255,255,0.06)] hover:-translate-y-1.5 h-full"
      id={`item-card-${item.id}`}
    >
      {/* Product Image */}
      {item.image && (
        <div className="w-full h-48 md:h-56 relative overflow-hidden bg-neutral-900">
          <Image
            src={item.image}
            alt={displayName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Price Badge */}
          <div className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 bg-black/80 backdrop-blur-md border border-neutral-800 text-white font-black px-3 py-1 rounded-full text-sm">
            {currentPrice} SAR
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-wider text-white">
            {displayName}
          </h3>
          {displayDescription && (
            <p className="text-xs text-neutral-400 font-light leading-relaxed mt-2">
              {displayDescription}
            </p>
          )}
        </div>

        {item.options && (
          <div className="mt-2">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 block">
              {lang === "ar" ? item.options.label : item.options.labelEn}
            </label>
            <div className="flex flex-wrap gap-2">
              {item.options.items.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOptionIndex(i)}
                  className={`flex-1 min-w-[70px] py-2 px-2 rounded-xl text-xs font-bold transition-all duration-300 border flex flex-col items-center justify-center gap-0.5 ${
                    selectedOptionIndex === i
                      ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                      : "bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-neutral-200"
                  }`}
                >
                  <span>{lang === "ar" ? opt.name : opt.nameEn}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-neutral-900/60 flex items-center justify-between gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 bg-neutral-900 rounded-full px-1 py-1 border border-neutral-800">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-neutral-400 hover:text-white transition-colors"
            >
              -
            </button>
            <span className="text-sm font-bold w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-neutral-400 hover:text-white transition-colors"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
              added
                ? "bg-green-600 text-white"
                : "bg-white text-black hover:bg-neutral-200"
            }`}
          >
            {added ? (isRtl ? "تمت الإضافة" : "Added") : (isRtl ? "أضف للسلة" : "Add to Cart")}
          </button>
        </div>
      </div>
    </div>
  );
}
