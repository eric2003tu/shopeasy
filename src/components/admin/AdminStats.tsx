"use client";
import React from 'react';

function StatCard({ title, value, color }: { title: string; value: number | string; color?: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex-1 border-t-4 border-transparent hover:border-indigo-50 transition-colors">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-2xl font-bold mt-2 ${color || 'text-indigo-600'}`}>{value}</div>
    </div>
  );
}

export default function AdminStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <StatCard title="Total Products" value={3} color="text-indigo-600" />
      <StatCard title="Funded Products" value={0} color="text-green-600" />
      <StatCard title="Completed Products" value={0} color="text-purple-600" />
      <StatCard title="Total Users" value={0} color="text-orange-600" />
      <StatCard title="Child Organisations" value={7} color="text-teal-600" />
    </div>
  );
}
