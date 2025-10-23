"use client";
import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

import { samplePayments, sampleRefunds, sampleComments } from '@/lib/sampleData';
import { useEffect, useState } from 'react';

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
  const { t } = useI18n();
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const totalRevenue = samplePayments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalRefunds = sampleRefunds.length;
  const [totalFeedbacks, setTotalFeedbacks] = useState<number>(sampleComments.length);

  useEffect(() => {
    let mounted = true;
    async function loadStats() {
      try {
        const [prodRes, usersRes, commentsRes] = await Promise.all([
          fetch('https://dummyjson.com/products'),
          fetch('https://dummyjson.com/users'),
          fetch('https://dummyjson.com/comments')
        ]);

        if (!mounted) return;

        if (prodRes.ok) {
          const pd = await prodRes.json();
          if (Number.isFinite(pd.total)) setTotalProducts(Number(pd.total));
          else if (Array.isArray(pd.products)) setTotalProducts(pd.products.length);
        }

        if (usersRes.ok) {
          const ud = await usersRes.json();
          if (Number.isFinite(ud.total)) setTotalUsers(Number(ud.total));
          else if (Array.isArray(ud.users)) setTotalUsers(ud.users.length);
        }

        if (commentsRes.ok) {
          const cd = await commentsRes.json();
          if (Number.isFinite(cd.total)) setTotalFeedbacks(Number(cd.total));
          else if (Array.isArray(cd.comments)) setTotalFeedbacks(cd.comments.length);
        }

        // dummyjson doesn't expose payments/refunds; keep sample data for revenue/refunds
      } catch (e) {
        console.debug('Failed to fetch admin stats from dummyjson, keeping sample values', e);
      }
    }
    loadStats();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <StatCard title={t('admin.stats.totalProducts')} value={totalProducts} href="/admin/products" />
      <StatCard title={t('admin.stats.totalUsers')} value={totalUsers} href="/admin/users" />
      <StatCard title={t('admin.stats.totalRevenue')} value={`$${totalRevenue.toFixed(2)}`} href="/admin/payments" />
      <StatCard title={t('admin.stats.totalRefunds')} value={totalRefunds} href="/admin/refunds" />
      <StatCard title={t('admin.stats.totalFeedbacks')} value={totalFeedbacks} href="/admin/comments" />
    </div>
  );
}
