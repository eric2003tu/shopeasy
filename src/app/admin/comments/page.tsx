"use client";

import React from 'react';
import CommentsTable from '@/components/admin/CommentsTable';
import { useI18n } from '@/i18n/I18nProvider';

export default function CommentsPage() {
  const { t } = useI18n();
  return (
    <div>
      <h2 className="text-xl font-semibold">{t ? t('admin.comments') : 'Comments'}</h2>
      <p className="text-sm text-gray-600 mt-2">{t ? t('admin.commentsSub') : 'Manage product comments and moderation'}</p>
      <div className="mt-4">
        <CommentsTable />
      </div>
    </div>
  );
}
 
