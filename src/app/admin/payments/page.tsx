"use client";

import React from 'react';
import PaymentsTable from '@/components/admin/PaymentsTable';

export default function AdminPaymentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Payments</h1>
      <div className="mt-4">
        <PaymentsTable />
      </div>
    </div>
  );
}
