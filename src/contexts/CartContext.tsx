import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  hoursSaved: number;
  thumbnail?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  recentlyAddedItem: CartItem | null;
  clearRecentlyAdded: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart-items");
    return saved ? JSON.parse(saved) : [];
  });
  const [recentlyAddedItem, setRecentlyAddedItem] = useState<CartItem | null>(null);

  useEffect(() => {
    localStorage.setItem("cart-items", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        setRecentlyAddedItem({ ...exists, quantity: exists.quantity + 1 });
        return prev.map((i) => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      const newItem = { ...item, quantity: 1 };
      setRecentlyAddedItem(newItem);
      return [...prev, newItem];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((item) => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearRecentlyAdded = () => {
    setRecentlyAddedItem(null);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount: items.length,
        recentlyAddedItem,
        clearRecentlyAdded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
