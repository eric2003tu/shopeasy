"use client";

import React from 'react';
import PaymentsTable from '@/components/admin/PaymentsTable';
import { useI18n } from '@/i18n/I18nProvider';

export default function AdminPaymentsPage() {
  const { t } = useI18n();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-600">{t('admin.payment') || 'Payments'}</h1>
      <p className="text-sm text-muted-foreground mt-1">{t('admin.paymentSub') || 'View and manage payment records'}</p>
      <div className="mt-4">
        <PaymentsTable />
      </div>
    </div>
  );
}
