"use client";
import React from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import ProductsAdmin from './ProductsAdmin';

interface Props {
  section: 'products' | 'orders' | 'users'
  setSection: (s: 'products' | 'orders' | 'users') => void
}

const AdminPanel: React.FC<Props> = ({ section, setSection }) => {
  const { t } = useI18n();

  return (
  <div className="bg-card rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('admin.title')}</h1>
        <div className="flex gap-2">
          <button onClick={() => setSection('products')} className={`px-3 py-1 rounded ${section === 'products' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{t('admin.buttons.products')}</button>
          <button onClick={() => setSection('orders')} className={`px-3 py-1 rounded ${section === 'orders' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{t('admin.buttons.orders')}</button>
          <button onClick={() => setSection('users')} className={`px-3 py-1 rounded ${section === 'users' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{t('admin.buttons.users')}</button>
        </div>
      </div>

      <div>
        {section === 'products' && <ProductsAdmin />}
  {section === 'orders' && <div className="p-6 text-muted-foreground">{t('admin.analyticsSub')}</div>}
  {section === 'users' && <div className="p-6 text-muted-foreground">{t('admin.usersSub')}</div>}
      </div>
    </div>
  );
};

export default AdminPanel;
