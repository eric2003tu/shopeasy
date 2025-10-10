"use client";
import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiInfo } from 'react-icons/fi';
import { IoMdSearch } from 'react-icons/io';
import { OneProduct } from './OneProduct';
import { useI18n } from '@/i18n/I18nProvider';


interface Product {
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
  // Use a local hard-coded product list that uses images from /public
  const defaultProducts: Product[] = [
    { _id: '1', name: 'Premium Running Shoes', description: 'Comfortable and durable running shoes', price: 89.99, images: ['/shoes.jpg'], category: 'Footwear', stock: 24, featured: true },
    { _id: '2', name: 'Designer Handbag', description: 'Stylish handbag for every occasion', price: 199.99, images: ['/bag.jpg'], category: 'Accessories', stock: 12 },
    { _id: '3', name: 'Smart Watch Pro', description: 'Advanced smartwatch with health tracking', price: 249.99, images: ['/watch.jpg'], category: 'Electronics', stock: 6, featured: true },
    { _id: '4', name: 'Trail Runner Shoes', description: 'Grip and comfort for outdoor runs', price: 99.99, images: ['/shoes.jpg'], category: 'Footwear', stock: 18 },
    { _id: '5', name: 'Everyday Tote Bag', description: 'Spacious tote for daily essentials', price: 59.99, images: ['/bag.jpg'], category: 'Accessories', stock: 30 },
    { _id: '6', name: 'Fitness Smartband', description: 'Lightweight band for activity tracking', price: 69.99, images: ['/watch.jpg'], category: 'Electronics', stock: 40 },
    { _id: '7', name: 'Classic Sneakers', description: 'Timeless style and comfort', price: 79.99, images: ['/shoes.jpg'], category: 'Footwear', stock: 15 },
    { _id: '8', name: 'Evening Clutch', description: 'Elegant clutch for nights out', price: 89.99, images: ['/bag.jpg'], category: 'Accessories', stock: 8 },
    { _id: '9', name: 'Sportwatch X', description: 'Durable sports watch with GPS', price: 179.99, images: ['/watch.jpg'], category: 'Electronics', stock: 10 },
    { _id: '10', name: 'Comfort Running Shoes', description: 'Cushioned soles for long runs', price: 95.0, images: ['/shoes.jpg'], category: 'Footwear', stock: 20 },
    { _id: '11', name: 'Leather Shoulder Bag', description: 'Premium leather for everyday use', price: 229.99, images: ['/bag.jpg'], category: 'Accessories', stock: 5, featured: true },
    { _id: '12', name: 'Hybrid Smartwatch', description: 'Smart features with classic look', price: 199.99, images: ['/watch.jpg'], category: 'Electronics', stock: 14 },
    { _id: '13', name: 'Urban Runners', description: 'Lightweight runners for city use', price: 85.0, images: ['/shoes.jpg'], category: 'Footwear', stock: 22 },
    { _id: '14', name: 'Canvas Carryall', description: 'Durable carryall for everyday', price: 49.99, images: ['/bag.jpg'], category: 'Accessories', stock: 27 },
    { _id: '15', name: 'Pulse Tracker', description: 'Heart-rate monitoring smartwatch', price: 129.99, images: ['/watch.jpg'], category: 'Electronics', stock: 18 },
    { _id: '16', name: 'Roadster Shoes', description: 'Performance-driven running shoes', price: 109.99, images: ['/shoes.jpg'], category: 'Footwear', stock: 11 },
    { _id: '17', name: 'Mini Satchel', description: 'Compact satchel for essentials', price: 69.99, images: ['/bag.jpg'], category: 'Accessories', stock: 9 },
    { _id: '18', name: 'Watch Sport Lite', description: 'Affordable sports watch with features', price: 89.99, images: ['/watch.jpg'], category: 'Electronics', stock: 35 },
    { _id: '19', name: 'Everyday Slip-ons', description: 'Comfortable slip-on shoes', price: 59.99, images: ['/shoes.jpg'], category: 'Footwear', stock: 40 },
    { _id: '20', name: 'Office Tote', description: 'Sleek tote for work and commute', price: 129.99, images: ['/bag.jpg'], category: 'Accessories', stock: 7 },
    { _id: '21', name: 'Chrono Elite', description: 'Premium smartwatch with metal band', price: 299.99, images: ['/watch.jpg'], category: 'Electronics', stock: 4, featured: true },
    { _id: '22', name: 'Gym Trainers', description: 'Supportive trainers for gym sessions', price: 74.99, images: ['/shoes.jpg'], category: 'Footwear', stock: 28 },
    { _id: '23', name: 'Weekender Bag', description: 'Large bag for short trips', price: 149.99, images: ['/bag.jpg'], category: 'Accessories', stock: 6 },
    { _id: '24', name: 'Navigator Watch', description: 'Outdoor-ready GPS watch', price: 219.99, images: ['/watch.jpg'], category: 'Electronics', stock: 9 },
    { _id: '25', name: 'Lightweight Runners', description: 'Breathable runners for daily wear', price: 69.99, images: ['/shoes.jpg'], category: 'Footwear', stock: 33 }
  ];

  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(defaultProducts);
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
    setProducts(defaultProducts);
    setFilteredProducts(defaultProducts);
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
                <div className="relative w-full">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="min-w-full h-48 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                    }}
                  />
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