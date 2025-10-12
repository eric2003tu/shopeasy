"use client";
import React from 'react';
import CheckoutsTable from '@/components/admin/CheckoutsTable';

export default function AdminCheckoutsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Checkouts</h1>
      <CheckoutsTable />
    </div>
  );
}
