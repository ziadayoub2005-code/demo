"use client";

import React from "react";

interface SuccessViewProps {
  lang: "ar" | "en";
  tableNumber: string | null;
  onReturnToMenu: () => void;
}

export default function SuccessView({ lang, tableNumber, onReturnToMenu }: SuccessViewProps) {
  const isRtl = lang === "ar";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 animate-fadein">
      <div className="w-24 h-24 mb-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
        <span className="text-5xl">✅</span>
      </div>
      
      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider text-white mb-4">
        {isRtl ? "تم إرسال الطلب بنجاح" : "Order Sent Successfully"}
      </h2>
      
      <p className="text-neutral-400 max-w-md mx-auto text-sm md:text-base leading-relaxed mb-8">
        {isRtl 
          ? "تم إرسال طلبك إلى المطبخ وهو قيد التجهيز الآن. استرخي واستمتع بوقتك." 
          : "Your order has been sent to the kitchen and is being prepared. Sit back and enjoy your time."}
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm mx-auto mb-12">
        {tableNumber && (
          <div className="w-full sm:w-auto bg-neutral-900 border border-neutral-800 rounded-xl px-6 py-4 flex flex-col gap-1 items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              {isRtl ? "الطاولة" : "Table"}
            </span>
            <span className="text-2xl font-black text-white">
              #{tableNumber}
            </span>
          </div>
        )}
        
        <div className="w-full sm:w-auto bg-neutral-900 border border-neutral-800 rounded-xl px-6 py-4 flex flex-col gap-1 items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
            {isRtl ? "وقت التجهيز المتوقع" : "Est. Prep Time"}
          </span>
          <span className="text-2xl font-black text-white">
            {isRtl ? "15-20 دقيقة" : "15-20 mins"}
          </span>
        </div>
      </div>
      
      <button 
        onClick={onReturnToMenu}
        className="px-8 py-4 bg-white text-black rounded-full font-black uppercase tracking-widest text-sm hover:bg-neutral-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.15)]"
      >
        {isRtl ? "العودة للقائمة" : "Return to Menu"}
      </button>
    </div>
  );
}
