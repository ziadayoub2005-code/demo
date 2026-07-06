"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import LogoSVG from "@/components/LogoSVG";

export default function ContactPage() {
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
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-neutral-100 overflow-x-clip selection:bg-[#D4AF37] selection:text-black">
      <Header lang={lang} setLang={setLang} />

      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}></div>
      </div>

      <main className="flex-grow pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
        <motion.div 
          className="text-center mb-16 flex flex-col items-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.span variants={itemVariants} className="text-[#D4AF37] text-xs md:text-sm uppercase tracking-[0.5em] mb-4 block font-black">
            {isRtl ? "ابق على تواصل" : "Get In Touch"}
          </motion.span>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 mb-6">
            {isRtl ? "تواصل معنا" : "Contact Us"}
          </motion.h1>
          <motion.div variants={itemVariants} className="w-16 h-[2px] bg-[#D4AF37] mb-8" />
          <motion.p variants={itemVariants} className="text-neutral-400 font-light text-sm md:text-lg leading-relaxed tracking-wider max-w-2xl">
            {isRtl 
              ? "يسعدنا دائماً الاستماع إليكم. شاركونا استفساراتكم أو ملاحظاتكم وسنقوم بالرد عليكم في أقرب وقت ممكن لتجربة استثنائية."
              : "We always love to hear from you. Share your inquiries or feedback and we will get back to you as soon as possible for an exceptional experience."}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 w-full">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-3 bg-[#0a0a0a]/80 backdrop-blur-xl border border-neutral-800/50 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
            
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-widest text-neutral-400 font-bold px-2">
                    {isRtl ? "الاسم الكامل" : "Full Name"}
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    required
                    className="w-full bg-[#111111] border border-neutral-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    placeholder={isRtl ? "أدخل اسمك الكريم..." : "Enter your name..."}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact" className="text-xs uppercase tracking-widest text-neutral-400 font-bold px-2">
                    {isRtl ? "رقم الهاتف / البريد الإلكتروني" : "Phone / Email"}
                  </label>
                  <input 
                    type="text" 
                    id="contact"
                    required
                    className="w-full bg-[#111111] border border-neutral-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    placeholder={isRtl ? "كيف نتواصل معك؟" : "How can we reach you?"}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs uppercase tracking-widest text-neutral-400 font-bold px-2">
                  {isRtl ? "الرسالة" : "Message"}
                </label>
                <textarea 
                  id="message"
                  required
                  rows={8}
                  className="w-full bg-[#111111] border border-neutral-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none min-h-[370px]"
                  placeholder={isRtl ? "اكتب رسالتك، استفسارك أو ملاحظاتك هنا..." : "Write your message, inquiry, or feedback here..."}
                ></textarea>
              </div>
              <button 
                type="submit"
                className="mt-4 w-full bg-gradient-to-r from-[#D4AF37] to-[#B38F2B] text-black font-black uppercase tracking-[0.2em] py-5 rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-[1.02] transition-all duration-300"
              >
                {isRtl ? "إرسال الرسالة" : "Send Message"}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-neutral-800/50 p-8 rounded-3xl group hover:border-[#D4AF37]/30 transition-colors">
              <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mb-6 text-xl text-[#D4AF37] group-hover:scale-110 transition-transform">📍</div>
              <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2">
                {isRtl ? "العنوان" : "Location"}
              </h3>
              <p className="text-neutral-400 font-light leading-relaxed">
                {isRtl ? "شارع الأمير سلطان، الرياض، المملكة العربية السعودية" : "Prince Sultan St, Riyadh, Saudi Arabia"}
              </p>
            </div>

            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-neutral-800/50 p-8 rounded-3xl group hover:border-[#D4AF37]/30 transition-colors">
              <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mb-6 text-xl text-[#D4AF37] group-hover:scale-110 transition-transform">🕒</div>
              <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2">
                {isRtl ? "أوقات العمل" : "Working Hours"}
              </h3>
              <p className="text-neutral-400 font-light leading-relaxed">
                {isRtl ? "السبت - الأربعاء: 1:00 ظهراً - 1:00 صباحاً" : "Sat - Wed: 1:00 PM - 1:00 AM"}<br/>
                {isRtl ? "الخميس - الجمعة: 1:00 ظهراً - 3:00 صباحاً" : "Thu - Fri: 1:00 PM - 3:00 AM"}
              </p>
            </div>

            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-neutral-800/50 p-8 rounded-3xl group hover:border-[#D4AF37]/30 transition-colors">
              <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mb-6 text-xl text-[#D4AF37] group-hover:scale-110 transition-transform">📞</div>
              <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2">
                {isRtl ? "تواصل مباشر" : "Direct Contact"}
              </h3>
              <p className="text-neutral-400 font-light leading-relaxed" style={{ direction: "ltr" }}>
                +966 50 123 4567<br/>
                info@blackandwhite.com
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="w-full bg-black py-12 border-t border-neutral-900/50 mt-auto relative z-10">
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
