"use client";

import React from 'react'
import Link from 'next/link';
import UploadedProducts from './UplaodedProducts';
import { FiClock } from 'react-icons/fi';
import { BsBoxSeam } from 'react-icons/bs';
import { FaRegCreditCard } from 'react-icons/fa';
import Search from './Search';
import { useI18n } from '@/i18n/I18nProvider';


const Products :React.FC = () => {
  
  const { t } = useI18n();

  return (
<div className=' grid grid-cols-1 min-h-screen bg-white w-full text-center gap-6'>
      <section className="relative bg-gradient-to-r from-[#332e47] to-[#1d163c] py-16 pt-20 px-4 text-white overflow-hidden">
       <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {t('site.welcome', { brand: 'ShopEasy' })}
            </h1>
            <p className="text-lg md:text-xl">
              Your one-stop shop for the best deals, latest trends, and all your favorite products. 
              From fashion to electronics, we&apos;ve got you covered with over 50,000 quality items!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/signup" 
                className="px-8 py-3 bg-[#ffdc89] text-[#634bc1] font-semibold rounded-lg hover:bg-[#ffe8a8] transition-colors shadow-lg"
              >
                Sign Up Now
              </Link>
              <Link 
                href="/products" 
                className="px-8 py-3 border-2 border-white font-semibold rounded-lg hover:bg-white hover:text-[#634bc1] transition-colors"
              >
                Start Shopping
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <FiClock className="text-[#ffdc89]" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <BsBoxSeam className="text-[#ffdc89]" />
                <span>Free Shipping Over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <FaRegCreditCard className="text-[#ffdc89]" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Search />
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#ffdc89] opacity-10"></div>
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#634bc1] opacity-10"></div>
      </section>
  <h1 className='text-[#634bc1] text-3xl font-bold'>
  {t('home.startYourPurchase')}
  </h1>
      <UploadedProducts />
    </div>
  )
}

export default Products