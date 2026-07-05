"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import LogoSVG from "@/components/LogoSVG";

export default function AboutPage() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const isRtl = lang === "ar";

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-neutral-100 overflow-x-clip selection:bg-[#D4AF37] selection:text-black">
      <Header lang={lang} setLang={setLang} />

      <main className="flex-grow pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2"
          >
            <span className="text-[#D4AF37] text-xs uppercase tracking-[0.5em] mb-4 block font-black">
              {isRtl ? "قصتنا" : "Our Story"}
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest text-white mb-6">
              {isRtl ? "من نحن" : "About Us"}
            </h1>
            <div className="w-16 h-[2px] bg-[#D4AF37] mb-8" />
            
            <div className="space-y-6 text-neutral-400 font-light text-sm md:text-lg leading-relaxed tracking-wider">
              <p className="text-neutral-400 font-light leading-relaxed">
                {isRtl 
                  ? "في بلاك وايت، نؤمن بأن الطعام ليس مجرد وجبة، بل هو تجربة فنية متكاملة. بدأنا رحلتنا بشغف لتقديم أفضل أنواع البرجر والباستا الإيطالية، معتمدين على أجود المكونات الطازجة."
                  : "At Black White, we believe that food is not just a meal, but a complete artistic experience. We started our journey with a passion to serve the finest burgers and Italian pasta, relying on the freshest premium ingredients."}
              </p>
              <p>
                {isRtl
                  ? "نحرص على استخدام أفضل المكونات، من اللحوم الطازجة التي تُحضر يومياً، إلى الأجبان الفاخرة والصوصات المصنوعة خصيصاً في مطبخنا لتضيف نكهة استثنائية لا تُنسى."
                  : "We make sure to use the best ingredients, from fresh meat prepared daily, to premium cheeses and sauces specially made in our kitchen to add an unforgettable exceptional flavor."}
              </p>
              <p>
                {isRtl
                  ? "كل طبق يخرج من مطبخنا هو لوحة فنية صُنعت بحب، لتعيشوا معنا لحظات لا تُنسى في أجواء راقية استثنائية."
                  : "Every dish that leaves our kitchen is a masterpiece crafted with love, so you can live unforgettable moments with us in an exceptional premium atmosphere."}
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 aspect-[4/5] md:aspect-square bg-neutral-900 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(212,175,55,0.05)] border border-neutral-800"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-80"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-80" />
            <div className="absolute bottom-8 left-8 right-8 text-center flex flex-col items-center">
               <LogoSVG className="w-16 h-16 opacity-50 mb-4" />
               <p className="text-white font-black tracking-widest uppercase text-lg">Black White</p>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="w-full bg-black py-12 border-t border-neutral-900/50 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
          <LogoSVG className="w-16 h-16 opacity-30 mb-6" />
          <p className="text-neutral-600 text-xs font-black uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} Black White Restaurant
          </p>
        </div>
      </footer>
    </div>
  );
}
