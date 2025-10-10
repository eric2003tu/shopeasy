"use client";
import React, { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { IoMdSearch } from 'react-icons/io';

const Footer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const { t } = useI18n();

  return (
    <footer className="w-full bg-[#433d61] text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">

        {/* Search */}

        {/* Shop */}
        <div>
          <h3 className="text-sm sm:text-lg font-semibold mb-3">{t('footer.shop')}</h3>
          <ul className="space-y-2 text-sm sm:text-base">
            {[
              'footer.shopLinks.allProducts',
              'footer.shopLinks.electronics',
              'footer.shopLinks.clothing',
              'footer.shopLinks.accessories',
              'footer.shopLinks.homeLiving'
            ].map(key => (
              <li key={key} className="cursor-pointer hover:text-[#ffdc89] hover:underline">
                {t(key)}
              </li>
            ))}
          </ul>
          <div className="w-full">
          <h1 className="text-gray-100 text-sm sm:text-md text-start mt-2 mb-2">{t('footer.findYourProduct')}</h1>
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              type="text"
              placeholder={t('header.searchPlaceholder') || 'Find products...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-l text-gray-100 focus:outline-none border border-white"
            />
            <button
              type="submit"
              className="bg-[#ffdc89] text-[#634bc1] px-3 py-2 rounded-r hover:bg-[#e6c97d] transition"
            >
              <IoMdSearch size={20} />
            </button>
          </form>
        </div>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-sm sm:text-lg font-semibold mb-3">{t('footer.customerService')}</h3>
          <ul className="space-y-2 text-sm sm:text-base">
            {[
              'footer.customerLinks.contact',
              'footer.customerLinks.shipping',
              'footer.customerLinks.faqs',
              'footer.customerLinks.privacy',
              'footer.customerLinks.terms'
            ].map(key => (
              <li key={key} className="cursor-pointer hover:text-[#ffdc89] hover:underline">
                {t(key)}
              </li>
            ))}
          </ul>
          
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm sm:text-lg font-semibold mb-3">{t('footer.stayConnected')}</h3>
          <p className="mb-4 text-sm sm:text-base">{t('footer.subscribeDescription')}</p>
          <input
            type="email"
            placeholder={t('footer.newsletterPlaceholder')}
            className="w-full px-3 py-2 rounded text-gray-100 mb-2 focus:outline-none border border-white"
          />
          <button className="w-full bg-[#ffdc89] text-[#634bc1] px-3 py-2 rounded font-medium hover:bg-[#e6c97d] transition">
            {t('footer.subscribe')}
          </button>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#ffdc89] text-center text-xs sm:text-sm">
        <p>{t('footer.copyright')}</p>
        <div className="flex justify-center gap-3 sm:gap-4 mt-2 flex-wrap">
          {['footer.bottom.privacy', 'footer.bottom.terms', 'footer.bottom.sitemap'].map(key => (
            <span key={key} className="cursor-pointer text-[#ffdc89] hover:underline">
              {t(key)}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;