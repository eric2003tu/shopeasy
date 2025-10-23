/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useMemo } from 'react';
import VoiceSearchBar from './VoiceSearchBar';
import Image from 'next/image';
// fetch users from dummyjson instead of relying on sampleData
import * as Dialog from '@radix-ui/react-dialog';
import { useToast } from '@/context/ToastProvider';
import { useI18n } from '@/i18n/I18nProvider';


type AdminUser = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email: string;
  role: string;
  organisation?: string;
  companyTitle?: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  age?: number;
  image?: string;
};

const defaultOrganizations = ['Engineering','Sales','Support','Marketing'];

function isValidImageSrc(v?: string) {
  if (!v) return false;
  // absolute http(s) URLs or leading-slash relative paths are valid for next/image
  try {
    if (v.startsWith('/')) return true;
    const url = new URL(v);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function UserForm({ initial, onSave, onCancel }: { initial?: Partial<AdminUser>; onSave: (u: AdminUser) => void; onCancel: () => void }) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState(initial?.firstName || '');
  const [lastName, setLastName] = useState(initial?.lastName || '');
  const [username, setUsername] = useState(initial?.username || '');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(initial?.email || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [age, setAge] = useState<number | undefined>(initial?.age);
  const [city, setCity] = useState(initial?.city || '');
  const [stateVal, setStateVal] = useState(initial?.state || '');
  const [country, setCountry] = useState(initial?.country || '');
  const [company, setCompany] = useState(initial?.organisation || '');
  const [companyTitle, setCompanyTitle] = useState(initial?.companyTitle || '');
  const [image, setImage] = useState(initial?.image || '');
  const [role, setRole] = useState<string>(initial?.role || 'user');
  const [org, setOrg] = useState(initial?.organisation || defaultOrganizations[0]);
  const [saving, setSaving] = useState(false);

  return (
    <div className="p-2">
      <div className="grid grid-cols-1 gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm mb-1 block">First name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="text-sm mb-1 block">Last name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-2 border rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm mb-1 block">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="text-sm mb-1 block">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full p-2 border rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm mb-1 block">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="text-sm mb-1 block">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm mb-1 block">Age</label>
            <input value={age ?? ''} onChange={(e) => setAge(e.target.value ? Number(e.target.value) : undefined)} type="number" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="text-sm mb-1 block">City</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="text-sm mb-1 block">State</label>
            <input value={stateVal} onChange={(e) => setStateVal(e.target.value)} className="w-full p-2 border rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm mb-1 block">Country</label>
            <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="text-sm mb-1 block">Image URL</label>
            <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-2 border rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm mb-1 block">Company</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="text-sm mb-1 block">Company Title</label>
            <input value={companyTitle} onChange={(e) => setCompanyTitle(e.target.value)} className="w-full p-2 border rounded" />
          </div>
        </div>
        <div>
          <label className="text-sm mb-1 block">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded">
            <option value="admin">{t('admin.roles.admin')}</option>
            <option value="manager">{t('admin.roles.manager')}</option>
            <option value="user">{t('admin.roles.user')}</option>
          </select>
        </div>
        <div>
          <label className="text-sm mb-1 block">Organisation</label>
          <select value={org} onChange={(e) => setOrg(e.target.value)} className="w-full p-2 border rounded">
            {defaultOrganizations.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={async () => {
          // assemble payload
          const payload = {
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            username: username || undefined,
            password: password || undefined,
            age: age || undefined,
            email: email || undefined,
            phone: phone || undefined,
            image: image || undefined,
            address: { city, state: stateVal, country },
            company: { name: company, title: companyTitle },
            role,
          };
          setSaving(true);
          try {
            const res = await fetch('https://dummyjson.com/users/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Failed to create user');
            const data = await res.json();
            // map returned user to AdminUser
            const newUser: AdminUser = {
              id: String(data.id || `${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`),
              name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.username || username || 'New User',
              firstName: data.firstName,
              lastName: data.lastName,
              username: data.username,
              email: data.email || email || '',
              role: data.role || role,
              organisation: data.company?.name || company,
              companyTitle: data.company?.title || companyTitle,
              phone: data.phone || phone,
              city: data.address?.city || city,
              state: data.address?.state || stateVal,
              country: data.address?.country || country,
              age: data.age || age,
              image: data.image || image,
            };
            onSave(newUser);
            toast({ type: 'success', title: 'User created', description: 'User created via dummyjson' });
          } catch (e) {
            console.debug('create user failed, falling back to local save', e);
            // fallback: local save
            const fallback: AdminUser = { id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`, name: `${firstName} ${lastName}`.trim() || username || 'New User', firstName, lastName, username, email, role, organisation: company, companyTitle, phone, city, state: stateVal, country, age, image };
            onSave(fallback);
            toast({ type: 'warning', title: 'Offline save', description: 'User saved locally' });
          } finally {
            setSaving(false);
          }
        }} className="px-3 py-1 bg-primary text-primary-foreground rounded">{saving ? 'Saving...' : t('admin.buttons.save')}</button>
        <button onClick={onCancel} className="px-3 py-1 bg-muted rounded">{t('admin.buttons.cancel')}</button>
      </div>
    </div>
  );
}

function DeleteDialogUser({ open, onOpenChange, target, value, setValue, onConfirm }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  target: AdminUser | null;
  value: string;
  setValue: (v: string) => void;
  onConfirm: () => void;
}) {
  const { t } = useI18n();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
    <div className="relative z-60 w-full max-w-md bg-white rounded shadow-lg p-6">
  <h3 className="text-lg font-semibold">{t('admin.deleteDialog.title')}</h3>
  <p className="text-sm text-gray-600 mt-2">{t('admin.deleteDialog.body', { target: target?.name ?? '' })}</p>
  <input className="w-full mt-4 p-2 border rounded" value={value} onChange={(e) => setValue(e.target.value)} placeholder={t('admin.placeholders.typeUserConfirm')} />
        <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => onOpenChange(false)} className="px-3 py-1 bg-muted rounded">{t('admin.deleteDialog.cancel')}</button>
            <button disabled={target ? value.trim().toLowerCase() !== target.name.trim().toLowerCase() : true} onClick={onConfirm} className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50">{t('admin.deleteDialog.confirm')}</button>
        </div>
      </div>
    </div>
  );
}

export default function UsersTable() {
  const { t } = useI18n();
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('https://dummyjson.com/users?limit=1000');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        const list = Array.isArray(data?.users) ? data.users : [];
        // map fields to admin shape
        const mapped = list.map((u: { [key: string]: any }) => ({
          id: String(u.id),
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username || `user_${u.id}`,
          firstName: u.firstName,
          lastName: u.lastName,
          username: u.username,
          email: u.email || '',
          role: (u.role as string) || (u.company?.department ? 'manager' : 'user'),
          organisation: u.company?.name || '',
          companyTitle: u.company?.title || '',
          phone: u.phone || '',
          city: u.address?.city || '',
          state: u.address?.state || '',
          country: u.address?.country || '',
          age: u.age || undefined,
          image: u.image || u.avatar || '',
        }));
        if (mounted) setUsers(mapped);
      } catch (e) {
        console.debug('Failed to load users from dummyjson, falling back to localStorage', e);
      }
    };
    // if we already have cached users skip network fetch briefly
    if (users.length === 0) load();
    return () => { mounted = false; };
  }, [users.length]);

  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
  // filters & pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [orgFilter, setOrgFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // no localStorage persistence for users; admin users are sourced from dummyjson

  const orgs = useMemo(() => Array.from(new Set(users.map((u) => u.organisation || '').filter(Boolean))), [users]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return users.filter((u) => {
      if (term) {
        if (!(`${u.name} ${u.email}`.toLowerCase().includes(term))) return false;
      }
      if (roleFilter && u.role !== roleFilter) return false;
      if (orgFilter && u.organisation !== orgFilter) return false;
      return true;
    });
  }, [users, searchTerm, roleFilter, orgFilter]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSave = (u: AdminUser) => {
    if (editing) {
      setUsers((prev) => prev.map((x) => (x.id === u.id ? u : x)));
    } else {
      setUsers((prev) => [u, ...prev]);
    }
    setEditing(null);
    setSheetOpen(false);
  };

  const handleEdit = (id: string) => {
    const u = users.find((x) => x.id === id);
    if (!u) return;
    setEditing(u);
    setSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    const u = users.find((x) => x.id === id);
    if (!u) return;
    setDeleteTarget(u);
    setDeleteConfirmInput('');
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteConfirmInput.trim().toLowerCase() !== (deleteTarget.name || '').trim().toLowerCase()) return;
    setUsers((prev) => prev.filter((x) => x.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeleteOpen(false);
    setDeleteConfirmInput('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <VoiceSearchBar
            value={searchTerm}
            onChange={(v) => { setSearchTerm(v); setPage(1); }}
            placeholder={t('admin.placeholders.searchUsers')}
          />
          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className="p-2 border rounded">
            <option value="">{t('admin.labels.allRoles')}</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          <select value={orgFilter} onChange={(e) => { setOrgFilter(e.target.value); setPage(1); }} className="p-2 border rounded">
            <option value="">{t('admin.labels.allOrganisations')}</option>
            {orgs.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Dialog.Root open={sheetOpen} onOpenChange={setSheetOpen}>
              <Dialog.Trigger asChild>
              <button className="px-3 py-1 bg-[#634bc1] text-white rounded hover:opacity-95 text-sm">{t('admin.buttons.addUser')}</button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black/40" />
                <Dialog.Content className="w-full max-w-lg bg-card rounded shadow-lg z-50">
                  <div className="p-4">
                    <Dialog.Title className="sr-only">{editing ? t('admin.buttons.editUser') : t('admin.buttons.addUser')}</Dialog.Title>
                    <h3 className="text-lg font-semibold mb-2">{editing ? t('admin.buttons.editUser') : t('admin.buttons.addUser')}</h3>
                    <UserForm initial={editing ?? undefined} onSave={handleSave} onCancel={() => { setEditing(null); setSheetOpen(false); }} />
                  </div>
                  <Dialog.Close asChild>
                    <button className="absolute top-3 right-3 text-gray-500">✕</button>
                  </Dialog.Close>
                </Dialog.Content>
              </div>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex items-center justify-between px-2 py-3">
          <div className="text-sm text-gray-600">Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> - <strong>{Math.min(currentPage * pageSize, total)}</strong> of <strong>{total}</strong></div>
          <div className="flex items-center gap-2">
            <div>
              <label className="text-xs">{t('admin.pagination.pageSize')}</label>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="ml-2 p-1 border rounded">
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div className="inline-flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2 py-1 border rounded">{t('admin.pagination.prev')}</button>
              <span className="px-2 text-sm">{currentPage} / {pageCount}</span>
              <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} className="px-2 py-1 border rounded">{t('admin.pagination.next')}</button>
            </div>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company / Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paged.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                      {isValidImageSrc(u.image) ? (
                        <Image src={u.image!} alt={u.name} fill className="object-cover" />
                      ) : (
                        <div className="h-10 w-10 flex items-center justify-center text-sm text-gray-700">{(u.name || 'U').split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{u.name}</div>
                      <div className="text-xs text-gray-500">@{u.username || ''}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{u.phone}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{u.age ?? '-'}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{[u.city, u.state, u.country].filter(Boolean).join(', ') || '-'}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{u.organisation} {u.companyTitle ? <span className="text-xs text-gray-500"> — {u.companyTitle}</span> : null}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{u.role}</td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={() => handleEdit(u.id)} className="px-3 py-1 bg-[#634bc1] text-white rounded hover:opacity-90 text-sm">{t('admin.buttons.editUser')}</button>
                    <button onClick={() => handleDelete(u.id)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 text-sm">{t('admin.buttons.delete')}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Delete confirmation dialog */}
      <DeleteDialogUser open={deleteOpen} onOpenChange={setDeleteOpen} target={deleteTarget} value={deleteConfirmInput} setValue={setDeleteConfirmInput} onConfirm={handleConfirmDelete} />
    </div>
  );
}
