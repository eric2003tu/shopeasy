"use client";
import React from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import VoiceSearchBar from '@/components/ui/VoiceSearchBar';

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
  const { t } = useI18n();

  const handleSearch = async (query: string) => {
    try {
      const results = await handleProductSearch(query);
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
      <VoiceSearchBar
        onSearch={handleSearch}
        placeholder={t('header.searchPlaceholder') || 'Find products...'}
      />
    </div>
  );
};

export default Search;