"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function ProductModal({ children }) {
  const router = useRouter();

  const handleOpenChange = (open) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-7xl max-h-[80vh] overflow-y-auto p-0 gap-0 z-52">
        <DialogTitle className="sr-only">Product Details</DialogTitle>
        <div className="p-4 md:p-6 bg-white dark:bg-zinc-950">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
