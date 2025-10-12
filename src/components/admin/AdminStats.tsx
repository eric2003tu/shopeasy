"use client";
import React from 'react';

function StatCard({ title, value, color }: { title: string; value: number | string; color?: string }) {
  return (
    <div className="bg-card rounded-lg shadow p-6 flex-1 border-t-4 border-transparent hover:border-accent/30 transition-colors">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className={`text-2xl font-bold mt-2 ${color || 'text-primary'}`}>{value}</div>
    </div>
  );
}

export default function AdminStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
  <StatCard title="Total Products" value={3} color="text-primary" />
  <StatCard title="Funded Products" value={0} color="text-primary" />
  <StatCard title="Completed Products" value={0} color="text-primary" />
  <StatCard title="Total Users" value={0} color="text-primary" />
  <StatCard title="Child Organisations" value={7} color="text-primary" />
    </div>
  );
}
