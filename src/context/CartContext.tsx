import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, MenuItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, spiceLevel: CartItem["spiceLevel"], customizationNote?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateSpiceLevel: (itemId: string, spiceLevel: CartItem["spiceLevel"]) => void;
  updateCustomization: (itemId: string, note: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cart-items');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cart-items', JSON.stringify(items));
  }, [items]);

  const addItem = (
    item: MenuItem,
    spiceLevel: CartItem["spiceLevel"],
    customizationNote?: string
  ) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === item.id && i.spiceLevel === spiceLevel
      );
      
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      
      return [
        ...prev,
        { ...item, quantity: 1, spiceLevel, customizationNote },
      ];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const updateSpiceLevel = (itemId: string, spiceLevel: CartItem["spiceLevel"]) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, spiceLevel } : item
      )
    );
  };

  const updateCustomization = (itemId: string, note: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, customizationNote: note } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateSpiceLevel,
        updateCustomization,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
