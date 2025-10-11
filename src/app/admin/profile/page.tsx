"use client";

import React from 'react';
import { useI18n } from '@/i18n/I18nProvider';

export default function ProfilePage() {
  const { t } = useI18n();
  return (
    <div>
      <h2 className="text-xl font-semibold">{t('admin.profile')}</h2>
      <p className="text-sm text-gray-600 mt-2">{t('admin.profileSub') || 'Your account and preferences'}</p>
    </div>
  );
}
