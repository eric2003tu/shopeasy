"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import { FiAlertCircle, FiInfo } from 'react-icons/fi';
import { IoMdSearch } from 'react-icons/io';
import { OneProduct } from './OneProduct';
import { useI18n } from '@/i18n/I18nProvider';
import { sampleProducts } from '@/lib/sampleData';


export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  featured?: boolean;
}

const UploadedProducts: React.FC = () => {
  // Use canonical sampleProducts from lib
  const mappedProducts = React.useMemo(() => sampleProducts.map((p) => ({
    _id: p.id,
    name: p.name,
    description: p.description || '',
    price: p.price,
    images: p.images,
    category: p.category || '',
    stock: p.stock || 0,
    featured: !!p.funded,
  })), []);

  const [products, setProducts] = useState<Product[]>(mappedProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mappedProducts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [one,setOne] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewed, setViewed] = useState<boolean>(false)

  const handleProductSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      setHasSearched(false);
      return;
    }

    const q = searchTerm.trim().toLowerCase();
    const results = products.filter(p => (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ));
    setFilteredProducts(results);
    setHasSearched(true);
  };

  useEffect(() => {
    // initialize local products (no network)
    setProducts(mappedProducts);
    setFilteredProducts(mappedProducts);
    try {
      // expose for admin seeding in the browser dev environment
      (window as unknown as { __SHOPEASY_DEFAULT_PRODUCTS?: Product[] }).__SHOPEASY_DEFAULT_PRODUCTS = mappedProducts;
    } catch {
      // ignore
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };


  const { t } = useI18n();

  if (isLoading) {
    return (
      <div>
        <div className="grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 justify-items-center">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden justify-self-center animate-pulse">
              <div className="bg-gray-200 h-48 w-full"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FiAlertCircle className="text-red-500 text-4xl mb-4" />
  <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('product.noProductsAvailable')}</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {t('product.tryAgain')}
        </button>
      </div>
    );
  }

  const displayProducts = hasSearched ? filteredProducts : products;
  const noSearchResults = hasSearched && filteredProducts.length === 0;

  return (
    <div className='w-full grid grid-cols-1 justify-items-center text-center' >
      <h1 className="text-[#634bc1] text-md text-start mt-2">{t('footer.findYourProduct')}</h1>
      <form onSubmit={handleProductSearch} className="flex flex-row lg:w-1/2 w-full px-4">
        <input 
          type="text" 
          placeholder={t('header.searchPlaceholder') || 'Find products by name, category, seller, price...'} 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full px-3 py-2 rounded-l text-gray-500 focus:outline-none border border-gray-500"
        />
        <button 
          type="submit" 
          className="bg-[#ffdc89] text-[#634bc1] px-4 py-2 rounded-r cursor-pointer hover:bg-[#e6c97d] transition"
        >
          <IoMdSearch size={20} />
        </button>
      </form>
      <div className='w-fit grid bg-green-300 '> {one ? (
     <OneProduct  productId={selectedId}  onClose={() => setOne(false)} />
) : null}</div>

      {noSearchResults ? (
        <div className="flex flex-col items-center justify-center p-8 text-center w-full">
          <FiInfo className="text-blue-500 text-4xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('product.noProductsFound')}</h2>
          <p className="text-gray-600">No products match your search &quot;{searchTerm}&quot;</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setHasSearched(false);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {t('product.clearSearch')}
          </button>
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center w-full">
          <FiInfo className="text-blue-500 text-4xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('product.noProductsAvailable')}</h2>
          <p className="text-gray-600">Check back later or add new products</p>
        </div>
      ) : (
        <div id="products" className="grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-5 gap-6 p-6">
          {displayProducts.map((product) => {
            const imageUrl = product.images[0] || '/placeholder-product.jpg';
            
            return (
              <div 
                key={product._id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 ${
                  product.featured ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="relative w-full h-48">
                  <Image src={imageUrl} alt={product.name} fill className="object-contain" sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" />
                    {product.featured && (
                    <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    <span className={`text-sm ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  
                  <button
                    onClick={()=>{
                      setSelectedId(product._id);
                      setViewed(true)
                      setOne(true);
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
                  >
                    {t('product.viewDetails')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UploadedProducts;