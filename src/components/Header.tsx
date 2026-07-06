"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, X, Globe, Menu, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LogoSVG from "./LogoSVG";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

interface HeaderProps {
  lang: "ar" | "en";
  setLang: (lang: "ar" | "en") => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onOrderSuccess?: () => void;
}

export default function Header({ lang, setLang, searchQuery, setSearchQuery, onOrderSuccess }: HeaderProps) {
  const isRtl = lang === "ar";
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/", labelAr: "الرئيسية", labelEn: "Home" },
    { href: "/menu", labelAr: "القائمة", labelEn: "Menu" },
    { href: "/about", labelAr: "من نحن", labelEn: "About Us" },
    { href: "/contact", labelAr: "تواصل", labelEn: "Contact" },
  ];

  return (
    <>
      <header className="w-full bg-[#000000]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-auto md:py-4 flex items-center justify-between gap-4 relative">
          
          {/* Mobile Cart Button (Fixed in top-left corner without circle outline) */}
          <div className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center justify-center relative text-neutral-400 hover:text-white transition-colors p-2"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#D4AF37] text-black w-4.5 h-4.5 flex items-center justify-center rounded-full text-[8px] font-black border border-black animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Left Side: Language Switcher (Desktop - Globe with Active Letter Overlay) */}
          <div className="hidden md:flex items-center gap-8 flex-1">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors group"
              aria-label="Toggle language"
            >
              <div className="relative w-8 h-8 rounded-full bg-neutral-900/60 border border-neutral-800 flex items-center justify-center">
                <Globe className="w-4 h-4 text-neutral-500 group-hover:rotate-180 transition-transform duration-700" />
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white uppercase">
                  {lang === "ar" ? "AR" : "EN"}
                </span>
              </div>
              <span>{lang === "ar" ? "English" : "العربية"}</span>
            </button>
          </div>

          {/* Mobile Center Logo (Slightly increased size: from w-14 to w-16) */}
          <div className="md:hidden absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            <Link href="/">
              <LogoSVG className="w-16 h-auto filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
            </Link>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden md:flex flex-shrink-0 items-center justify-center gap-8 text-xs font-black uppercase tracking-widest text-neutral-400">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`relative hover:text-white transition-colors py-2 ${pathname === link.href ? "text-white" : ""}`}
              >
                {isRtl ? link.labelAr : link.labelEn}
                {pathname === link.href && (
                  <motion.div 
                    layoutId="header-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]" 
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side: Search (Desktop) */}
          <div className="hidden md:flex flex-1 justify-end">
            {setSearchQuery && typeof searchQuery !== 'undefined' && (
              <div className={`relative transition-all duration-500 ease-out flex items-center bg-[#0a0a0a] rounded-full border ${isSearchFocused || searchQuery ? 'w-full md:w-64 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'w-8 h-8 md:w-48 md:h-auto md:py-2 border-white/5 hover:border-white/10'}`}>
                <div className={`absolute pointer-events-none transition-opacity duration-300 ${isRtl ? 'right-2 md:right-3' : 'left-2 md:left-3'} ${isSearchFocused || searchQuery ? 'text-white' : 'text-neutral-500'}`}>
                  <Search className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder={isRtl ? "ابحث هنا..." : "Search..."}
                  className={`w-full h-full bg-transparent text-xs text-white placeholder-neutral-600 focus:outline-none transition-all duration-300 ${isRtl ? 'pr-8 pl-3 md:pr-9' : 'pl-8 pr-3 md:pl-9'} ${(!isSearchFocused && !searchQuery) ? 'opacity-0 md:opacity-100 cursor-pointer md:cursor-text' : 'opacity-100'}`}
                  style={{ direction: isRtl ? "rtl" : "ltr" }}
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchQuery("")}
                      className={`absolute ${isRtl ? 'left-2 md:left-3' : 'right-2 md:right-3'} text-neutral-400 hover:text-white transition-colors`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Search (if available), Language Switcher, and Hamburger Menu */}
          <div className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 flex flex-row items-center gap-2 z-10" style={{ direction: "ltr" }}>
            {setSearchQuery && typeof searchQuery !== 'undefined' && (
              <div className={`relative transition-all duration-500 ease-out flex items-center ${isSearchFocused || searchQuery ? 'w-36 bg-[#0a0a0a] rounded-full border border-white/20 h-10 px-3' : 'w-8 h-8 justify-center text-neutral-400 hover:text-white'}`}>
                <div className={`${isSearchFocused || searchQuery ? 'absolute pointer-events-none left-3 text-neutral-500' : 'text-neutral-400 hover:text-white cursor-pointer'}`}>
                  <Search className="w-5.5 h-5.5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder={isRtl ? "ابحث..." : "Search..."}
                  className={`w-full h-full bg-transparent text-xs text-white placeholder-neutral-600 focus:outline-none ${isSearchFocused || searchQuery ? 'pl-8 pr-2 opacity-100' : 'absolute inset-0 opacity-0 cursor-pointer'}`}
                  style={{ direction: isRtl ? "rtl" : "ltr" }}
                />
              </div>
            )}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center justify-center relative text-neutral-400 hover:text-white transition-colors p-2"
              aria-label="Toggle language"
            >
              <Globe className="w-5.5 h-5.5 text-neutral-500" />
              <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-white uppercase mt-[2.5px]">
                {lang === "ar" ? "AR" : "EN"}
              </span>
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center justify-center text-neutral-400 hover:text-white transition-colors p-2"
              aria-label="Open menu"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: isRtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 bottom-0 ${isRtl ? 'right-0 border-l' : 'left-0 border-r'} w-64 bg-[#000000] border-neutral-900 z-[70] p-6 flex flex-col md:hidden shadow-2xl`}
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-black uppercase tracking-widest text-[#D4AF37] text-sm">
                  {isRtl ? "القائمة" : "Menu"}
                </span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-neutral-400 hover:text-white bg-neutral-900 p-2 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-black uppercase tracking-widest transition-all ${pathname === link.href ? "text-[#D4AF37] translate-x-2" : "text-neutral-400 hover:text-white"}`}
                  >
                    {isRtl ? link.labelAr : link.labelEn}
                  </Link>
                ))}
              </nav>

              {/* Improved Mobile Language Switcher */}
              <div className="mt-auto flex flex-col gap-3 border-t border-neutral-900 pt-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  {isRtl ? "اللغة" : "Language"}
                </span>
                <div className="grid grid-cols-2 gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-900">
                  <button
                    onClick={() => {
                      setLang("ar");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      lang === "ar" 
                        ? "bg-white text-black font-black" 
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => {
                      setLang("en");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      lang === "en" 
                        ? "bg-white text-black font-black" 
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        lang={lang} 
        onOrderSuccess={() => {
          if (onOrderSuccess) {
            onOrderSuccess();
          } else {
            window.location.href = "/menu?order=success";
          }
        }}
      />
    </>
  );
}
