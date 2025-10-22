import ProductDetailServer from '@/components/product/ProductDetailServer';

interface Props { params: { id: string } }

export default async function Page({ params }: Props) {
  return <ProductDetailServer id={params.id} />;
}
