import ProductDetailsClient from "@/components/ProductDetailsClient";
import { notFound } from "next/navigation";

async function getProduct(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products/${id}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Fetch product detail failed:", error);
    return null;
  }
}

export default async function ProductDetailsPage({ params }) {
  // In Next.js 15+, params is a promise. We await it.
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}
