import ProductDetailClient from './ProductDetailClient';
import { getProductById } from '@/services/products.service';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  return <ProductDetailClient product={product as any} />;
}
