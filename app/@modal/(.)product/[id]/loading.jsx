import ProductModal from "@/components/ProductModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingModal() {
  return (
    <ProductModal>
      <div className="max-w-[1400px] w-full mx-auto py-8 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left: Image Gallery Skeleton */}
          <div className="lg:flex-[0.85] w-full flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-32 h-fit">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:max-h-[600px] md:w-24 shrink-0 p-1 pb-2 md:pb-1">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-20 md:w-full aspect-[4/5] rounded-lg" />
              ))}
            </div>
            <Skeleton className="w-full aspect-[4/5] md:aspect-auto md:h-[600px] rounded-xl" />
          </div>

          {/* Right: Details Skeleton */}
          <div className="lg:flex-1 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-10 w-3/4 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
            
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-16" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-16 rounded-md" />)}
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <Skeleton className="h-6 w-20" />
              <div className="flex gap-2">
                {[1, 2].map((i) => <Skeleton key={i} className="h-12 w-12 rounded-full" />)}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <Skeleton className="h-14 flex-1 rounded-xl" />
              <Skeleton className="h-14 w-14 rounded-xl" />
            </div>
          </div>
          
        </div>
      </div>
    </ProductModal>
  );
}
