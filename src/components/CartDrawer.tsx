"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { submitOrderToOdoo, OdooOrderPayload } from "@/services/odoo";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "ar" | "en";
  onOrderSuccess: () => void;
}

export default function CartDrawer({ isOpen, onClose, lang, onOrderSuccess }: CartDrawerProps) {
  const isRtl = lang === "ar";
  const { 
    cart, 
    totalPrice, 
    removeFromCart, 
    updateQuantity, 
    updateInstructions, 
    customerNote, 
    setCustomerNote,
    tableNumber,
    clearCart
  } = useCart();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOrder = async () => {
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    
    const payload: OdooOrderPayload = {
      table: tableNumber || "N/A",
      customer_note: customerNote || undefined,
      items: cart.map(item => ({
        id: item.menuItem.id,
        qty: item.quantity,
        instructions: item.instructions || undefined,
        name: item.menuItem.name,
        nameEn: item.menuItem.nameEn,
        price: item.menuItem.price
      }))
    };

    try {
      const success = await submitOrderToOdoo(payload);
      if (success) {
        clearCart();
        onClose();
        onOrderSuccess();
      }
    } catch (error) {
      console.error("Failed to submit order", error);
      // Ideally show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 ${isRtl ? "left-0" : "right-0"} bottom-0 w-full md:w-[450px] bg-neutral-950 border-${isRtl ? "r" : "l"} border-neutral-900 shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : (isRtl ? "-translate-x-full" : "translate-x-full")
        }`}
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-900 bg-black/50">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wider text-white">
              {isRtl ? "سلة الطلبات" : "Your Order"}
            </h2>
            {tableNumber && (
              <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-widest text-neutral-400 border border-neutral-800 bg-neutral-900 px-2.5 py-1 rounded">
                {isRtl ? `طاولة #${tableNumber}` : `Table #${tableNumber}`}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-4">
              <span className="text-4xl opacity-50">🛒</span>
              <p className="text-sm font-medium">{isRtl ? "سلتك فارغة" : "Your cart is empty"}</p>
            </div>
          ) : (
            cart.map((cartItem) => (
              <div key={cartItem.id} className="flex gap-4 border-b border-neutral-900/50 pb-6">
                <div className="relative w-20 h-20 shrink-0 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center overflow-hidden">
                  {cartItem.menuItem.image ? (
                    <Image 
                      src={cartItem.menuItem.image} 
                      alt={isRtl ? cartItem.menuItem.name : cartItem.menuItem.nameEn}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-2xl opacity-20">🍽️</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-white text-sm">
                      {isRtl ? cartItem.menuItem.name : cartItem.menuItem.nameEn}
                    </h4>
                    <span className="font-black text-sm whitespace-nowrap">
                      {cartItem.menuItem.price * cartItem.quantity} SAR
                    </span>
                  </div>
                  
                  {/* Quantity & Delete */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 bg-black rounded-full px-1 py-1 border border-neutral-800">
                      <button
                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-neutral-400 hover:text-white bg-neutral-900"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{cartItem.quantity}</span>
                      <button
                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-neutral-400 hover:text-white bg-neutral-900"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(cartItem.id)}
                      className="text-[10px] uppercase font-bold text-red-500/80 hover:text-red-500 tracking-wider"
                    >
                      {isRtl ? "حذف" : "Remove"}
                    </button>
                  </div>
                  
                  {/* Special Instructions */}
                  <input 
                    type="text"
                    placeholder={isRtl ? "ملاحظات إضافية (اختياري)" : "Special instructions (optional)"}
                    value={cartItem.instructions}
                    onChange={(e) => updateInstructions(cartItem.id, e.target.value)}
                    className="w-full mt-2 px-3 py-1.5 bg-black border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-600 focus:border-neutral-500 outline-none transition-colors"
                  />
                </div>
              </div>
            ))
          )}

          {/* Global Notes */}
          {cart.length > 0 && (
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                {isRtl ? "ملاحظات الطلب" : "Order Notes"}
              </label>
              <textarea
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder={isRtl ? "أي ملاحظات للمطبخ؟" : "Any notes for the kitchen?"}
                className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-sm text-white placeholder-neutral-600 min-h-[80px] focus:border-neutral-500 outline-none transition-colors resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-neutral-900 bg-black/50 flex flex-col gap-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-neutral-400 font-bold uppercase tracking-wider text-sm">
                {isRtl ? "المجموع" : "Total"}
              </span>
              <span className="text-white font-black">
                {totalPrice} SAR
              </span>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-colors whitespace-nowrap"
              >
                {isRtl ? "متابعة الطلب" : "Continue"}
              </button>
              
              <button 
                onClick={handleSendOrder}
                disabled={isSubmitting}
                className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 ${
                  isSubmitting 
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed" 
                    : "bg-white text-black hover:bg-neutral-200"
                }`}
              >
                {isSubmitting 
                  ? (isRtl ? "جاري الإرسال..." : "Sending...") 
                  : (isRtl ? "إرسال الطلب" : "Send Order")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
