"use client";
import React from 'react';

import { sampleProducts, sampleUsers } from '@/lib/sampleData';

function StatCard({ title, value, color }: { title: string; value: number | string; color?: string }) {
  return (
    <div className="bg-card rounded-lg shadow p-6 flex-1 border-t-4 border-transparent hover:border-accent/30 transition-colors">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className={`text-2xl font-bold mt-2 ${color || 'text-primary'}`}>{value}</div>
    </div>
  );
}

export default function AdminStats() {
  const totalProducts = sampleProducts.length;
  const fundedProducts = sampleProducts.filter((p) => p.funded).length;
  const completedProducts = sampleProducts.filter((p) => p.completed).length;
  const totalUsers = sampleUsers.length;
  const childOrgs = 7; // keep same as before

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <StatCard title="Total Products" value={totalProducts} color="text-primary" />
      <StatCard title="Funded Products" value={fundedProducts} color="text-primary" />
      <StatCard title="Completed Products" value={completedProducts} color="text-primary" />
      <StatCard title="Total Users" value={totalUsers} color="text-primary" />
      <StatCard title="Child Organisations" value={childOrgs} color="text-primary" />
    </div>
  );
}
