"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Truck, RefreshCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { toast } from "sonner";
import TryOnModal from "./TryOnModal";
import { Sparkles } from "lucide-react";

export default function ProductDetailsClient({ product }) {
  const { data: session, status } = useSession();
  const router = useRouter()
  // Add a virtual tryon button that will open a modal to select image, user image is stored in user.tryOnImages mongoDB schema, select image and below it have a select product image once selected send both to api call  


  // Zustand stores
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isWishlisted = useWishlistStore((state) =>
    state.wishlist.some(item => item.id === product.id)
  );

  // Local UI state
  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0].size : "L";
  const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].id : "charcoal";

  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [activeImage, setActiveImage] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleWishlist = () => {
    if (status === 'unauthenticated') {
      toast.warning('Please login to add items to wishlist');
      // router.push('/login');
      return;
    }
    toggleWishlist(product);
  };

  const handleAddToCart = () => {
    if (status === 'unauthenticated') {
      toast.warning('Please login to add items to cart');
      // router.push('/login');
      return;
    }
    addItem(product, selectedSize, selectedColor);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto py-8 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

        {/* Left: Image Gallery */}
        <div className="lg:flex-[0.85] w-full flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-32 h-fit">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[600px] md:w-24 shrink-0 p-1 pb-2 md:pb-1 hide-scrollbar">
            {product.images && product.images.length > 0 ? (
              product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 md:w-full cursor-pointer aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white rounded-lg border transition-all ${activeImage === idx
                    ? "border-zinc-900 dark:border-white ring-1 ring-zinc-900 dark:ring-white"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                    }`}
                >
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                </button>
              ))
            ) : (
              [1, 2, 3, 4].map((idx) => (
                <button key={idx} className="w-20 md:w-24 aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white rounded-lg">
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-300 dark:text-zinc-700 text-xs text-center p-2">
                    View {idx}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Main Image */}
          <div
            className="w-full max-w-[550px] mx-auto aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 relative rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            {product.images && product.images.length > 0 ? (
              <div
                className="w-full h-full transition-transform duration-300 ease-out"
                style={{
                  transform: isZoomed ? "scale(1.8)" : "scale(1)",
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                }}
              >
                <Image
                  src={product.images[activeImage].replace('?w=300&dpr=1', '')}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-300 dark:text-zinc-700 text-lg">
                Main Image
              </div>
            )}
            {product.isNew && (
              <Badge className="absolute top-4 left-4 bg-white text-black hover:bg-zinc-100 uppercase tracking-widest text-xs font-bold z-10 px-3 py-1">
                New Arrival
              </Badge>
            )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="lg:flex-[1.15] w-full max-w-lg">
          <p className="text-sm text-zinc-500 mb-2 font-medium">{product.category}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">
            {product.name.replace(/TSS|Souled/gi, "Wearo").trim()}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-lg text-zinc-400 line-through">₹{product.originalPrice}</span>
                <Badge className="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-none px-2 py-0.5">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              </>
            )}
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
            {product.description || "Crafted with premium materials for maximum comfort and style. This garment is designed to provide a perfect fit and long-lasting durability."}
          </p>

          {/* Variants (Linked Products) */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Other Colors</h3>
                <span className="text-sm text-zinc-500">Pick a version</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {/* Current Product Swatch */}
                <div className="relative group">
                  <div className="w-12 h-12 rounded-full ring-2 ring-zinc-900 dark:ring-white ring-offset-2 dark:ring-offset-black flex items-center justify-center p-0.5">
                    <span
                      className="w-full h-full rounded-full border border-zinc-200 dark:border-zinc-800 shadow-inner"
                      style={{ backgroundColor: product.colors?.[0]?.color_hex || "#ccc" }}
                      title={product.colors?.[0]?.color_name || "Current"}
                    />
                  </div>
                </div>

                {/* Other Variants */}
                {product.variants.map((variant) => (
                  <a
                    key={variant.id || variant._id}
                    href={`/products/${variant.id || variant._id}`}
                    className="w-12 h-12 rounded-full flex items-center justify-center p-0.5 transition-all opacity-60 hover:opacity-100 hover:scale-110"
                  >
                    <span
                      className="w-full h-full rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm"
                      style={{ backgroundColor: variant.colors?.[0]?.color_hex || "#ccc" }}
                      title={variant.name || variant.product}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Simple Color Selector (Fallback/Local Color List) */}
          {(!product.variants || product.variants.length === 0) && product.colors && product.colors.length > 1 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Color</h3>
                <span className="text-sm text-zinc-500 capitalize">
                  {product.colors.find(c => c.id === selectedColor)?.color_name}
                </span>
              </div>
              <div className="flex gap-3">
                {product.colors.map(color => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center p-1 transition-all ${selectedColor === color.id ? "ring-2 ring-zinc-900 dark:ring-white ring-offset-2 dark:ring-offset-black" : "opacity-80 hover:opacity-100"
                      }`}
                  >
                    <span className="w-full h-full rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm" style={{ backgroundColor: color.color_hex }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Size</h3>
                <button className="text-sm cursor-pointer text-zinc-500 underline underline-offset-4 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {product.sizes.map(sizeObj => (
                  <button
                    key={sizeObj.size}
                    onClick={() => setSelectedSize(sizeObj.size)}
                    disabled={sizeObj.stock === 0}
                    className={`h-12 cursor-pointer border rounded-md flex items-center justify-center font-medium transition-all ${selectedSize === sizeObj.size
                      ? "border-zinc-900 bg-zinc-900 text-white dark:bg-white dark:border-white dark:text-black"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"
                      } ${sizeObj.stock === 0 ? "opacity-30 cursor-not-allowed line-through" : ""}`}
                  >
                    {sizeObj.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Button
              size="lg"
              className={`flex-1 py-4 h-14 cursor-pointer text-base ${isAddedToCart ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
              onClick={handleAddToCart}
            >
              <ShoppingCart className={`mr-2 h-5 w-5 ${isAddedToCart ? "animate-bounce" : ""}`} />
              {isAddedToCart ? "Added to Cart" : "Add to Cart"}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-14 px-6 shrink-0 cursor-pointer border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
              onClick={() => setIsTryOnOpen(true)}
            >
              <Sparkles className="mr-2 h-5 w-5 text-indigo-500" />
              Try On
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-14 px-6 shrink-0 cursor-pointer"
              onClick={handleWishlist}
            >
              <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              {/* {isWishlisted ? "Wishlisted" : "Wishlist"} */}
            </Button>
          </div>

          {/* Perks */}
          <div className="space-y-4 py-6 border-t border-b border-zinc-200 dark:border-zinc-800 mb-8">
            <div className="flex items-center text-zinc-600 dark:text-zinc-400 text-sm">
              <Truck className="w-5 h-5 mr-3 shrink-0 text-indigo-500" />
              <span>Complimentary shipping on orders over $150</span>
            </div>
            <div className="flex items-center text-zinc-600 dark:text-zinc-400 text-sm">
              <RefreshCcw className="w-5 h-5 mr-3 shrink-0 text-indigo-500" />
              <span>Free returns within 30 days of purchase</span>
            </div>
            <div className="flex items-center text-zinc-600 dark:text-zinc-400 text-sm">
              <ShieldCheck className="w-5 h-5 mr-3 shrink-0 text-indigo-500" />
              <span>1-year premium warranty included</span>
            </div>
          </div>

          {/* Details & Features */}
          {product.attributes && (
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Product Details</h3>
              <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400 text-sm">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <li key={key}>
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>: {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <TryOnModal
        isOpen={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
        productImages={product.images}
        productName={product.name}
        productDes={product.category}
      />
    </div>
  );
}
