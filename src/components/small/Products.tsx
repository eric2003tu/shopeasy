"use client";

import React from 'react'
import UploadedProducts from './UplaodedProducts';
import { useI18n } from '@/i18n/I18nProvider';
import HeroSlideshow from '@/components/ui/HeroSlideshow';


const Products :React.FC = () => {
  
  const { t } = useI18n();

  return (
    <div className=' grid grid-cols-1 min-h-screen bg-white w-full text-center gap-6'>
      <HeroSlideshow delay={5000} className="bg-gradient-to-r from-[#332e47] to-[#1d163c]" />
      <h1 className='text-[#634bc1] text-3xl font-bold'>
        {t('home.startYourPurchase')}
      </h1>
      <UploadedProducts />
    </div>
  )
}

export default Products