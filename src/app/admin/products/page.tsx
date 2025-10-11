"use client";
import React from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import ProductsAdmin from '@/components/admin/ProductsAdmin';

export default function ProductsPage() {
  const { t } = useI18n();
  return (
    <div>
      <h2 className="text-xl font-semibold">{t('admin.products')}</h2>
      <ProductsAdmin />
    </div>
  );
}
