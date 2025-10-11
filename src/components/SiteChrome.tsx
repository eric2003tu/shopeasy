"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/small/Header';
import Footer from '@/components/small/Footer';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  // Hide site chrome on admin routes
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
