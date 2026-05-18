"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const { data: session, status } = useSession();
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const addItem = useCartStore((state) => state.addItem);

  const isWishlisted = useWishlistStore((state) =>
    state.wishlist.some(item => item.id === product.id)
  );

  const isAddedToCart = useCartStore((state) =>
    state.cart.some(item => item.id === product.id)
  );

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === 'unauthenticated') {
      toast.warning('Please login to add items to wishlist');
      return;
    }
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === 'unauthenticated') {
      toast.warning('Please login to add items to cart');
      return;
    }
    addItem(product);
  };

  return (
    <Link
      href={`/product/${product._id}`}
      className="group block bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Image area - Matching TrendingSection m-3 rounded-2xl */}
      <div className="relative aspect-square bg-zinc-50 dark:bg-zinc-800/50 m-3 rounded-2xl flex items-center justify-center overflow-hidden">
        {product.images?.[0] ? (
          <Image
            src={product.images?.[0]}
            alt={product?.name || product?.product}
            fill
            className="object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-300 dark:text-zinc-700 font-medium text-xs">
            Image Placeholder
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="w-fit bg-white/90 backdrop-blur-sm text-black hover:bg-white uppercase tracking-widest text-[9px] font-bold rounded-full px-2 py-0.5 shadow-sm border-none">
              New
            </Badge>
          )}
          {product.discount && (
            <Badge className="w-fit bg-red-500 text-white hover:bg-red-600 uppercase tracking-widest text-[9px] font-bold rounded-full px-2 py-0.5 shadow-sm border-none">
              {product.discount}% Off
            </Badge>
          )}
        </div>

        {/* Wishlist Button - ALWAYS VISIBLE */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={handleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm dark:bg-zinc-800/90 shadow-sm border border-transparent hover:scale-110 transition-all active:scale-95"
          >
            <Heart
              size={18}
              className={isWishlisted ? "text-orange-500 fill-orange-500" : "text-zinc-400"}
            />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 pb-4 pt-2">
        {/* Brand + Rating */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate pr-2">
            {product.name?.replace(/TSS|Souled/gi, "Wearo").trim()}
          </span>
          {product.avg_rating && (
            <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 shrink-0">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="#facc15"
                stroke="#facc15"
                strokeWidth="1"
                aria-hidden="true"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{product.avg_rating}</span>
            </div>
          )}
        </div>

        {/* Product name */}
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-3 leading-snug line-clamp-1">
          {product.category?.replace(/TSS|Souled/gi, "Wearo").trim()}
        </p>

        {/* Price + Primary Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2 pb-1">
            <span className="text-lg font-bold text-zinc-900 dark:text-white">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-zinc-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button disabled={isAddedToCart} onClick={handleAddToCart} className="text-sm font-bold text-white bg-black p-2.5 rounded-full flex cursor-pointer items-center gap-1 transition-colors">
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
