import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [recentlyAddedItem, setRecentlyAddedItem] = useState<CartItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Load cart from database for authenticated users or localStorage for guests
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      loadCartFromLocalStorage();
    }

    // Reload when backend reconnects
    const handleReconnect = () => {
      if (user) {
        loadCartFromDatabase();
      }
    };

    window.addEventListener('backend-reconnected', handleReconnect);
    return () => window.removeEventListener('backend-reconnected', handleReconnect);
  }, [user]);

  // Sync localStorage for guests
  useEffect(() => {
    if (!user && !syncing) {
      localStorage.setItem("cart-items", JSON.stringify(items));
    }
  }, [items, user, syncing]);

  // Real-time subscription for cart updates across devices
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('cart-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadCartFromDatabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadCartFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem("cart-items");
      setItems(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromDatabase = async (retryCount = 0, maxRetries = 3) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const cartItems: CartItem[] = (data || []).map(item => ({
        id: item.automation_id,
        name: item.name,
        price: Number(item.price),
        hoursSaved: item.hours_saved,
        thumbnail: item.thumbnail || undefined,
        quantity: item.quantity
      }));

      setItems(cartItems);

      // Merge localStorage cart on first login
      const localCart = localStorage.getItem("cart-items");
      if (localCart) {
        const localItems: CartItem[] = JSON.parse(localCart);
        await mergeLocalCartToDatabase(localItems, cartItems);
        localStorage.removeItem("cart-items");
      }
    } catch (error) {
      // Retry with exponential backoff - silent until final failure
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => loadCartFromDatabase(retryCount + 1, maxRetries), delay);
        return;
      }
      
      // Only log final failure after all retries exhausted
      if (retryCount >= maxRetries) {
        console.error("Failed to load cart after retries");
      }
    } finally {
      if (retryCount === 0) {
        setLoading(false);
      }
    }
  };

  const mergeLocalCartToDatabase = async (localItems: CartItem[], dbItems: CartItem[]) => {
    if (!user || localItems.length === 0) return;

    setSyncing(true);
    try {
      for (const localItem of localItems) {
        const existingItem = dbItems.find(item => item.id === localItem.id);
        
        if (existingItem) {
          // Update quantity if item exists
          await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + localItem.quantity })
            .eq('user_id', user.id)
            .eq('automation_id', localItem.id);
        } else {
          // Insert new item
          await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              automation_id: localItem.id,
              name: localItem.name,
              price: localItem.price,
              hours_saved: localItem.hoursSaved,
              thumbnail: localItem.thumbnail,
              quantity: localItem.quantity
            });
        }
      }

      await loadCartFromDatabase();
      
      toast({
        title: "Cart Synced",
        description: "Your cart has been synced across devices"
      });
    } catch (error) {
      console.error("Error merging carts:", error);
    } finally {
      setSyncing(false);
    }
  };

  const addItem = async (item: CartItem) => {
    if (user) {
      // Add to database for authenticated users
      try {
        const { data: existing } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('automation_id', item.id)
          .single();

        if (existing) {
          await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + 1 })
            .eq('id', existing.id);
          
          setRecentlyAddedItem({ ...item, quantity: existing.quantity + 1 });
        } else {
          await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              automation_id: item.id,
              name: item.name,
              price: item.price,
              hours_saved: item.hoursSaved,
              thumbnail: item.thumbnail,
              quantity: 1
            });
          
          setRecentlyAddedItem({ ...item, quantity: 1 });
        }

        await loadCartFromDatabase();
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast({
          title: "Error",
          description: "Failed to add item to cart",
          variant: "destructive"
        });
      }
    } else {
      // Add to localStorage for guests
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
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    if (user) {
      try {
        await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('automation_id', id);

        await loadCartFromDatabase();
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast({
          title: "Error",
          description: "Failed to update quantity",
          variant: "destructive"
        });
      }
    } else {
      setItems((prev) => prev.map((item) => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const clearRecentlyAdded = () => {
    setRecentlyAddedItem(null);
  };

  const removeItem = async (id: string) => {
    if (user) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('automation_id', id);

        await loadCartFromDatabase();
      } catch (error) {
        console.error("Error removing item:", error);
        toast({
          title: "Error",
          description: "Failed to remove item",
          variant: "destructive"
        });
      }
    } else {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        await loadCartFromDatabase();
      } catch (error) {
        console.error("Error clearing cart:", error);
        toast({
          title: "Error",
          description: "Failed to clear cart",
          variant: "destructive"
        });
      }
    } else {
      setItems([]);
    }
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
        loading,
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
