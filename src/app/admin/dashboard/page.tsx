"use client";
import React from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import AdminStats from '@/components/admin/AdminStats';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { samplePayments } from '@/lib/sampleData';
import { useEffect, useState, useMemo } from 'react';

export default function DashboardPage() {
  const { t } = useI18n();
  // Fetch products client-side and compute revenue per category by matching payments' productId -> product.category when possible
  type Product = {
    id?: number | string;
    category?: string;
  };

  const [products, setProducts] = useState<Array<Product>>([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('https://dummyjson.com/products?limit=1000');
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data?.products) ? data.products : [];
        if (mounted) setProducts(list);
      } catch (e) {
        console.debug('Failed to fetch products for dashboard charts', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const revenueByCategory = useMemo(() => {
  const prodCat = new Map<string, string>();
  products.forEach((p: Product) => prodCat.set(String(p.id), p.category || 'Uncategorized'));

    const totals = new Map<string, number>();

    samplePayments.forEach((pay) => {
      if (pay.status !== 'completed') return;
      (pay.items || []).forEach((it) => {
        const category = it.productId ? prodCat.get(String(it.productId)) || (it.productName || 'Uncategorized') : (it.productName || 'Uncategorized');
        const amount = (typeof it.price === 'number' ? it.price : 0) * (it.quantity || 1);
        totals.set(category, (totals.get(category) || 0) + amount);
      });
    });

    const rows = Array.from(totals.entries()).map(([category, revenue]) => ({ category, value: revenue }));
    rows.sort((a, b) => b.value - a.value);
    return rows;
  }, [products]);

  const colors = ['#4f46e5', '#06b6d4', '#f97316', '#10b981', '#ef4444', '#a78bfa'];

  const productsByCategory = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p: Product) => {
      const cat = p.category || 'Uncategorized';
      m.set(cat, (m.get(cat) || 0) + 1);
    });
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [products]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-1">{t('admin.dashboardTitle')}</h2>
      <p className="text-sm text-gray-600 mb-6">{t('admin.dashboardSubtitle')}</p>

      <AdminStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">{t('admin.charts.revenueByCategory')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByCategory} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-20} textAnchor="end" interval={0} height={60} />
                <YAxis tickFormatter={(v) => `$${Number(v).toFixed(0)}`} />
                <Tooltip formatter={(value: number | string) => [`$${Number(value).toFixed(2)}`, t('admin.charts.revenue')]} />
                <Legend />
                <Bar dataKey="value" name={t('admin.charts.revenue')} fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">{t('admin.charts.productsPerCategory')}</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={productsByCategory} dataKey="value" nameKey="name" outerRadius={80} label>
                  {productsByCategory.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v} ${t('admin.charts.products')}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
