"use client";
import React from 'react';
import Image from 'next/image';
import { sampleProducts } from '@/lib/sampleData';

export default function ProductsTable() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sampleProducts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4">
                  <div className="h-12 w-12 relative rounded overflow-hidden bg-gray-100">
                    <Image src={p.images[0] || '/placeholder-product.jpg'} alt={p.name} fill className="object-contain" sizes="48px" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">${p.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{p.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {p.completed ? <span className="text-green-600">Completed</span> : p.funded ? <span className="text-yellow-600">Funded</span> : <span className="text-gray-600">Active</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={() => console.log('edit', p.id)} className="px-3 py-1 bg-[#634bc1] text-white rounded hover:opacity-90 text-sm">Edit</button>
                    <button onClick={() => console.log('delete', p.id)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 text-sm">Delete</button>
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
