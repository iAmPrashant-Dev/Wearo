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
      <DialogContent showCloseButton={false} className="max-w-[95vw] md:max-w-7xl overflow-hidden p-0 gap-0 z-52 bg-white dark:bg-zinc-950">
        <DialogTitle className="sr-only">Product Details</DialogTitle>
        <div className="w-full h-full p-4 md:p-6 max-h-[calc(80vh-1rem)] overflow-y-auto my-2">
          {children}
        </div>

        {/* Custom positioned close button to avoid overlapping the scrollbar */}
        <button
          onClick={() => handleOpenChange(false)}
          className="absolute cursor-pointer top-4 right-4 md:right-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-zinc-100 dark:bg-zinc-800 p-2 z-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          <span className="sr-only">Close</span>
        </button>
      </DialogContent>
    </Dialog>
  );
}
