"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, X, Globe, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LogoSVG from "./LogoSVG";

interface HeaderProps {
  lang: "ar" | "en";
  setLang: (lang: "ar" | "en") => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function Header({ lang, setLang, searchQuery, setSearchQuery }: HeaderProps) {
  const isRtl = lang === "ar";
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
      <header className="w-full bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4 relative">
          
          {/* Left Side: Language & Mobile Menu */}
          <div className="flex items-center gap-4 md:gap-8 flex-1">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors group"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
              <span className="hidden md:inline">{lang === "ar" ? "English" : "العربية"}</span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden flex items-center text-neutral-400 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Center Logo (Only visible on small screens) */}
          <div className="md:hidden absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            <Link href="/">
              <LogoSVG className="w-12 h-auto" />
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

          {/* Right Side: Search */}
          <div className="flex-1 flex justify-end">
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
              className={`fixed top-0 bottom-0 ${isRtl ? 'right-0 border-l' : 'left-0 border-r'} w-64 bg-[#050505] border-neutral-800 z-[70] p-6 flex flex-col md:hidden shadow-2xl`}
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

              <div className="mt-auto flex flex-col gap-4 border-t border-neutral-800 pt-6">
                <button
                  onClick={() => {
                    setLang(lang === "ar" ? "en" : "ar");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{lang === "ar" ? "Switch to English" : "التبديل للعربية"}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
