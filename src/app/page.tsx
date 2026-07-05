"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LogoSVG from "@/components/LogoSVG";
import Header from "@/components/Header";
import MarqueeText from "@/components/MarqueeText";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Home() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const isRtl = lang === "ar";

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.5 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const marqueeText = isRtl 
    ? "✦ تجربة برجر استثنائية ✦ باستا إيطالية بأجود أنواع الجبن ✦ لحوم طازجة يومياً ✦ أجواء فاخرة ✦" 
    : "✦ EXCEPTIONAL BURGER EXPERIENCE ✦ ITALIAN PASTA WITH FINEST CHEESE ✦ FRESH MEAT DAILY ✦ PREMIUM ATMOSPHERE ✦";

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-neutral-100 overflow-x-clip selection:bg-[#D4AF37] selection:text-black">
      <Header lang={lang} setLang={setLang} />

      {/* Hero Section */}
      <section className="relative w-full h-[95vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Cinematic Video Background */}
        <div className="absolute inset-0 z-0 bg-black">
          <motion.video
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 3, ease: "easeOut" }}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </motion.video>
          
          {/* Gradients to blend with background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-[#050505]" />
          
          {/* Noise texture for premium grainy feel */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}></div>
        </div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-5xl mt-[-10vh]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <LogoSVG className="w-32 h-32 md:w-48 md:h-48 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]" />
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col items-center gap-6 mb-12">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-[0.05em] md:tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 leading-tight">
              {isRtl ? "الفن في كل قضمة" : "Art in Every Bite"}
            </h1>
            <p className="text-sm md:text-xl text-neutral-400 font-light max-w-3xl leading-relaxed tracking-wider">
              {isRtl 
                ? "حيث تجتمع المكونات الفاخرة بالشغف لصنع تجربة طعام لا تُنسى في عالم بلاك وايت."
                : "Where premium ingredients meet passion to create an unforgettable culinary experience."}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link 
              href="/menu" 
              className="group relative flex items-center justify-center gap-4 px-12 py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:bg-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.3)]"
            >
              <span className="relative z-10 text-sm md:text-base">{isRtl ? "اطلب الآن" : "Order Now"}</span>
              {isRtl ? <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-2 transition-transform duration-500" /> : <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-500" />}
            </Link>
          </motion.div>
        </motion.div>

      </section>

      {/* Dramatic Categories Showcase */}
      <section className="max-w-7xl mx-auto w-full py-32 px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center mb-20 flex flex-col items-center"
        >
          <span className="text-[#D4AF37] text-[10px] md:text-xs uppercase tracking-[0.5em] mb-6 block font-black">
            {isRtl ? "القائمة المختارة" : "Curated Menu"}
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-white">
            {isRtl ? "اكتشف إبداعاتنا" : "Discover Creations"}
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-8" />
        </motion.div>

        {/* Bento Grid Layout for Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-[800px] md:h-[600px]">
          {/* Main Large Category */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative h-full w-full overflow-hidden rounded-3xl bg-neutral-900 cursor-pointer col-span-1"
          >
            <Link href={`/menu#category-section-1`} className="absolute inset-0 z-20" />
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-0" />
            
            <div className="absolute bottom-10 left-10 rtl:left-auto rtl:right-10 z-10 flex flex-col gap-3">
              <div className="w-12 h-[2px] bg-[#D4AF37] transition-all duration-700 group-hover:w-24" />
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-[0.15em] text-white">
                {isRtl ? "البرجر" : "Burgers"}
              </h3>
              <p className="text-neutral-400 font-light text-sm tracking-widest max-w-[250px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-4 group-hover:translate-y-0">
                {isRtl ? "أجود أنواع اللحوم الطازجة المجهزة يومياً" : "The finest fresh meat prepared daily"}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-rows-2 gap-4 md:gap-6 h-full col-span-1">
            {/* Top Right Category */}
            <motion.div 
              initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group relative h-full w-full overflow-hidden rounded-3xl bg-neutral-900 cursor-pointer"
            >
              <Link href={`/menu#category-section-2`} className="absolute inset-0 z-20" />
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-0" />
              <div className="absolute bottom-8 left-8 rtl:left-auto rtl:right-8 z-10 flex flex-col gap-2">
                <div className="w-8 h-[2px] bg-[#D4AF37] transition-all duration-700 group-hover:w-16" />
                <h3 className="text-3xl font-black uppercase tracking-[0.15em] text-white">
                  {isRtl ? "الباستا" : "Pasta"}
                </h3>
              </div>
            </motion.div>

            {/* Bottom Right Category */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="group relative h-full w-full overflow-hidden rounded-3xl bg-neutral-900 cursor-pointer"
            >
              <Link href={`/menu#category-section-3`} className="absolute inset-0 z-20" />
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=800&auto=format&fit=crop')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-0" />
              <div className="absolute bottom-8 left-8 rtl:left-auto rtl:right-8 z-10 flex flex-col gap-2">
                <div className="w-8 h-[2px] bg-[#D4AF37] transition-all duration-700 group-hover:w-16" />
                <h3 className="text-3xl font-black uppercase tracking-[0.15em] text-white">
                  {isRtl ? "البوكسات" : "Boxes"}
                </h3>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="w-full bg-black py-12 border-t border-neutral-900/50 mt-10">
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
