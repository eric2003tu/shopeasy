/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductDetailServer from '@/components/product/ProductDetailServer';

// Use plain component signature to avoid Next.js PageProps type-check mismatch in this environment
export default function Page(props: any) {
  const id = props?.params?.id;
  return <ProductDetailServer id={id} />;
}
