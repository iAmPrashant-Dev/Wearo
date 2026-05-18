import ProductGrid from "@/components/ProductGrid";
import PaginationControls from "@/components/PaginationControls";

async function getMenProducts(searchParams) {
  try {
    const params = new URLSearchParams(searchParams);
    params.set('gender', '1');
    if (!params.has('limit')) params.set('limit', '20');

    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products?${params.toString()}`, {
      cache: 'no-store'
    });
    if (!res.ok) return { data: [], count: 0 };
    const resObj = await res.json()
    return resObj;
  } catch (error) {
    console.error("Fetch men products failed:", error);
    return { data: [], count: 0 };
  }
}

export default async function MenProductsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const result = await getMenProducts(resolvedParams);

  const products = result?.data || [];
  const totalCount = result?.count || 0;

  const currentPage = Number(resolvedParams.page) || 1;
  const limit = Number(resolvedParams.limit) || 20;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Men's Collection</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{totalCount} Results</p>
      </div>
      <ProductGrid products={products} />
      <PaginationControls currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
