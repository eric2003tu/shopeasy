"use client";
import React from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import AdminStats from '@/components/admin/AdminStats';

export default function DashboardPage() {
  const { t } = useI18n();
  return (
    <div>
      <h2 className="text-3xl font-bold mb-1">Province Coordinator of Western Province Dashboard</h2>
      <p className="text-sm text-gray-600 mb-6">Overview of your organisations, projects, and performance metrics.</p>

      <AdminStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Projects per Child Organisation</h3>
          <div className="h-56 bg-slate-50 rounded"></div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Projects by Status</h3>
          <div className="h-56 bg-slate-50 rounded"></div>
        </div>
      </div>
    </div>
  );
}
