/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductDetailServer from '@/components/product/ProductDetailServer';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailServer id={id} />;
}
