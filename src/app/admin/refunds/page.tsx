"use client";

import React from 'react';
import RefundsTable from '@/components/admin/RefundsTable';
import { useI18n } from '@/i18n/I18nProvider';

export default function RefundsPage() {
  const { t } = useI18n();
  return (
    <div>
      <h2 className="text-xl font-semibold">{t ? t('admin.refunds') : 'Refunds'}</h2>
      <p className="text-sm text-gray-600 mt-2">{t ? t('admin.refundsSub') : 'Manage refund requests and their statuses'}</p>
      <div className="mt-4">
        <RefundsTable />
      </div>
    </div>
  );
}
 