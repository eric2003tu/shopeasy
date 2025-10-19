"use client";

import React, { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

type Settings = {
  theme: 'system' | 'light' | 'dark';
  accent: string;
  notifications: boolean;
  currency: string;
};

const STORAGE_KEY = 'shopeasy:settings';

export default function SettingsPage() {
  const { t } = useI18n();

  const [settings, setSettings] = useState<Settings>({ theme: 'system', accent: '#7c3aed', notifications: true, currency: 'USD' });
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings(JSON.parse(raw));
    } catch {
    }
  }, []);

  function onSave() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setOpenConfirm(true);
    } catch {
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white">{t('admin.settings')}</h2>
        <p className="text-sm text-muted-foreground mt-2">{t('admin.settingsSub') || 'Application and appearance settings'}</p>
      </div>

      <div className="max-w-2xl bg-card p-6 rounded shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm block mb-1">{t('admin.settingsPage.fields.theme') || 'Theme'}</label>
            <select value={settings.theme} onChange={(e) => setSettings({ ...settings, theme: e.target.value as Settings['theme'] })} className="w-full rounded-md border bg-transparent px-3 py-2">
              <option value="system">{t('admin.settingsPage.theme.system') || 'System'}</option>
              <option value="light">{t('admin.settingsPage.theme.light') || 'Light'}</option>
              <option value="dark">{t('admin.settingsPage.theme.dark') || 'Dark'}</option>
            </select>
          </div>

          <div>
            <label className="text-sm block mb-1">{t('admin.settingsPage.fields.accent') || 'Accent color'}</label>
            <Input type="color" value={settings.accent} onChange={(e) => setSettings({ ...settings, accent: e.target.value })} />
          </div>

          <div>
            <label className="text-sm block mb-1">{t('admin.settingsPage.fields.notifications') || 'Notifications'}</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={settings.notifications} onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })} />
                <span className="text-sm">{t('admin.settingsPage.notifications.enable') || 'Enable notifications'}</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm block mb-1">{t('admin.settingsPage.fields.currency') || 'Default currency'}</label>
            <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="w-full rounded-md border bg-transparent px-3 py-2">
              <option value="USD">{t('admin.settingsPage.currency.USD') || 'USD'}</option>
              <option value="EUR">{t('admin.settingsPage.currency.EUR') || 'EUR'}</option>
              <option value="GBP">{t('admin.settingsPage.currency.GBP') || 'GBP'}</option>
              <option value="RWF">{t('admin.settingsPage.currency.RWF') || 'RWF'}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => { localStorage.removeItem(STORAGE_KEY); setSettings({ theme: 'system', accent: '#7c3aed', notifications: true, currency: 'USD' }); }}>{t('admin.buttons.clear') || 'Reset'}</Button>
          <Button onClick={onSave}>{t('admin.buttons.save') || 'Save'}</Button>
        </div>
      </div>

  <ConfirmDialog open={openConfirm} message={t('admin.settingsPage.saved') || 'Settings saved'} onConfirm={() => setOpenConfirm(false)} onCancel={() => setOpenConfirm(false)} />
    </div>
  );
}
