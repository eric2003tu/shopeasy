"use client";
import React from 'react';
import { sampleUsers } from '@/lib/sampleData';

export default function UsersTable() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
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
            {sampleUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{u.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{u.organisation}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={() => console.log('edit-user', u.id)} className="px-3 py-1 bg-[#634bc1] text-white rounded hover:opacity-90 text-sm">Edit</button>
                    <button onClick={() => console.log('delete-user', u.id)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 text-sm">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
