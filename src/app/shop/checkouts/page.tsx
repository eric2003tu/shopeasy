"use client";
import React from 'react';
import Checkout from '@/components/small/Checkout';

export default function CheckoutsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Checkout />
      </div>
    </div>
  );
}
