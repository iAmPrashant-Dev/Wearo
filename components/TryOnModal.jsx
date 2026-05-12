"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Loader2, User, Shirt, Sparkles, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { CldUploadButton, CldUploadWidget } from "next-cloudinary";

export default function TryOnModal({ isOpen, onClose, productImages, productName, productDes }) {
  const { data: session } = useSession();
  const [selectedUserImage, setSelectedUserImage] = useState(null);
  const [selectedProductImage, setSelectedProductImage] = useState(productImages?.[0] || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localUserImages, setLocalUserImages] = useState([]);
  const [resource, setResource] = useState();

  React.useEffect(() => {
    if (session?.user?.tryOnImages) {
      setLocalUserImages(session.user.tryOnImages);
    }
  }, [session]);

  React.useEffect(() => {
    if (!isOpen) {
      setResultImageUrl(null);
    }
  }, [isOpen]);

  const userImages = session?.user?.tryOnImages || [];

  const handleTryOn = async () => {
    if (!selectedUserImage) {
      toast.error("Please select your image first");
      return;
    }
    if (!selectedProductImage) {
      toast.error("Please select a product image");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userImage: selectedUserImage,
          productImage: selectedProductImage,
          garment_des: productDes,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Virtual try-on completed!");
        setResultImageUrl(data.resultUrl);
      } else if (response.status === 429) {
        toast.error("Rate Limit Exceeded", {
          description: data.error || "Daily limit of 5 images reached. Please try again tomorrow.",
        });
      } else {
        toast.error(data.error || "Failed to process try-on");
      }
    } catch (error) {
      toast.error("An error occurred during the request");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log(file)

      const response = await fetch("/api/user/tryon-images/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Image uploaded successfully!");
        setLocalUserImages([...userImages, data.imageUrl]);
        setSelectedUserImage(data.imageUrl);
      } else {
        toast.error(data.error || "Failed to upload image");
      }
    } catch (error) {
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl sm:max-w-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            Virtual Try-On: <span className="text-zinc-500 font-medium">{productName}</span>
          </DialogTitle>
        </DialogHeader>
        {resultImageUrl ? (
          <div className="py-6 flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-indigo-500">
              <Sparkles size={16} />
              <span>Result: Your Virtual Preview</span>
            </div>
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden border-4 border-white shadow-2xl dark:border-zinc-800">
              <Image
                src={resultImageUrl}
                alt="Try-on result"
                fill
                className="object-cover"
                priority
              />
            </div>
            <p className="text-zinc-500 text-sm text-center px-10">
              This preview is generated using AI. The final fit and color may vary slightly.
            </p>
          </div>
        ) : (
          <div className="py-6 space-y-8 max-h-[70vh] overflow-y-auto px-1">
            {/* Section 1: User Image Selection */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                <User size={16} />
                <span>Step 1: Select Your Image</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Upload Button */}
                <label className="relative aspect-[3/4] cursor-pointer rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex flex-col items-center justify-center gap-2 bg-zinc-50/50 dark:bg-zinc-900/30 group">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                  ) : (
                    <button className="pointer-events-none">
                      <div className="p-3 w-fit mx-auto rounded-full bg-white dark:bg-zinc-800 shadow-sm group-hover:scale-110 transition-transform">
                        <Plus className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Upload New</span>
                    </button>
                  )}
                </label>

                {localUserImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative aspect-[3/4] cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${selectedUserImage === img
                      ? "border-zinc-900 ring-2 ring-zinc-900 ring-offset-2 dark:border-white dark:ring-white dark:ring-offset-zinc-900"
                      : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800"
                      }`}
                    onClick={() => setSelectedUserImage(img)}
                  >
                    <Image src={img} alt={`User image ${idx + 1}`} fill className="object-cover" />
                    {selectedUserImage === img && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-white dark:bg-zinc-900 rounded-full p-1">
                          <Check size={20} className="text-zinc-900 dark:text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Product Image Selection */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                <Shirt size={16} />
                <span>Step 2: Select Product Image</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {productImages?.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative aspect-[3/4] cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${selectedProductImage === img
                      ? "border-zinc-900 ring-2 ring-zinc-900 ring-offset-2 dark:border-white dark:ring-white dark:ring-offset-zinc-900"
                      : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800"
                      }`}
                    onClick={() => setSelectedProductImage(img)}
                  >
                    <Image src={img} alt={`Product ${idx + 1}`} fill className="object-cover" />
                    {selectedProductImage === img && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-white dark:bg-zinc-900 rounded-full p-1">
                          <Check size={20} className="text-zinc-900 dark:text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
          {resultImageUrl ? (
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => setResultImageUrl(null)}
              >
                Try Another
              </Button>
              <Button
                className="flex-1 sm:flex-none"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" onClick={onClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                className="px-8 font-bold"
                onClick={handleTryOn}
                disabled={isProcessing || !selectedUserImage || !selectedProductImage}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Try It On"
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
