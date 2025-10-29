"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsBoxSeam, BsCart2 } from 'react-icons/bs';
import { MdPayment } from 'react-icons/md';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { HiOutlineGlobeAlt } from 'react-icons/hi';
import { BiUser } from 'react-icons/bi';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { subscribeCart, getCartCount } from '@/lib/cart';
import { useI18n } from '@/i18n/I18nProvider';
import { FaJediOrder } from 'react-icons/fa';

export default function ShopHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, locale, setLocale } = useI18n();
  const langRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const auth = useAuth();
  const [cartCount, setCartCount] = useState<number>(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Creates a small SVG avatar with initials as a data URL
  const makeInitialsAvatar = (fullName?: string) => {
    const name = fullName || '';
    const initials = name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() || 'U';
    const bg = '#6b46c1';
    const fg = '#ffffff';
    const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>
      <rect width='100%' height='100%' fill='${bg}' />
      <text x='50%' y='50%' dy='.35em' fill='${fg}' font-family='Arial, Helvetica, sans-serif' font-size='52' text-anchor='middle'>${initials}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      
      // Close language dropdown if clicking outside
      if (langRef.current && !langRef.current.contains(target)) {
        setLangOpen(false);
      }
      
      // Close user menu if clicking outside
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
      
      // Close mobile menu when clicking outside
      if (mobileOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        // Also check if we're not clicking the menu button itself
        const menuButton = document.querySelector('button[aria-label*="menu"]');
        if (menuButton && !menuButton.contains(target)) {
          setMobileOpen(false);
        }
      }
    };
    
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [mobileOpen]); // Add mobileOpen as dependency

  useEffect(() => {
    // subscribe to cart changes for live badge updates
    const unsub = subscribeCart((cart) => {
      setCartCount(cart.reduce((s, it) => s + (it.quantity || 0), 0));
    });
    // also seed from localStorage
    try { setCartCount(getCartCount()); } catch {}
    return () => unsub();
  }, []);

  // Close mobile menu when navigating
  const handleMobileLinkClick = () => {
    setMobileOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#634bc1] shadow-md' : 'bg-[#634bc1]/90 backdrop-blur-sm'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-2 relative">
          <Link data-nav="home" href="/shop" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12">
              <Image src="/logo.jpg" alt="ShopEasy Logo" fill className="rounded-full border-2 border-white/30 group-hover:border-[#ffdc89] transition-all object-cover" sizes="48px" />
            </div>
            <span className="text-white font-bold text-xl md:text-2xl ml-2">
              Shop<span className="text-[#ffdc89]">Easy</span>
            </span>
          </Link>

          {/* Mobile controls */}
          <div className="flex items-center gap-3 md:hidden">
            <Link href="/shop/carts" className="relative p-2 text-white hover:bg-white/10 rounded-md transition-colors">
              <BsCart2 className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-red-500 rounded-full min-w-[20px]">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
                          <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 bg-gray-200 rounded-full overflow-hidden border border-white/30">
                  {auth.user?.image ? (
                    <Image 
                      src={auth.user.image} 
                      alt={(auth.user.firstName || auth.user.username) as string} 
                      fill 
                      className="rounded-full object-cover" 
                      sizes="48px" 
                    />
                  ) : (
                    <Image 
                      src={makeInitialsAvatar(auth.user ? `${auth.user.firstName || ''} ${auth.user.lastName || ''}`.trim() : 'Guest')} 
                      alt={(auth.user?.firstName || auth.user?.username || 'Guest') as string} 
                      fill 
                      className="rounded-full object-cover" 
                      sizes="48px" 
                    />
                  )}
                </div>
                {/* <div>
                  <div className="font-medium">
                    {(auth.user ? `${auth.user.firstName || ''} ${auth.user.lastName || ''}`.trim() || auth.user.username : 'Guest')}
                  </div>
                  <div className="text-sm text-white/80">
                    Welcome!
                  </div>
                </div> */}
              </div>
            <button 
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'} 
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                setMobileOpen(!mobileOpen);
              }} 
              className="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
            >
              {!mobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link data-nav="products" href="/shop/products" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2 transition-colors">
              <BsBoxSeam className="text-lg" />
              {t('header.products')}
            </Link>
            <Link data-nav="carts" href="/shop/carts" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2 transition-colors relative">
              <BsCart2 className="text-lg" />
              {t('header.carts')}
              {cartCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-red-500 rounded-full min-w-[20px]">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <Link data-nav="checkouts" href="/shop/checkouts" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2 transition-colors">
              <AiOutlineCheckCircle className="text-lg" />
              {t('header.checkouts')}
            </Link>
            <Link data-nav="orders" href="/shop/orders" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2 transition-colors">
              <FaJediOrder className="text-lg" />
              Orders
            </Link>
            <Link data-nav="payments" href="/shop/payments" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2 transition-colors">
              <MdPayment className="text-lg" />
              {t('header.payments')}
            </Link>

            <div className="relative" ref={langRef}>
              <button 
                onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }} 
                className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
              >
                <HiOutlineGlobeAlt className="text-lg" />
                <span className="hidden sm:inline">{locale.toUpperCase()}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg text-gray-800 py-2 z-50">
                  {(['en','fr','es','rw'] as const).map(l => (
                    <button 
                      key={l} 
                      onClick={() => { setLocale(l); setLangOpen(false); }} 
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${locale===l? 'font-semibold' : ''}`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="ml-4 relative" ref={userMenuRef}>
              <button 
                onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }} 
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="relative h-10 w-10 bg-gray-200 rounded-full overflow-hidden border border-white/30">
                  {auth.user?.image ? (
                    <Image 
                      src={auth.user.image} 
                      alt={(auth.user.firstName || auth.user.username) as string} 
                      fill 
                      className="rounded-full object-cover" 
                      sizes="40px" 
                    />
                  ) : (
                    <Image 
                      src={makeInitialsAvatar(auth.user ? `${auth.user.firstName || ''} ${auth.user.lastName || ''}`.trim() : 'Guest')} 
                      alt={(auth.user?.firstName || auth.user?.username || 'Guest') as string} 
                      fill 
                      className="rounded-full object-cover" 
                      sizes="40px" 
                    />
                  )}
                </div>
                <span className="text-white font-medium text-base">
                  {(auth.user ? `${auth.user.firstName || ''} ${auth.user.lastName || ''}`.trim() || auth.user.username : 'Guest')}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow-lg text-gray-800 py-2 z-50">
                  <Link 
                    data-nav="profile"
                    href="/shop/profile" 
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <BiUser className="text-lg" />
                    <span>My profile</span>
                  </Link>
                  <Link 
                    data-nav="settings"
                    href="/shop/settings" 
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FiSettings className="text-lg" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      auth.logout();
                      setUserMenuOpen(false);
                      router.push('/login');
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <FiLogOut className="text-lg" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile menu (side drawer from left) */}
        <div 
          ref={mobileMenuRef}
          className={`md:hidden absolute w-fit min-h-screen inset-0 z-50 transition-transform duration-300 ease-in-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              mobileOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setMobileOpen(false)}
          />
          
          {/* Side drawer */}
          <div className="relative w-80 max-w-full h-full bg-white shadow-xl overflow-y-auto">
            {/* Header section */}
            <div className="bg-[#634bc1] p-4 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10">
                    <Image src="/logo.jpg" alt="ShopEasy Logo" fill className="rounded-full border-2 border-white/30 object-cover" sizes="40px" />
                  </div>
                  <span className="text-white font-bold text-lg">
                    Shop<span className="text-[#ffdc89]">Easy</span>
                  </span>
                </div>
              </div>
              
              {/* User info */}

            </div>

            {/* Navigation links */}
            <div className="flex flex-col divide-y divide-gray-100">
              <Link 
                data-nav="products"
                href="/shop/products" 
                className="px-4 py-4 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                onClick={handleMobileLinkClick}
              >
                <BsBoxSeam className="text-lg text-gray-700" />
                <span className="font-medium">{t('header.products')}</span>
              </Link>
              
              <Link 
                data-nav="carts"
                href="/shop/carts" 
                className="px-4 py-4 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                onClick={handleMobileLinkClick}
              >
                <BsCart2 className="text-lg text-gray-700" />
                <span className="font-medium">{t('header.carts')}</span>
                {cartCount > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-red-500 rounded-full min-w-[20px]">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              
              <Link 
                data-nav="checkouts"
                href="/shop/checkouts" 
                className="px-4 py-4 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                onClick={handleMobileLinkClick}
              >
                <AiOutlineCheckCircle className="text-lg text-gray-700" />
                <span className="font-medium">{t('header.checkouts')}</span>
              </Link>
              <Link 
                data-nav="orders"
                href="/shop/orders" 
                className="px-4 py-4 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                onClick={handleMobileLinkClick}
              >
                <FaJediOrder className="text-lg text-gray-700" />
                <span className="font-medium">Orders</span>
              </Link>
              <Link 
                data-nav="payments"
                href="/shop/payments" 
                className="px-4 py-4 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                onClick={handleMobileLinkClick}
              >
                <MdPayment className="text-lg text-gray-700" />
                <span className="font-medium">{t('header.payments')}</span>
              </Link>
              
              <Link 
                data-nav="profile"
                href="/shop/profile" 
                className="px-4 py-4 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                onClick={handleMobileLinkClick}
              >
                <BiUser className="text-lg text-gray-700" />
                <span className="font-medium">My Profile</span>
              </Link>
              
              <Link 
                data-nav="settings"
                href="/shop/settings" 
                className="px-4 py-4 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                onClick={handleMobileLinkClick}
              >
                <FiSettings className="text-lg text-gray-700" />
                <span className="font-medium">Settings</span>
              </Link>
              
              <div className="px-4 py-4">
                <div className="text-sm font-medium text-gray-600 mb-2">Language</div>
                <div className="flex gap-2 flex-wrap">
                  {(['en','fr','es','rw'] as const).map(l => (
                    <button 
                      key={l} 
                      onClick={() => { setLocale(l); setMobileOpen(false); }} 
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        locale === l ? 'bg-[#634bc1] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => {
                  auth.logout();
                  setMobileOpen(false);
                  router.push('/login');
                }}
                className="px-4 py-4 hover:bg-gray-50 flex items-center gap-3 transition-colors text-left border-t border-gray-200 mt-2"
              >
                <FiLogOut className="text-lg text-gray-700" />
                <span className="font-medium text-red-600">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}