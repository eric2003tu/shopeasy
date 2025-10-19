"use client";
import React from 'react'
import Image from 'next/image'
import { FiTruck, FiShield, FiShoppingBag, FiTag, FiHeadphones } from 'react-icons/fi'
import { FaStar, FaRegUser, FaRegCreditCard } from 'react-icons/fa'
import { BsBoxSeam } from 'react-icons/bs'
import Link from 'next/link';
import Search from './Search';
import ProductCard from '@/components/ui/ProductCard';
import { useI18n } from '@/i18n/I18nProvider';
import HeroSlideshow from '@/components/ui/HeroSlideshow';

const Home: React.FC = () => {
  const features = [
    {
      icon: <FiShoppingBag className="text-3xl" />,
      title: "Wide Product Range",
      description: "Explore thousands of high-quality products across multiple categories at competitive prices"
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: "Secure Payments",
      description: "Shop with confidence using our safe payment options. Your security is our top priority"
    },
    {
      icon: <FiTruck className="text-3xl" />,
      title: "Fast Delivery",
      description: "Get orders delivered quickly with real-time tracking and hassle-free returns"
    }
  ]

  const products = [
    {
      image: "/shoes.jpg",
      name: "Premium Running Shoes",
      price: 89.99,
      originalPrice: 120.00,
      rating: 4.8,
      reviews: 1245,
      isNew: true
    },
    {
      image: "/bag.jpg",
      name: "Designer Handbag",
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.5,
      reviews: 892,
      isNew: false
    },
    {
      image: "/watch.jpg",
      name: "Smart Watch Pro",
      price: 249.99,
      originalPrice: 299.99,
      rating: 4.9,
      reviews: 2103,
      isNew: true
    }
  ]

  const categories = [
    {
      image: "/electronics.png",
      name: "Electronics",
      count: 1250
    },
    {
      image: "/fashion.png",
      name: "Fashion",
      count: 3420
    },
    {
      image: "/Easy.png",
      name: "Home & Living",
      count: 876
    }
  ]

  const testimonials = [
    {
      quote: "ShopEasy has completely transformed my shopping experience. The delivery is always on time and the quality is exceptional!",
      author: "Sarah Johnson",
      role: "Loyal Customer"
    },
    {
      quote: "As a busy professional, I appreciate how easy it is to find exactly what I need. Their customer service is outstanding.",
      author: "Michael Chen",
      role: "Verified Buyer"
    },
    {
      quote: "The prices are unbeatable and the selection is vast. I've recommended ShopEasy to all my friends and family.",
      author: "Emily Rodriguez",
      role: "Premium Member"
    }
  ]

  const { t } = useI18n();

  // Hero slideshow handled by reusable component `HeroSlideshow` below.

  // Home now uses the reusable HeroSlideshow component below

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Reusable hero slideshow component */}
      <HeroSlideshow delay={5000} className="bg-gradient-to-r from-[#332e47] to-[#1d163c]" />

      {/* Mobile Search */}
      <div className="md:hidden p-4 bg-white shadow-md">
        <Search />
      </div>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          {t('home.whyChoose', { brand: 'ShopEasy' })}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {t('home.whyChooseSubtitle')}
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center"
            >
              <div className="text-[#634bc1] mb-4 p-4 bg-[#f5f2ff] rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t(`home.features.${index}.title`)}</h3>
              <p className="text-gray-600">{t(`home.features.${index}.description`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            {t('home.shopByCategory')}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('home.shopByCategorySubtitle')}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <div className="h-64 overflow-hidden relative">
                  <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <h3 className="text-2xl font-bold text-white mb-1">{t(`home.categories.${index}.name`, { name: category.name })}</h3>
              <p className="text-gray-200">{t('home.productsCount', { count: category.count })}</p>
                  <Link 
                    href={`/products?category=${category.name.toLowerCase()}`} 
                    className="mt-3 inline-flex items-center text-white font-medium hover:text-[#ffdc89] transition-colors"
                  >
                    {t('home.shopNow')}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {t('home.featuredProducts')}
              </h2>
              <p className="text-gray-600 mt-2">{t('home.featuredSubtitle')}</p>
            </div>
            <Link 
              href="/products" 
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t('home.viewAllProducts')}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                image={product.image}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                rating={product.rating}
                reviews={product.reviews}
                isNew={product.isNew}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#634bc1] to-[#3a2b7c] text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-[#ffdc89] text-[#634bc1] px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {t('home.limitedOffer')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('home.saleTitle')}
            </h2>
            <p className="text-lg mb-6">
              {t('home.saleSubtitle')}
            </p>
            <div className="flex items-center gap-4 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold bg-white/20 rounded-lg px-4 py-2 w-16">03</div>
                <span className="text-sm mt-1 block">{t('home.days')}</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-white/20 rounded-lg px-4 py-2 w-16">12</div>
                <span className="text-sm mt-1 block">{t('home.hours')}</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-white/20 rounded-lg px-4 py-2 w-16">45</div>
                <span className="text-sm mt-1 block">{t('home.minutes')}</span>
              </div>
            </div>
            <Link 
              href="/sale" 
              className="inline-block px-8 py-3 bg-[#ffdc89] text-[#634bc1] font-semibold rounded-lg hover:bg-[#ffe8a8] transition-colors shadow-lg"
            >
              {t('home.shopTheSale')}
            </Link>
          </div>
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <div className="relative w-full h-64">
                <Image src="/fashion.png" alt="Summer Sale" fill className="w-full h-full object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white text-[#634bc1] px-6 py-3 rounded-lg shadow-lg font-bold text-xl">
              50% OFF
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            {t('home.testimonialsTitle')}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('home.testimonialsSubtitle')}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[0, 1, 2].map((_, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4 text-yellow-500">
                  {[...Array(5)].map((__, i) => (
                    <FaStar key={i} className="w-5 h-5" />
                  ))}
                </div>
                <blockquote className="text-gray-600 italic mb-6">
                  &quot;{t(`home.testimonials.${index}.quote`)}&quot;
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <FaRegUser className="text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{t(`home.testimonials.${index}.author`)}</h4>
                    <p className="text-sm text-gray-500">{t(`home.testimonials.${index}.role`)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            {t('home.howItWorksTitle')}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('home.howItWorksSubtitle')}
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {[0,1,2,3].map((i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 bg-[#f5f2ff] rounded-full flex items-center justify-center mx-auto mb-4 text-[#634bc1]">
                  {i === 0 && <FiShoppingBag className="text-2xl" />}
                  {i === 1 && <FiTag className="text-2xl" />}
                  {i === 2 && <FaRegCreditCard className="text-2xl" />}
                  {i === 3 && <FiTruck className="text-2xl" />}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{i + 1}. {t(`home.steps.${i}.title`)}</h3>
                <p className="text-gray-600 text-sm">{t(`home.steps.${i}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-[#634bc1] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            {t('home.newsletter.badge')}
          </div>
          <h2 className="text-3xl font-bold mb-4">{t('home.newsletter.title')}</h2>
          <p className="mb-8 max-w-2xl mx-auto text-lg">
            {t('home.newsletter.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder={t('home.newsletter.placeholder')} 
              className="flex-grow px-6 py-4 rounded-md border border-gray-100 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffdc89]"
            />
            <button className="px-8 py-4 bg-[#ffdc89] text-[#634bc1] font-semibold rounded-lg hover:bg-[#ffe8a8] transition-colors shadow-md">
              {t('home.newsletter.subscribeButton')}
            </button>
          </div>
          <p className="mt-4 text-sm text-white/80">
            {t('home.newsletter.privacyText')}
          </p>
        </div>
      </section>

      {/* Customer Support */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-14 h-14 bg-[#f5f2ff] rounded-full flex items-center justify-center mx-auto mb-4 text-[#634bc1]">
              <FiHeadphones className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{t('home.supportBlocks.0.title')}</h3>
            <p className="text-gray-600 mb-4">{t('home.supportBlocks.0.description')}</p>
            <Link href="/contact" className="text-[#634bc1] font-medium hover:underline">
              {t('home.supportBlocks.0.cta')}
            </Link>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-14 h-14 bg-[#f5f2ff] rounded-full flex items-center justify-center mx-auto mb-4 text-[#634bc1]">
              <FiTruck className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{t('home.supportBlocks.1.title')}</h3>
            <p className="text-gray-600 mb-4">{t('home.supportBlocks.1.description')}</p>
            <Link href="/track-order" className="text-[#634bc1] font-medium hover:underline">
              {t('home.supportBlocks.1.cta')}
            </Link>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-14 h-14 bg-[#f5f2ff] rounded-full flex items-center justify-center mx-auto mb-4 text-[#634bc1]">
              <FiShield className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{t('home.supportBlocks.2.title')}</h3>
            <p className="text-gray-600 mb-4">{t('home.supportBlocks.2.description')}</p>
            <Link href="/returns" className="text-[#634bc1] font-medium hover:underline">
              {t('home.supportBlocks.2.cta')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
