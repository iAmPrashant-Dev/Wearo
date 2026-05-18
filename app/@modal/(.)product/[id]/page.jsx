import ProductDetailsClient from "@/components/ProductDetailsClient";
import ProductModal from "@/components/ProductModal";

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

export default async function ProductDetailsModalPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const product = await getProduct(id);

  if (!product) {
    return null;
  }

  return (
    <ProductModal>
      <ProductDetailsClient product={product} />
    </ProductModal>
  );
}
