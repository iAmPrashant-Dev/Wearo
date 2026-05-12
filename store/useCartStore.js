"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create()(
  persist(
    (set, get) => ({
      cart: [],

      setCart: (cart) => set({ cart }),

      addItem: async (product, size = "M", color = "Default") => {
        const previousCart = get().cart;
        const existingItemIndex = previousCart.findIndex(
          (item) => item.id === product.id && item.size === size && item.color === color
        );

        let newCart;
        if (existingItemIndex !== -1) {
          newCart = [...previousCart];
          newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity + 1,
          };
        } else {
          newCart = [...previousCart, { ...product, quantity: 1, size, color }];
        }

        // 1. Optimistic Update
        set({ cart: newCart });

        // 2. Sync to DB
        try {
          const response = await fetch("/api/user/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: newCart }),
          });

          if (!response.ok && response.status !== 401) {
            throw new Error("Failed to sync cart");
          }
        } catch (error) {
          console.error("Cart sync failed (addItem):", error);
          set({ cart: previousCart });
        }
      },

      removeItem: async (productId, size, color) => {
        const previousCart = get().cart;
        const newCart = previousCart.filter(
          (item) => !(item.id === productId && item.size === size && item.color === color)
        );

        // 1. Optimistic Update
        set({ cart: newCart });

        // 2. Sync to DB
        try {
          const response = await fetch("/api/user/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: newCart }),
          });

          if (!response.ok && response.status !== 401) {
            throw new Error("Failed to sync cart");
          }
        } catch (error) {
          console.error("Cart sync failed (removeItem):", error);
          set({ cart: previousCart });
        }
      },

      updateQuantity: async (productId, size, color, quantity) => {
        if (quantity < 1) return;

        const previousCart = get().cart;
        const newCart = previousCart.map((item) =>
          item.id === productId && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        );

        // 1. Optimistic Update
        set({ cart: newCart });

        // 2. Sync to DB
        try {
          const response = await fetch("/api/user/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: newCart }),
          });

          if (!response.ok && response.status !== 401) {
            throw new Error("Failed to sync cart");
          }
        } catch (error) {
          console.error("Cart sync failed (updateQuantity):", error);
          set({ cart: previousCart });
        }
      },

      clearCart: async () => {
        const previousCart = get().cart;
        
        // 1. Optimistic Update
        set({ cart: [] });

        // 2. Sync to DB
        try {
          const response = await fetch("/api/user/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: [] }),
          });

          if (!response.ok && response.status !== 401) {
            throw new Error("Failed to clear cart in DB");
          }
        } catch (error) {
          console.error("Cart sync failed (clearCart):", error);
          set({ cart: previousCart });
        }
      },

      get totalItems() {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      get subtotal() {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "wearo-cart",
    }
  )
);
