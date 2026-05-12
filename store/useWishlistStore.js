"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create()(
  persist(
    (set, get) => ({
      wishlist: [],

      setWishlist: (wishlist) => set({ wishlist }),

      // Actions
      toggleWishlist: async (product) => {
        const previousWishlist = get().wishlist;
        const exists = previousWishlist.some((item) => item.id === product.id);
        
        let newWishlist;
        if (exists) {
          newWishlist = previousWishlist.filter((item) => item.id !== product.id);
        } else {
          newWishlist = [...previousWishlist, product];
        }

        // 1. Optimistic Update
        set({ wishlist: newWishlist });

        // 2. Sync to DB
        try {
          const response = await fetch("/api/user/wishlist", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wishlist: newWishlist }),
          });

          if (!response.ok) {
            // If it's a 401, we just let it be (not logged in)
            // But for other errors, we might want to revert
            if (response.status !== 401) {
              throw new Error("Failed to sync wishlist");
            }
          }
        } catch (error) {
          console.error("Wishlist sync failed:", error);
          // 3. Rollback on error (optional, but good for data integrity)
          set({ wishlist: previousWishlist });
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.id === productId);
      },

      clearWishlist: () => set({ wishlist: [] }),

      // Computed
      get totalItems() {
        return get().wishlist.length;
      },
    }),
    {
      name: "wearo-wishlist", // localStorage key
    }
  )
);
