"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Profile = {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  avatar: string;
  bio?: string;
  updatedAt?: string;
};

const STORAGE_KEY = 'shopeasy:profile';

function dataUrlFromFile(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const { t } = useI18n();

  const [profile, setProfile] = useState<Profile>({ name: '', email: '', phone: '', role: 'Administrator', avatar: '/avatar.png', bio: '', updatedAt: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const initials = useMemo(() => {
    const parts = (profile.name || '').trim().split(/\s+/).filter(Boolean);
    return (parts[0]?.[0] || 'A') + (parts[1]?.[0] || 'U');
  }, [profile.name]);

  function validate(p: Profile) {
    if (!p.name.trim()) return 'Name is required';
    if (!p.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) return 'Valid email required';
    return null;
  }

  async function onSave() {
    setError(null);
    const v = validate(profile);
    if (v) {
      setError(v);
      return;
    }
    setSaving(true);
    try {
      const next = { ...profile, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setProfile(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function onReset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setProfile({ name: '', email: '', phone: '', role: 'Administrator', avatar: '/avatar.png', bio: '', updatedAt: '' });
    } catch {}
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await dataUrlFromFile(f);
      setProfile({ ...profile, avatar: url });
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-600">{t('admin.profile')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('admin.profileSub') || 'Manage your account and profile details'}</p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: profile card */}
        <div className="col-span-1 bg-white p-6 rounded-lg text-gray-900 shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-muted flex items-center justify-center bg-gray-500 text-2xl font-bold text-white mb-4">
              {profile.avatar && profile.avatar.startsWith('data:') ? (
                // preview uploaded dataURL
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar} alt={profile.name || 'avatar'} className="w-full h-full object-cover" />
              ) : (
                // use static path or initials
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar || '/avatar.png'} alt={profile.name || 'avatar'} className="w-full h-full object-cover" />
              )}
            </div>

            <div className="text-lg font-medium">{profile.name || 'Admin User'}</div>
            <div className="text-sm text-muted-foreground">{profile.role || 'Administrator'}</div>

            <div className="mt-4 w-full text-left text-sm">
              <div className="text-muted-foreground">Email</div>
              <div className="font-medium">{profile.email || 'not set'}</div>
            </div>

            <div className="mt-3 w-full text-left text-sm">
              <div className="text-muted-foreground">Phone</div>
              <div className="font-medium">{profile.phone || 'not set'}</div>
            </div>

            <div className="mt-6 w-full">
              <label className="block text-sm text-muted-foreground mb-1">Upload avatar</label>
              <input type="file" accept="image/*" onChange={onFile} />
            </div>
          </div>
        </div>

        {/* Right column: form */}
        <div className="col-span-2 bg-card p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm block mb-1">Name</label>
              <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm block mb-1">Email</label>
              <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </div>
            <div>
              <label className="text-sm block mb-1">Phone</label>
              <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div>
              <label className="text-sm block mb-1">Role</label>
              <Input value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm block mb-1">Bio</label>
              <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="w-full min-h-[120px] rounded-md border bg-transparent px-3 py-2 text-sm" />
            </div>
          </div>

          {error && <p className="text-sm text-destructive mt-3">{error}</p>}

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              {profile.updatedAt ? `Last saved: ${new Date(profile.updatedAt).toLocaleString()}` : 'Not saved yet'}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onReset}>Reset</Button>
              <Button onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
            </div>
          </div>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">Saved</div>
      )}
    </div>
  );
}
