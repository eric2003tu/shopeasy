/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductDetailServer from '@/components/product/ProductDetailServer';

// Use a plain React component signature to avoid Next.js PageProps type-check mismatch
export default function Page(props: unknown) {
  const id = (props && typeof props === 'object' && (props as any).params && (props as any).params.id) ? (props as any).params.id : undefined;
  return <ProductDetailServer id={id} />;
}
