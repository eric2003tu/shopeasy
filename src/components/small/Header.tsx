"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CiMenuBurger} from "react-icons/ci";
import { BsBoxSeam } from "react-icons/bs";
import { MdLogin } from "react-icons/md";
import { HiOutlineGlobeAlt } from 'react-icons/hi';
import { useI18n } from '@/i18n/I18nProvider';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';


const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, locale, setLocale } = useI18n();
  const auth = useAuth();
  const langRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  // Close mobile menu when route changes
//   useEffect(() => {
//     setMenuOpen(false);
//   }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#634bc1] shadow-md' : 'bg-[#634bc1]/90 backdrop-blur-sm'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">
        <div className="flex items-center justify-between ">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-12 w-12 md:h-12 md:w-12">
                <Image src="/logo.jpg" alt="ShopEasy Logo" fill className="rounded-full border-2 border-white/30 group-hover:border-[#ffdc89] transition-all object-cover" sizes="48px" />
              </div>
              <span className="text-white font-bold text-xl md:text-2xl ml-2">
                Shop<span className="text-[#ffdc89]">Easy</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <Link 
              href="/products" 
              className="px-3 py-2 rounded-md text-sm lg:text-base font-medium text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
            >
              <BsBoxSeam className="text-lg" />
              {t('header.products')}
            </Link>
            {/* <Link 
              href="/cart" 
              className="px-3 py-2 rounded-md text-sm lg:text-base font-medium text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
            >
              <BsCart2 className="text-lg" />
              {t('header.cart')}
            </Link> */}
            {auth.user ? (
              <Link href="/profile" className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-white/10">
                <div className="h-8 w-8 relative rounded-full overflow-hidden bg-gray-100">
                  <Image src={auth.user.image || '/avatar-placeholder.png'} alt={auth.user.firstName + ' ' + auth.user.lastName} fill className="object-cover" sizes="32px" />
                </div>
                <span className="text-white">{(auth.user.firstName || '') + ' ' + (auth.user.lastName || auth.user.username || '')}</span>
              </Link>
            ) : (
              <Link 
                data-nav="login"
                href="/login" 
                className="px-3 py-2 rounded-md text-sm lg:text-base font-medium text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
              >
                <MdLogin className="text-lg" />
                {t('header.login')}
              </Link>
            )}
            {/* Language selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}
                className="px-3 py-2 rounded-md text-sm lg:text-base font-medium text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
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
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <CiMenuBurger className="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${menuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#634bc1] shadow-xl rounded-b-lg">
          <Link
            href="/products"
            className="flex items-center gap-3 text-white hover:bg-white/10 block px-3 py-3 rounded-md text-base font-medium transition-colors"
          >
            <BsBoxSeam />
            {t('header.products')}
          </Link>
          {/* <Link
            href="/cart"
            className="flex items-center gap-3 text-white hover:bg-white/10 block px-3 py-3 rounded-md text-base font-medium transition-colors"
          >
            <BsCart2 />
            {t('header.cart')}
          </Link> */}
          <Link
            data-nav="login"
            href="/login"
            className="flex items-center gap-3 text-white hover:bg-white/10 block px-3 py-3 rounded-md text-base font-medium transition-colors"
          >
            <MdLogin />
            {t('header.login')}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
