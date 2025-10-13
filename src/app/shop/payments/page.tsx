"use client";
import React from 'react';
import Payments from '@/components/small/Payments';

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Payments</h1>
        <Payments />
      </div>
    </div>
  );
}
