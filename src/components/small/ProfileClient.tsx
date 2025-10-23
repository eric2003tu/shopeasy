"use client";
import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthProvider';
import { FullUser } from '@/lib/appClient';
import UserCarts from './UserCarts';

type EditFields = Pick<FullUser, 'firstName' | 'lastName' | 'email' | 'phone' | 'address'>;

export default function ProfileClient() {
  const { user, updateUser } = useAuth();
  const full = user as FullUser | null;
  const [editing, setEditing] = useState(false);
  const initial = useMemo<EditFields>(() => ({
    firstName: full?.firstName || '',
    lastName: full?.lastName || '',
    email: full?.email || '',
    phone: full?.phone || '',
    address: full?.address || undefined,
  }), [full]);

  const [form, setForm] = useState<EditFields>(initial);

  if (!full) return <div className="p-8">No user data</div>;

  const onSave = () => {
    updateUser(form as Partial<FullUser>);
    setEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
          <div className="flex flex-col items-center sm:items-start sm:col-span-1">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 relative">
              <Image src={full.image || '/logo.jpg'} alt={`${full.firstName || full.username} avatar`} fill className="object-cover" sizes="128px" />
            </div>
            <div className="mt-4 text-center sm:text-left">
              <h3 className="text-xl font-semibold">{(full.firstName || '') + ' ' + (full.lastName || '')}</h3>
              <div className="text-sm text-gray-500">@{full.username}</div>
            </div>
            <div className="mt-4 flex gap-2">
              {!editing ? (
                <button className="btn-primary px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => { setForm(initial); setEditing(true); }}>Edit profile</button>
              ) : (
                <>
                  <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={onSave}>Save</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded" onClick={() => { setEditing(false); setForm(initial); }}>Cancel</button>
                </>
              )}
            </div>
              <UserCarts />
          </div>

          <div className="sm:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded">
                <h4 className="font-semibold mb-2">Contact</h4>
                {!editing ? (
                  <div className="space-y-1 text-sm text-gray-700">
                    <div>Email: {full.email}</div>
                    <div>Phone: {full.phone || '—'}</div>
                    <div>University: {full.university || '—'}</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-sm">First name
                      <input value={form.firstName || ''} onChange={e => setForm({ ...form, firstName: e.target.value })} className="mt-1 w-full border rounded px-2 py-1" /></label>
                    <label className="block text-sm">Last name
                      <input value={form.lastName || ''} onChange={e => setForm({ ...form, lastName: e.target.value })} className="mt-1 w-full border rounded px-2 py-1" /></label>
                    <label className="block text-sm">Email
                      <input value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1 w-full border rounded px-2 py-1" /></label>
                    <label className="block text-sm">Phone
                      <input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full border rounded px-2 py-1" /></label>
                  </div>
                )}
              </div>

              <div className="p-4 border rounded">
                <h4 className="font-semibold mb-2">Location</h4>
                {!editing ? (
                  <div className="text-sm text-gray-700">
                    <div>{full.address?.address || '—'}</div>
                    <div>{full.address?.city || '—'}, {full.address?.state || '—'}</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-sm">Address
                      <input value={form.address?.address || ''} onChange={e => setForm({ ...form, address: { ...(form.address || {}), address: e.target.value } })} className="mt-1 w-full border rounded px-2 py-1" /></label>
                    <label className="block text-sm">City
                      <input value={form.address?.city || ''} onChange={e => setForm({ ...form, address: { ...(form.address || {}), city: e.target.value } })} className="mt-1 w-full border rounded px-2 py-1" /></label>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded text-sm">
                <div className="text-xs text-gray-500">Role</div>
                <div className="font-medium">{full.role || '—'}</div>
              </div>
              <div className="p-4 border rounded text-sm">
                <div className="text-xs text-gray-500">Birth date</div>
                <div className="font-medium">{full.birthDate || '—'}</div>
              </div>
              <div className="p-4 border rounded text-sm">
                <div className="text-xs text-gray-500">Gender</div>
                <div className="font-medium">{full.gender || '—'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

