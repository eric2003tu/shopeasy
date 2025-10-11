"use client";
import React from 'react';
import { useI18n } from '@/i18n/I18nProvider';

export default function SettingsPage() {
  const { t } = useI18n();
  return (
    <div>
      <h2 className="text-xl font-semibold">{t('admin.settings')}</h2>
      <p className="text-sm text-gray-600 mt-2">{t('admin.settingsSub') || 'Application and appearance settings'}</p>
    </div>
  );
}
