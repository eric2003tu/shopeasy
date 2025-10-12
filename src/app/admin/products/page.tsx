"use client";

import React from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import ProductsTable from '@/components/admin/ProductsTable';

export default function ProductsPage() {
  const { t } = useI18n();
  return (
    <div>
      <h2 className="text-xl font-semibold">{t('admin.products')}</h2>
      <div className="mt-4">
        <ProductsTable />
      </div>
    </div>
  );
}
