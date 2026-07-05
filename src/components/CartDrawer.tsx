"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart, OrderType, PaymentMethod } from "@/context/CartContext";
import { submitOrderToOdoo, OdooOrderPayload } from "@/services/odoo";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, CreditCard, Banknote, MapPin, Clock, ChevronRight, ChevronDown, CheckCircle2 } from "lucide-react";

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
    customerPhone,
    setCustomerPhone,
    tableNumber,
    orderType,
    setOrderType,
    deliveryAddress,
    setDeliveryAddress,
    pickupTime,
    setPickupTime,
    paymentMethod,
    setPaymentMethod,
    clearCart
  } = useCart();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"cart" | "checkout">("cart");
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  const timeOptions = [
    { value: "", label: isRtl ? "اختر وقت الاستلام" : "Select pickup time" },
    { value: "asap", label: isRtl ? "في أسرع وقت" : "As soon as possible" },
    { value: "15min", label: isRtl ? "بعد 15 دقيقة" : "In 15 minutes" },
    { value: "30min", label: isRtl ? "بعد 30 دقيقة" : "In 30 minutes" },
    { value: "1hour", label: isRtl ? "بعد ساعة" : "In 1 hour" }
  ];

  const handleSendOrder = async () => {
    if (cart.length === 0) return;
    
    // Validate required fields
    if (!customerPhone.trim()) {
      alert(isRtl ? "الرجاء إدخال رقم الجوال" : "Please enter your phone number");
      return;
    }
    if (orderType === "delivery" && !deliveryAddress.trim()) {
      alert(isRtl ? "الرجاء إدخال عنوان التوصيل" : "Please enter your delivery address");
      return;
    }
    if (orderType === "takeaway" && !pickupTime) {
      alert(isRtl ? "الرجاء اختيار وقت الاستلام" : "Please select a pickup time");
      return;
    }
    
    setIsSubmitting(true);
    
    // Structure payload based on order type
    const payload: OdooOrderPayload = {
      table: tableNumber || "N/A",
      order_type: orderType,
      delivery_address: orderType === "delivery" ? deliveryAddress : undefined,
      pickup_time: orderType === "takeaway" ? pickupTime : undefined,
      payment_method: paymentMethod,
      customer_note: customerNote || undefined,
      customer_phone: customerPhone || undefined,
      items: cart.map(item => ({
        id: item.menuItem.id,
        qty: item.quantity,
        instructions: item.instructions || undefined,
        name: item.menuItem.name,
        nameEn: item.menuItem.nameEn,
        price: item.menuItem.price,
        options: item.selectedOptions?.map(opt => ({
          name: opt.name,
          nameEn: opt.nameEn,
          price: opt.price || 0
        }))
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
      alert(isRtl ? "حدث خطأ أثناء إرسال الطلب، الرجاء المحاولة مرة أخرى." : "Failed to send order, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setActiveTab("cart");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={handleClose}
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: isRtl ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 ${isRtl ? "left-0" : "right-0"} bottom-0 w-full md:w-[480px] bg-[#050505] border-${isRtl ? "r" : "l"} border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 flex flex-col`}
            style={{ direction: isRtl ? "rtl" : "ltr" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-900/50 bg-[#0a0a0a]">
              <div className="flex items-center gap-3">
                {activeTab === "checkout" ? (
                  <button onClick={() => setActiveTab("cart")} className="p-2 -ml-2 rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors">
                    <ChevronRight className={`w-5 h-5 ${!isRtl && 'rotate-180'}`} />
                  </button>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#111] flex items-center justify-center border border-neutral-800">
                    <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wider text-white">
                    {activeTab === "cart" ? (isRtl ? "سلة الطلبات" : "Your Order") : (isRtl ? "إتمام الطلب" : "Checkout")}
                  </h2>
                  {tableNumber && (
                    <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                      {isRtl ? `طاولة #${tableNumber}` : `Table #${tableNumber}`}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900/50 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors border border-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
              <AnimatePresence mode="wait">
                {activeTab === "cart" ? (
                  <motion.div 
                    key="cart-view"
                    initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 flex flex-col gap-6"
                  >
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-neutral-500 gap-4">
                        <div className="w-24 h-24 rounded-full bg-neutral-900/50 border border-neutral-800 flex items-center justify-center mb-4">
                          <ShoppingBag className="w-10 h-10 text-neutral-600" />
                        </div>
                        <p className="text-sm font-medium tracking-widest uppercase">{isRtl ? "سلتك فارغة" : "Your cart is empty"}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((cartItem) => {
                          const itemBasePrice = cartItem.menuItem.price;
                          const optionsPrice = (cartItem.selectedOptions || []).reduce((sum, opt) => sum + (opt.price || 0), 0);
                          const itemTotalPrice = (itemBasePrice + optionsPrice) * cartItem.quantity;

                          return (
                            <motion.div 
                              layout
                              key={cartItem.id} 
                              className="group p-4 bg-[#0a0a0a] border border-neutral-900 rounded-2xl transition-colors hover:border-neutral-700 relative overflow-hidden"
                            >
                              <div className="flex gap-4">
                                <div className="relative w-24 h-24 shrink-0 bg-[#111] rounded-xl flex items-center justify-center overflow-hidden border border-neutral-800">
                                  {cartItem.menuItem.image ? (
                                    <Image 
                                      src={cartItem.menuItem.image} 
                                      alt={isRtl ? cartItem.menuItem.name : cartItem.menuItem.nameEn}
                                      fill
                                      unoptimized={true}
                                      sizes="96px"
                                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                  ) : (
                                    <span className="text-2xl opacity-20">🍽️</span>
                                  )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                  <div>
                                    <div className="flex justify-between items-start gap-2 mb-1">
                                      <h4 className="font-bold text-white text-sm">
                                        {isRtl ? cartItem.menuItem.name : cartItem.menuItem.nameEn}
                                      </h4>
                                      <span className="font-black text-sm whitespace-nowrap text-[#D4AF37]">
                                        {itemTotalPrice} <span className="text-[10px] text-[#D4AF37]/70">{isRtl ? "ر.س" : "SAR"}</span>
                                      </span>
                                    </div>
                                    
                                    {/* Selected Options / Addons */}
                                    {cartItem.selectedOptions && cartItem.selectedOptions.length > 0 && (
                                      <div className="text-[11px] text-neutral-400 space-y-1 mb-2">
                                        {cartItem.selectedOptions.map((opt, idx) => (
                                          <div key={idx} className="flex justify-between items-center">
                                            <span className="flex items-center gap-1">
                                              <div className="w-1 h-1 rounded-full bg-neutral-700" />
                                              {isRtl ? opt.name : opt.nameEn}
                                            </span>
                                            {opt.price ? <span className="text-neutral-500">+{opt.price}</span> : null}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-4 bg-[#111] rounded-full px-2 py-1 border border-neutral-800">
                                      <button
                                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                                        className="w-7 h-7 flex items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                                      >
                                        -
                                      </button>
                                      <span className="text-sm font-bold w-4 text-center select-none">{cartItem.quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                                        className="w-7 h-7 flex items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                                      >
                                        +
                                      </button>
                                    </div>
                                    <button 
                                      onClick={() => removeFromCart(cartItem.id)}
                                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Special Instructions */}
                              <div className="mt-4 pt-4 border-t border-neutral-900/50">
                                <input 
                                  type="text"
                                  placeholder={isRtl ? "إضافة ملاحظة لهذا الطبق (اختياري)..." : "Add note for this item (optional)..."}
                                  value={cartItem.instructions || ''}
                                  onChange={(e) => updateInstructions(cartItem.id, e.target.value)}
                                  className="w-full bg-transparent border-none text-[11px] text-neutral-300 placeholder-neutral-600 focus:outline-none focus:ring-0 px-1"
                                />
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="checkout-view"
                    initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 space-y-8 pb-32"
                  >
                    {/* Segmented Control: Order Type */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {isRtl ? "نوع الطلب" : "Order Type"}
                      </label>
                      <div className="p-1 bg-[#111] rounded-xl border border-neutral-900 flex">
                        {["takeaway", "delivery", ...(tableNumber ? ["dine_in"] : [])].map((type) => (
                          <button
                            key={type}
                            onClick={() => setOrderType(type as OrderType)}
                            className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all duration-300 relative ${
                              orderType === type ? "text-black" : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            {orderType === type && (
                              <motion.div 
                                layoutId="orderTypeBg" 
                                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                            <span className="relative z-10">
                              {type === "takeaway" ? (isRtl ? "استلام" : "Takeaway") :
                               type === "delivery" ? (isRtl ? "توصيل" : "Delivery") :
                               (isRtl ? "محلي" : "Dine-in")}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {orderType === "takeaway" && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 relative">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                          <Clock className="w-3.5 h-3.5" />
                          {isRtl ? "وقت الاستلام" : "Pickup Time"}
                        </label>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                            className={`w-full bg-[#0a0a0a] border rounded-xl p-4 text-sm text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition-all flex justify-between items-center ${isTimeDropdownOpen ? 'border-white' : 'border-neutral-800'}`}
                          >
                            <span>{timeOptions.find(o => o.value === pickupTime)?.label || timeOptions[0].label}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isTimeDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isTimeDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-50 w-full mt-2 bg-[#111] border border-neutral-800 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
                              >
                                {timeOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                      setPickupTime(option.value);
                                      setIsTimeDropdownOpen(false);
                                    }}
                                    className={`w-full text-start px-4 py-3.5 text-sm transition-colors border-b border-neutral-900/50 last:border-0 ${
                                      pickupTime === option.value 
                                        ? "bg-[#D4AF37] text-black font-bold" 
                                        : "text-neutral-300 hover:bg-[#1a1a1a] hover:text-white"
                                    }`}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}

                    {orderType === "delivery" && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                          <MapPin className="w-3.5 h-3.5" />
                          {isRtl ? "عنوان التوصيل" : "Delivery Address"}
                        </label>
                        <textarea
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder={isRtl ? "المدينة، الحي، الشارع، رقم المبنى..." : "City, District, Street, Building..."}
                          className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl p-4 text-sm text-white placeholder-neutral-600 focus:border-white focus:ring-1 focus:ring-white outline-none resize-none min-h-[100px] transition-all"
                        />
                      </motion.div>
                    )}

                    {/* Customer Phone */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                        <span className="text-[14px]">📱</span>
                        {isRtl ? "رقم الجوال" : "Phone Number"}
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder={isRtl ? "مثال: 0500000000" : "e.g. 0500000000"}
                        dir="ltr"
                        className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl p-4 text-sm text-white placeholder-neutral-600 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all font-mono"
                      />
                    </div>

                    {/* Segmented Control: Payment Method */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                        <CreditCard className="w-3.5 h-3.5" />
                        {isRtl ? "طريقة الدفع" : "Payment Method"}
                      </label>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setPaymentMethod("cash_on_delivery")}
                          className={`relative p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                            paymentMethod === "cash_on_delivery" 
                              ? "bg-white/5 border-white text-white" 
                              : "bg-[#0a0a0a] border-neutral-800 text-neutral-500 hover:border-neutral-600"
                          }`}
                        >
                          {paymentMethod === "cash_on_delivery" && (
                            <CheckCircle2 className="absolute top-2 right-2 rtl:left-2 rtl:right-auto w-4 h-4 text-white" />
                          )}
                          <Banknote className={`w-6 h-6 ${paymentMethod === "cash_on_delivery" ? "text-[#D4AF37]" : ""}`} />
                          <span className="text-xs font-bold">{isRtl ? "عند الاستلام" : "On Delivery"}</span>
                        </button>

                        <button
                          onClick={() => setPaymentMethod("online")}
                          className={`relative p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 overflow-hidden ${
                            paymentMethod === "online" 
                              ? "bg-white/5 border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
                              : "bg-[#0a0a0a] border-neutral-800 text-neutral-500 hover:border-neutral-600"
                          }`}
                        >
                          {paymentMethod === "online" && (
                            <CheckCircle2 className="absolute top-2 right-2 rtl:left-2 rtl:right-auto w-4 h-4 text-[#D4AF37]" />
                          )}
                          <CreditCard className={`w-6 h-6 ${paymentMethod === "online" ? "text-[#D4AF37]" : ""}`} />
                          <span className="text-xs font-bold">{isRtl ? "دفع إلكتروني" : "Online Payment"}</span>
                          
                          {/* Sleek gradient background for online payment active state */}
                          {paymentMethod === "online" && (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent pointer-events-none" />
                          )}
                        </button>
                      </div>

                      {paymentMethod === "online" && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: "auto" }}
                          className="flex items-center justify-center gap-2 py-2 overflow-hidden"
                        >
                          {/* Payment Icons */}
                          <div className="px-2 py-1 bg-white rounded flex items-center justify-center h-6">
                            <span className="text-black text-[9px] font-black italic tracking-tighter">VISA</span>
                          </div>
                          <div className="px-2 py-1 bg-white rounded flex items-center justify-center h-6">
                            <span className="text-[#FF5F00] text-[10px] font-black tracking-tighter">mastercard</span>
                          </div>
                          <div className="px-2 py-1 bg-black border border-white/20 rounded flex items-center justify-center h-6">
                            <span className="text-white text-[10px] font-medium tracking-wide"> Pay</span>
                          </div>
                          <div className="px-2 py-1 bg-[#000] border border-[#00C2A7]/30 rounded flex items-center justify-center h-6">
                            <span className="text-[#00C2A7] text-[10px] font-bold">mada</span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Global Notes */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                        <span className="text-[14px]">📝</span>
                        {isRtl ? "ملاحظات إضافية" : "Additional Notes"}
                      </label>
                      <textarea
                        value={customerNote}
                        onChange={(e) => setCustomerNote(e.target.value)}
                        placeholder={isRtl ? "أي شيء آخر تود إخبارنا به؟" : "Anything else you'd like to tell us?"}
                        className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl p-4 text-sm text-white placeholder-neutral-600 focus:border-white focus:ring-1 focus:ring-white outline-none min-h-[80px] transition-all resize-none"
                      />
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-neutral-900 bg-[#050505] relative z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.8)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-neutral-400 font-bold uppercase tracking-widest text-xs">
                    {isRtl ? "المجموع الكلي" : "Total Amount"}
                  </span>
                  <div className="flex items-end gap-1">
                    <span className="text-white font-black text-2xl leading-none">
                      {totalPrice}
                    </span>
                    <span className="text-[#D4AF37] font-bold text-sm mb-0.5">
                      {isRtl ? "ر.س" : "SAR"}
                    </span>
                  </div>
                </div>
                
                {activeTab === "cart" ? (
                  <button 
                    onClick={() => setActiveTab("checkout")}
                    className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  >
                    {isRtl ? "متابعة الطلب" : "Proceed to Checkout"}
                  </button>
                ) : (
                  <button 
                    onClick={handleSendOrder}
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 flex justify-center items-center gap-3 ${
                      isSubmitting 
                        ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700" 
                        : paymentMethod === "online" 
                          ? "bg-gradient-to-r from-[#D4AF37] to-[#e5c970] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                          : "bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    }`}
                  >
                    {isSubmitting 
                      ? (isRtl ? "جاري التأكيد..." : "Processing...") 
                      : paymentMethod === "online"
                        ? (isRtl ? "تأكيد الدفع 🔒" : "Secure Checkout 🔒")
                        : (isRtl ? "إرسال الطلب" : "Place Order")}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
