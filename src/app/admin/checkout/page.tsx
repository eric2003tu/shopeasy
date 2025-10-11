"use client";

import React from 'react';
import { useI18n } from '@/i18n/I18nProvider';

export default function CheckoutPage() {
  const { t } = useI18n();
  return (
    <div>
      <h2 className="text-xl font-semibold">{t('admin.checkout')}</h2>
      <p className="text-sm text-gray-600 mt-2">{t('admin.checkoutSub') || 'Checkout flows and settings'}</p>
    </div>
  );
}
