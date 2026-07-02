"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { MenuItem } from "@/data/menuData";

export interface CartItem {
  id: string; // unique ID for cart entry (item.id + instructions)
  menuItem: MenuItem;
  quantity: number;
  instructions: string;
}

interface CartContextType {
  cart: CartItem[];
  customerNote: string;
  setCustomerNote: (note: string) => void;
  tableNumber: string | null;
  setTableNumber: (table: string | null) => void;
  addToCart: (item: MenuItem, quantity: number, instructions?: string) => void;
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
  const [tableNumber, setTableNumber] = useState<string | null>(null);

  const addToCart = (item: MenuItem, quantity: number, instructions = "") => {
    setCart((prev) => {
      // Find if we already have this exact item with the same instructions
      const existingIndex = prev.findIndex(
        (ci) => ci.menuItem.id === item.id && ci.instructions === instructions
      );

      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        const newItemId = `${item.id}-${Date.now()}`;
        return [...prev, { id: newItemId, menuItem: item, quantity, instructions }];
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

  const totalPrice = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        customerNote,
        setCustomerNote,
        tableNumber,
        setTableNumber,
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
