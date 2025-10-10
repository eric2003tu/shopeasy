"use client";
import React, { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { IoMdSearch } from 'react-icons/io';

// Exportable search function
export const handleProductSearch = async (searchTerm: string) => {
  try {
    const isLocal = window.location.hostname === 'localhost';
    const apiUrl = isLocal
      ? `http://localhost:5000/api/v1/products/search?q=${searchTerm}`
      : `https://e-commerce-back-xy6s.onrender.com/api/v1/products/search?q=${searchTerm}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('Error searching data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to search products', error);
    throw error; // Re-throw the error if you want calling code to handle it
  }
};

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useI18n();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    
    try {
      const results = await handleProductSearch(searchQuery);
      console.log('Search results:', results);
      // Here you would typically update state with the search results
      // For example: setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className='w-full'>
      <h1 className="text-[#634bc1] text-md text-start mt-2">{t('footer.findYourProduct')}</h1>
      <form onSubmit={handleSearch} className="flex flex-row w-full">
        <input
          type="text"
          placeholder={t('header.searchPlaceholder') || 'Find products...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.trim())}
          className="w-full px-3 py-2 rounded-l text-gray-100 focus:outline-none border border-gray-500 "
        />
        <button
          type="submit"
          className="bg-[#ffdc89] text-[#634bc1] px-4 py-2 rounded-r cursor-pointer hover:bg-[#e6c97d] transition"
        >
          <IoMdSearch size={20} />
        </button>
      </form>
    </div>
  );
};

export default Search;