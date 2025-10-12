"use client";
import React, { useEffect, useState } from 'react';
import { sampleUsers, SampleUser, organizations } from '@/lib/sampleData';
import * as Dialog from '@radix-ui/react-dialog';

const STORAGE_KEY = 'shopeasy_admin_users_v1';

function UserForm({ initial, onSave, onCancel }: { initial?: Partial<SampleUser>; onSave: (u: SampleUser) => void; onCancel: () => void }) {
  const [name, setName] = useState(initial?.name || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [role, setRole] = useState<SampleUser['role']>(initial?.role || 'user');
  const [org, setOrg] = useState(initial?.organisation || organizations[0]);

  return (
    <div className="p-2">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-sm mb-1 block">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm mb-1 block">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm mb-1 block">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as SampleUser['role'])} className="w-full p-2 border rounded">
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
        </div>
        <div>
          <label className="text-sm mb-1 block">Organisation</label>
          <select value={org} onChange={(e) => setOrg(e.target.value)} className="w-full p-2 border rounded">
            {organizations.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => onSave({ id: initial?.id || `${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`, name, email, role, organisation: org })} className="px-3 py-1 bg-primary text-primary-foreground rounded">Save</button>
        <button onClick={onCancel} className="px-3 py-1 bg-muted rounded">Cancel</button>
      </div>
    </div>
  );
}

function DeleteDialogUser({ open, onOpenChange, target, value, setValue, onConfirm }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  target: SampleUser | null;
  value: string;
  setValue: (v: string) => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative z-60 w-full max-w-md bg-white rounded shadow-lg p-6">
        <h3 className="text-lg font-semibold">Confirm deletion</h3>
        <p className="text-sm text-gray-600 mt-2">Type <strong className="font-medium">{target?.name}</strong> below to confirm deletion. This action cannot be undone.</p>
        <input className="w-full mt-4 p-2 border rounded" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type user name to confirm" />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => onOpenChange(false)} className="px-3 py-1 bg-muted rounded">Cancel</button>
          <button disabled={target ? value.trim().toLowerCase() !== target.name.trim().toLowerCase() : true} onClick={onConfirm} className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function UsersTable() {
  const [users, setUsers] = useState<SampleUser[]>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) return JSON.parse(raw) as SampleUser[];
    } catch (e) {}
    return sampleUsers;
  });

  const [editing, setEditing] = useState<SampleUser | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SampleUser | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (e) {}
  }, [users]);

  const handleSave = (u: SampleUser) => {
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
        <div />
        <div className="flex items-center gap-2">
          <Dialog.Root open={sheetOpen} onOpenChange={setSheetOpen}>
            <Dialog.Trigger asChild>
              <button className="px-3 py-1 bg-[#634bc1] text-white rounded hover:opacity-95 text-sm">Add user</button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black/40" />
                <Dialog.Content className="w-full max-w-lg bg-card rounded shadow-lg z-50">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{editing ? 'Edit user' : 'Add user'}</h3>
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{u.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{u.organisation}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={() => handleEdit(u.id)} className="px-3 py-1 bg-[#634bc1] text-white rounded hover:opacity-90 text-sm">Edit</button>
                    <button onClick={() => handleDelete(u.id)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 text-sm">Delete</button>
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
