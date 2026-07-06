"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart, OrderType, PaymentMethod } from "@/context/CartContext";
import { submitOrderToOdoo, OdooOrderPayload } from "@/services/odoo";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, CreditCard, Banknote, MapPin, Clock, ChevronRight, ChevronDown, CheckCircle2 } from "lucide-react";
import SaudiRiyalIcon from "./SaudiRiyalIcon";

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
  const [deliveryOption, setDeliveryOption] = useState<"type" | "whatsapp" | "sms">("type");

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
    if (orderType === "delivery" && deliveryOption === "type" && !deliveryAddress.trim()) {
      alert(isRtl ? "الرجاء إدخال عنوان التوصيل" : "Please enter your delivery address");
      return;
    }
    if (orderType === "takeaway" && !pickupTime) {
      alert(isRtl ? "الرجاء اختيار وقت الاستلام" : "Please select a pickup time");
      return;
    }
    
    setIsSubmitting(true);
    
    // Resolve final delivery address representation
    let finalDeliveryAddress = undefined;
    if (orderType === "delivery") {
      if (deliveryOption === "whatsapp") {
        finalDeliveryAddress = isRtl ? "إرسال الموقع عبر واتساب" : "Will send location via WhatsApp";
      } else if (deliveryOption === "sms") {
        finalDeliveryAddress = isRtl ? "إرسال الموقع عبر SMS" : "Will send location via SMS";
      } else {
        finalDeliveryAddress = deliveryAddress;
      }
    }

    // Structure payload based on order type
    const payload: OdooOrderPayload = {
      table: tableNumber || "N/A",
      order_type: orderType,
      delivery_address: finalDeliveryAddress,
      pickup_time: orderType === "takeaway" ? pickupTime : undefined,
      payment_method: paymentMethod,
      customer_note: undefined,
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
            className={`fixed top-0 ${isRtl ? "left-0" : "right-0"} bottom-0 w-full md:w-[480px] bg-[#000000] border-${isRtl ? "r" : "l"} border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 flex flex-col`}
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
                <h2 className="text-sm font-black uppercase tracking-widest text-white">
                  {activeTab === "checkout" 
                    ? (isRtl ? "تأكيد الطلب" : "Checkout") 
                    : (isRtl ? "سلة التسوق" : "Shopping Cart")}
                </h2>
              </div>
              <button 
                onClick={handleClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900/50 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors border border-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-none">
              <AnimatePresence mode="wait">
                {activeTab === "cart" ? (
                  <motion.div 
                    key="cart-tab"
                    initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
                    className="space-y-6"
                  >
                    {cart.length === 0 ? (
                      <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-neutral-900/50 border border-neutral-800 flex items-center justify-center mb-4">
                          <ShoppingBag className="w-10 h-10 text-neutral-600" />
                        </div>
                        <p className="text-neutral-500 text-sm font-light tracking-widest uppercase">
                          {isRtl ? "سلتك فارغة حالياً" : "Your cart is empty"}
                        </p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div 
                          key={item.id}
                          className="group p-4 bg-[#0a0a0a] border border-neutral-900 rounded-2xl transition-colors hover:border-neutral-700 relative overflow-hidden"
                        >
                          <div className="flex gap-4">
                            <div className="relative w-24 h-24 shrink-0 bg-[#111] rounded-xl flex items-center justify-center overflow-hidden border border-neutral-800">
                              {item.menuItem.image ? (
                                <Image
                                  src={item.menuItem.image}
                                  alt={isRtl ? item.menuItem.name : item.menuItem.nameEn}
                                  fill
                                  sizes="96px"
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <span className="text-xs text-neutral-600">No Image</span>
                              )}
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="text-sm font-bold text-white mb-1">
                                  {isRtl ? item.menuItem.name : item.menuItem.nameEn}
                                </h3>
                                
                                {item.selectedOptions && item.selectedOptions.length > 0 && (
                                  <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1 text-[10px] text-neutral-500">
                                    {item.selectedOptions.map((opt, i) => (
                                      <div key={i} className="flex items-center gap-1">
                                        <span>{isRtl ? opt.name : opt.nameEn}</span>
                                        {opt.price ? (
                                          <span className="text-[#D4AF37] font-medium flex items-center gap-0.5">
                                            <span>(+{opt.price}</span>
                                            <SaudiRiyalIcon className="w-1.5 h-2 text-white" />
                                            <span>)</span>
                                          </span>
                                        ) : null}
                                        {i < (item.selectedOptions?.length || 0) - 1 && (
                                          <div className="w-1 h-1 rounded-full bg-neutral-700" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-4 bg-[#111] rounded-full px-2 py-1 border border-neutral-800">
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white hover:bg-neutral-800 transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-mono font-bold text-white w-4 text-center">
                                    {item.quantity}
                                  </span>
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white hover:bg-neutral-800 transition-colors"
                                  >
                                    +
                                  </button>
                                </div>

                                <div className="flex items-center gap-4">
                                  <span className="text-sm font-black text-white flex items-center gap-1">
                                    <span>{((item.menuItem.price + (item.selectedOptions?.reduce((sum, o) => sum + (o.price || 0), 0) || 0)) * item.quantity)}</span>
                                    <SaudiRiyalIcon className="w-2.5 h-3 text-white" />
                                  </span>
                                  
                                  <button 
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-neutral-500 hover:text-red-500 transition-colors"
                                    aria-label="Remove item"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Item Notes */}
                          <div className="mt-4 pt-3 border-t border-neutral-900/50">
                            <input
                              type="text"
                              value={item.instructions || ''}
                              onChange={(e) => updateInstructions(item.id, e.target.value)}
                              placeholder={isRtl ? "إضافة ملاحظة للوجبة..." : "Add item note..."}
                              className="w-full bg-transparent text-[11px] text-neutral-400 placeholder-neutral-600 focus:outline-none"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="checkout-tab"
                    initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                    className="space-y-6"
                  >
                    {/* Segmented Control: Order Type */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                        <span>🍽️</span>
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
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                          <MapPin className="w-3.5 h-3.5" />
                          {isRtl ? "خيارات التوصيل" : "Delivery Options"}
                        </label>
                        
                        <div className="grid grid-cols-3 gap-2 p-1 bg-[#111] rounded-xl border border-neutral-900">
                          <button
                            type="button"
                            onClick={() => setDeliveryOption("type")}
                            className={`py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${
                              deliveryOption === "type" ? "bg-white text-black font-black" : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            {isRtl ? "كتابة العنوان" : "Type Address"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeliveryOption("whatsapp")}
                            className={`py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${
                              deliveryOption === "whatsapp" ? "bg-[#25D366] text-white font-black shadow-[0_0_10px_rgba(37,211,102,0.2)]" : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            {isRtl ? "عبر واتساب" : "WhatsApp"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeliveryOption("sms")}
                            className={`py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${
                              deliveryOption === "sms" ? "bg-neutral-800 text-white font-black" : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            {isRtl ? "عبر SMS" : "SMS"}
                          </button>
                        </div>

                        {deliveryOption === "type" ? (
                          <textarea
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder={isRtl ? "المدينة، الحي، الشارع، رقم المبنى..." : "City, District, Street, Building..."}
                            className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl p-4 text-sm text-white placeholder-neutral-600 focus:border-white focus:ring-1 focus:ring-white outline-none resize-none min-h-[100px] transition-all"
                          />
                        ) : (
                          <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl text-xs text-neutral-400 leading-relaxed">
                            {deliveryOption === "whatsapp" ? (
                              isRtl 
                                ? "ℹ️ بعد إتمام الطلب، يمكنك مشاركة موقعك الجغرافي مباشرة للفرع عبر الواتساب."
                                : "ℹ️ After completing the order, you can share your location details directly via WhatsApp."
                            ) : (
                              isRtl
                                ? "ℹ️ بعد إتمام الطلب، سنقوم بالتواصل معك للحصول على تفاصيل موقعك الجغرافي عبر SMS."
                                : "ℹ️ After completing the order, we will contact you to get your location details via SMS."
                            )}
                          </div>
                        )}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-neutral-900 bg-[#000000] relative z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.8)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-neutral-400 font-bold uppercase tracking-widest text-xs">
                    {isRtl ? "المجموع الكلي" : "Total Amount"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-black text-2xl leading-none">
                      {totalPrice}
                    </span>
                    <SaudiRiyalIcon className="w-3.5 h-4 text-white mt-0.5" />
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
