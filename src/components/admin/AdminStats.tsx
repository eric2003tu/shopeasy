"use client";
import React from 'react';
import Link from 'next/link';

import { sampleProducts, sampleUsers, samplePayments, sampleRefunds, sampleComments } from '@/lib/sampleData';

function StatCard({ title, value, href }: { title: string; value: number | string; href?: string }) {
  const card = (
    <div className="bg-card rounded-lg shadow p-6 flex-1 border-t-4 border-transparent hover:border-accent/30 transition-colors">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-bold mt-2 text-primary">{value}</div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded">
        {card}
      </Link>
    );
  }

  return card;
}

export default function AdminStats() {
  // Use canonical sample data as the authoritative source for dashboard stats
  const totalProducts = sampleProducts.length;
  const totalUsers = sampleUsers.length;
  const totalRevenue = samplePayments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalRefunds = sampleRefunds.length;
  const totalFeedbacks = sampleComments.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <StatCard title="Total products" value={totalProducts} href="/admin/products" />
      <StatCard title="Total users" value={totalUsers} href="/admin/users" />
      <StatCard title="Total revenue" value={`$${totalRevenue.toFixed(2)}`} href="/admin/payments" />
      <StatCard title="Total refunds" value={totalRefunds} href="/admin/refunds" />
      <StatCard title="Total user feedbacks" value={totalFeedbacks} href="/admin/comments" />
    </div>
  );
}
