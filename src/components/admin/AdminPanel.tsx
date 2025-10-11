"use client";
import React from 'react';
import ProductsAdmin from './ProductsAdmin';

interface Props {
  section: 'products' | 'orders' | 'users'
  setSection: (s: 'products' | 'orders' | 'users') => void
}

const AdminPanel: React.FC<Props> = ({ section, setSection }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={() => setSection('products')} className={`px-3 py-1 rounded ${section === 'products' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Products</button>
          <button onClick={() => setSection('orders')} className={`px-3 py-1 rounded ${section === 'orders' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Orders</button>
          <button onClick={() => setSection('users')} className={`px-3 py-1 rounded ${section === 'users' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Users</button>
        </div>
      </div>

      <div>
        {section === 'products' && <ProductsAdmin />}
        {section === 'orders' && <div className="p-6 text-gray-600">Orders management coming soon.</div>}
        {section === 'users' && <div className="p-6 text-gray-600">User management coming soon.</div>}
      </div>
    </div>
  );
};

export default AdminPanel;
