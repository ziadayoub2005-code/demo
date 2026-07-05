"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";

interface ItemModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  lang: "ar" | "en";
}

export default function ItemModal({ item, isOpen, onClose, lang }: ItemModalProps) {
  const isRtl = lang === "ar";
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedOptions({});
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOptionSelect = (attrId: number, valId: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [attrId]: valId
    }));
  };

  const calculateTotal = () => {
    let total = item.price;
    if (item.attributes) {
      item.attributes.forEach(attr => {
        const selectedValId = selectedOptions[attr.id];
        if (selectedValId) {
          const val = attr.values.find(v => v.id === selectedValId);
          if (val && val.price_extra) {
            total += val.price_extra;
          }
        }
      });
    }
    return total * quantity;
  };

  const handleAddToCart = () => {
    const selectedAttributes = item.attributes?.map(attr => {
      const selectedValId = selectedOptions[attr.id];
      if (selectedValId) {
        const val = attr.values.find(v => v.id === selectedValId);
        return {
          name: attr.name,
          nameEn: attr.name,
          price: val!.price_extra
        };
      }
      return null;
    }).filter(Boolean) as any[];

    addToCart(item, quantity, "", selectedAttributes);
    
    onClose();
  };

  const displayName = isRtl ? item.name : item.nameEn;
  let displayDescription = isRtl ? item.description : item.descriptionEn;
  if (!displayDescription && item.ingredients && item.ingredients.length > 0) {
    displayDescription = item.ingredients.join(" + ");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg max-h-[90vh] bg-[#0a0a0a] border border-neutral-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10"
          >
            {/* Image Header */}
            <div className="relative w-full h-64 bg-black flex-shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={displayName}
                  fill
                  unoptimized={true}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-neutral-700 tracking-widest uppercase text-sm">
                    {isRtl ? "لا توجد صورة" : "No Image"}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-full border border-white/10 hover:bg-white hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-neutral-800">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white mb-2">
                {displayName}
              </h2>
              {displayDescription && (
                <p className="text-neutral-400 text-sm leading-relaxed font-light mb-8">
                  {displayDescription}
                </p>
              )}

              {item.attributes && item.attributes.length > 0 && (
                <div className="space-y-8 mb-8">
                  {item.attributes.map((attr) => (
                    <div key={attr.id} className="flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                        <h4 className="font-bold uppercase tracking-widest text-[#D4AF37] text-sm">
                          {attr.name}
                        </h4>
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 bg-neutral-900 px-2 py-1 rounded">
                          {isRtl ? "اختر" : "Select"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {attr.values.map((val) => {
                          const isSelected = selectedOptions[attr.id] === val.id;
                          return (
                            <button
                              key={val.id}
                              onClick={() => handleOptionSelect(attr.id, val.id)}
                              className={`flex flex-col p-3 rounded-xl border text-start transition-all duration-300 ${
                                isSelected 
                                  ? "border-[#D4AF37] bg-[#D4AF37]/10" 
                                  : "border-neutral-800 bg-neutral-900 hover:border-neutral-700"
                              }`}
                            >
                              <span className={`text-sm font-bold ${isSelected ? "text-white" : "text-neutral-300"}`}>
                                {val.name}
                              </span>
                              {val.price_extra > 0 && (
                                <span className="text-xs text-neutral-500 mt-1">
                                  +{val.price_extra} {isRtl ? "ر.س" : "SAR"}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-[#050505] border-t border-neutral-900 flex items-center gap-4">
              <div className="flex items-center gap-4 bg-neutral-900 rounded-full px-2 py-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:bg-neutral-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-black w-4 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:bg-neutral-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-[#D4AF37] text-black py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-white transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                {isRtl ? "إضافة" : "Add"} • {calculateTotal()} {isRtl ? "ر.س" : "SAR"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
