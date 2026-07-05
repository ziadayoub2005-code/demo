"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MenuItemCard from "@/components/MenuItemCard";
import ItemModal from "@/components/ItemModal";
import CartDrawer from "@/components/CartDrawer";
import SuccessView from "@/components/SuccessView";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import { categories as staticCategories, menuItems as staticMenuItems, MenuItem, Category } from "@/data/menuData";
import { fetchPosMenu } from "@/services/odoo";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

export default function MenuPage() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<"menu" | "success">("menu");
  
  const { setTableNumber, tableNumber, totalItems } = useCart();

  const [categories, setCategories] = useState<Category[]>(staticCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(staticMenuItems);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  const isManualScroll = React.useRef(false);
  const scrollTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const isRtl = lang === "ar";

  useEffect(() => {
    async function loadPosData() {
      setIsLoading(true);
      const posData = await fetchPosMenu();
      if (posData) {
        const mappedCategories: Category[] = posData.categories.map((c: any) => ({
          id: c.id.toString(),
          name: c.name,
          nameEn: c.name,
        }));
        
        const mappedItems: MenuItem[] = posData.products.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          nameEn: p.name,
          category: p.pos_categ_id ? p.pos_categ_id.toString() : 'uncategorized',
          price: p.price,
          description: p.description,
          descriptionEn: p.description,
          image: p.image_url,
          attributes: p.attributes
        }));
        
        setCategories(mappedCategories);
        setMenuItems(mappedItems);
        if (mappedCategories.length > 0) {
          setActiveCategory(mappedCategories[0].id);
        }
      }
      setIsLoading(false);
    }
    loadPosData();
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    if (table) {
      setTableNumber(table);
    }
  }, [setTableNumber]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      
      if (isManualScroll.current) return;

      // Update active category based on scroll position
      const sections = categories.map(cat => document.getElementById(`category-section-${cat.id}`));
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveCategory(categories[i].id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const filteredItems = menuItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return item.name.toLowerCase().includes(query) || item.nameEn.toLowerCase().includes(query) || 
           (item.description?.toLowerCase().includes(query)) || (item.descriptionEn?.toLowerCase().includes(query));
  });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleOrderSuccess = () => {
    setOrderStatus("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const slideUp: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white relative pb-24 overflow-x-clip selection:bg-[#D4AF37] selection:text-black">
      
      <Header lang={lang} setLang={setLang} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Sticky Category Nav */}
      {!isLoading && !searchQuery && orderStatus === "menu" && (
        <CategoryNav 
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={(id) => {
            setActiveCategory(id);
            isManualScroll.current = true;
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
              isManualScroll.current = false;
            }, 1000);
          }}
          lang={lang}
        />
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-10 z-10">
        
        {/* Table Badge */}
        {tableNumber && orderStatus === "menu" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-10"
          >
            <div className="border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-6 py-2.5 rounded-full flex items-center gap-3 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.05)]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[#D4AF37] text-xs font-black uppercase tracking-widest">
                {isRtl ? `الطاولة ${tableNumber}` : `Table ${tableNumber}`}
              </span>
            </div>
          </motion.div>
        )}

        {orderStatus === "success" ? (
          <SuccessView lang={lang} tableNumber={tableNumber} onReturnToMenu={() => setOrderStatus("menu")} />
        ) : (
          <>
            {searchQuery ? (
              <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col items-center justify-center mb-16 text-center">
                  <h2 className="text-2xl md:text-4xl font-black tracking-widest uppercase text-white mb-4">
                    {isRtl ? "نتائج البحث" : "Search Results"}
                  </h2>
                  <div className="w-16 h-[2px] bg-[#D4AF37]" />
                </div>

                {filteredItems.length > 0 ? (
                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                      <motion.div key={item.id} variants={slideUp} className="h-full">
                        <MenuItemCard item={item} lang={lang} onOpen={() => setSelectedItem(item)} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-32 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/20">
                    <span className="text-4xl block mb-6 opacity-50">🔍</span>
                    <p className="text-neutral-500 text-sm font-light tracking-widest uppercase">
                      {isRtl ? "لم نجد أي نتائج تطابق بحثك." : "No items match your search."}
                    </p>
                  </div>
                )}
              </section>
            ) : (
              <div className="flex flex-col gap-24">
                {isLoading ? (
                  <div className="flex flex-col justify-center items-center h-64 gap-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-l-2 border-[#D4AF37]"></div>
                    <span className="text-neutral-500 text-xs tracking-widest uppercase animate-pulse">
                      {isRtl ? "جاري تحميل القائمة..." : "Loading Menu..."}
                    </span>
                  </div>
                ) : (
                  categories.map((cat, idx) => {
                    const catItems = menuItems.filter((item) => item.category === cat.id);
                    if (catItems.length === 0) return null;

                    return (
                      <section key={cat.id} id={`category-section-${cat.id}`} className="scroll-mt-36">
                        <motion.div 
                          initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.6 }}
                          className="flex items-center gap-4 mb-10 select-none"
                        >
                          <h2 className="text-2xl md:text-3xl font-black tracking-widest uppercase text-white">
                            {isRtl ? cat.name : cat.nameEn}
                          </h2>
                          <div className="flex-1 h-[1px] bg-gradient-to-r from-neutral-800 to-transparent" />
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {catItems.map((item) => (
                            <MenuItemCard key={item.id} item={item} lang={lang} onOpen={() => setSelectedItem(item)} />
                          ))}
                        </div>
                      </section>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 rtl:right-auto rtl:left-6 z-30 bg-neutral-900 border border-neutral-800 text-white p-3.5 rounded-full hover:bg-neutral-800 transition-all duration-300 shadow-xl backdrop-blur-md"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Floating Cart Button (Chic Version) */}
      {totalItems > 0 && orderStatus !== "success" && (
        <motion.button
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-[0.15em] shadow-[0_10px_40px_rgba(255,255,255,0.15)] flex items-center gap-4 text-xs md:text-sm border border-neutral-200"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isRtl ? "عرض السلة" : "View Cart"}</span>
          <div className="bg-black text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px]">
            {totalItems}
          </div>
        </motion.button>
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        lang={lang} 
        onOrderSuccess={handleOrderSuccess}
      />

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          lang={lang}
        />
      )}
    </div>
  );
}
