"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { MenuItem } from "@/data/menuData";

export interface CartItem {
  id: string; // unique ID for cart entry (item.id + instructions + options)
  menuItem: MenuItem;
  quantity: number;
  instructions: string;
  selectedOptions?: { name: string; nameEn: string; price?: number }[];
}

export type OrderType = "dine_in" | "takeaway" | "delivery";
export type PaymentMethod = "cash_on_delivery" | "online";

interface CartContextType {
  cart: CartItem[];
  customerNote: string;
  setCustomerNote: (note: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  tableNumber: string | null;
  setTableNumber: (table: string | null) => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  addToCart: (item: MenuItem, quantity: number, instructions?: string, selectedOptions?: { name: string; nameEn: string; price?: number }[]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateInstructions: (cartItemId: string, instructions: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerNote, setCustomerNote] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  
  // New Order Flow States
  const [orderType, setOrderType] = useState<OrderType>("takeaway");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_delivery");

  const addToCart = (
    item: MenuItem, 
    quantity: number, 
    instructions = "", 
    selectedOptions: { name: string; nameEn: string; price?: number }[] = []
  ) => {
    setCart((prev) => {
      // Create a string representation of options to check for exact matches
      const optionsKey = JSON.stringify(selectedOptions);
      
      const existingIndex = prev.findIndex(
        (ci) => 
          ci.menuItem.id === item.id && 
          ci.instructions === instructions &&
          JSON.stringify(ci.selectedOptions || []) === optionsKey
      );

      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        const newItemId = `${item.id}-${Date.now()}`;
        return [...prev, { id: newItemId, menuItem: item, quantity, instructions, selectedOptions }];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.id === cartItemId ? { ...ci, quantity } : ci))
    );
  };

  const updateInstructions = (cartItemId: string, instructions: string) => {
    setCart((prev) =>
      prev.map((ci) => (ci.id === cartItemId ? { ...ci, instructions } : ci))
    );
  };

  const clearCart = () => {
    setCart([]);
    setCustomerNote("");
  };

  const totalPrice = cart.reduce((sum, item) => {
    const itemBasePrice = item.menuItem.price;
    const optionsPrice = (item.selectedOptions || []).reduce((optSum, opt) => optSum + (opt.price || 0), 0);
    return sum + (itemBasePrice + optionsPrice) * item.quantity;
  }, 0);
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        customerNote,
        setCustomerNote,
        customerPhone,
        setCustomerPhone,
        tableNumber,
        setTableNumber,
        orderType,
        setOrderType,
        deliveryAddress,
        setDeliveryAddress,
        pickupTime,
        setPickupTime,
        paymentMethod,
        setPaymentMethod,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateInstructions,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
