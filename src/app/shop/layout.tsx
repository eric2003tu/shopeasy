"use client";

import React, { useEffect, useState } from 'react';
import ShopHeader from '@/components/small/ShopHeader';
import SystemCommentLauncher from '@/components/small/SystemCommentLauncher';
import Header from '@/components/small/Header';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("shopeasy_token");
    setLoggedIn(!!token);
  }, []);

  return (
    <div>
      {loggedIn ? <ShopHeader /> : <Header />}
      <SystemCommentLauncher />
      <main className="pt-9">
        {children}
      </main>
    </div>
  );
}
