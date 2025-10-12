"use client";

import React from 'react';
import CartsTable from '@/components/admin/CartsTable';

export default function AdminCartsPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Carts</h2>
      <p className="text-sm text-muted-foreground mb-4">View and manage customer carts (abandoned/active).</p>
      <CartsTable />
    </div>
  );
}
