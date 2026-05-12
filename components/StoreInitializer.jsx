"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAddressStore } from "@/store/useAddressStore";
import { useOrderStore } from "@/store/useOrderStore";

export default function StoreInitializer() {
  const { status } = useSession();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchUserData = async () => {
        try {
          const res = await fetch("/api/user/sync");
          if (!res.ok) return;
          const data = await res.json();

          if (data.cart) useCartStore.getState().setCart(data.cart);
          if (data.wishlist) useWishlistStore.getState().setWishlist(data.wishlist);
          if (data.addresses) useAddressStore.getState().setAddresses(data.addresses);
          if (data.orders) useOrderStore.getState().setOrders(data.orders);

          isInitialLoad.current = false;
        } catch (error) {
          console.error("Failed to hydrate stores from API:", error);
          isInitialLoad.current = false;
        }
      };

      fetchUserData();
    } else if (status === "unauthenticated") {
      isInitialLoad.current = false;
    }
  }, [status]);


  return null;
}
