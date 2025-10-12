"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { useI18n } from '@/i18n/I18nProvider';
import { IoClose } from "react-icons/io5";

interface Product {
  _id: string;
  images: string[];
  name: string;
  price: number;
  description: string;
  seller: string;
  stock: number;
  category: string;
  // Add other fields as needed
}

interface OneProductProps {
  productId: string | null;
  onClose: () => void; // Add onClose prop to handle closing from parent
}

export const OneProduct: React.FC<OneProductProps> = ({ productId, onClose }) => {
  const { t } = useI18n();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return; // Don't fetch if no productId

      try {
        const isLocal = window.location.hostname === 'localhost';
        const apiUrl = isLocal
          ? `http://localhost:5000/api/v1/products/${productId}`
          : `https://e-commerce-back-xy6s.onrender.com/api/v1/products/${productId}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch product');
        
        const data = await response.json();
        
        // Handle response data
        const productData = data.product || data;
        
        if (!productData) throw new Error('Product data not found in response');
        
        // Transform image path to full URL if needed
        const images = productData.images?.map((image: string) => 
          image.startsWith('http') ? image : `${isLocal ? 'http://localhost:5000' : 'https://e-commerce-back-xy6s.onrender.com'}${image}`
        ) || [];
        
        
        setProduct({
          ...productData,
          images
        });
      } catch (err) {
        console.error("Failed to view the product", err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); // Add productId to dependency array

  if (!productId) return null; // Don't render if no productId

  if (loading) return (
    <div className="fixed inset-0 bg-gray-700/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 bg-gray-700/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="text-red-500 p-4 text-center">
          {t('product.noProductsAvailable')}
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className={`fixed inset-0 bg-gray-700/30 bg-opacity-50 items-center justify-center z-50 flex`}>
      <div className="bg-white grid rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <IoClose 
          size={30} 
          onClick={onClose}
          className='text-black justify-self-end absolute right-4 top-4 cursor-pointer hover:text-gray-600'
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden relative h-64">
              <Image
                src={product.images[0] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {product.images.slice(1).map((image, index) => (
                  <div key={index} className="relative h-20 w-full rounded overflow-hidden">
                    <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" sizes="60px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-lg font-semibold text-indigo-600 mb-4">
              ${product.price.toFixed(2)}
            </p>
            
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500">Category:</span>
              <span className="ml-2 text-gray-700">{product.category}</span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500">Seller:</span>
              <span className="ml-2 text-gray-700">{product.seller}</span>
            </div>
            
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500">Availability:</span>
              <span className={`ml-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="flex space-x-4">
                <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                {t('product.addToCart')}
              </button>
              <button className="flex-1 py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};