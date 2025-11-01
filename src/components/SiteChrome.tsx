"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import ShopHeader from './small/ShopHeader';
import Footer from '@/components/small/Footer';
import SystemCommentLauncher from '@/components/small/SystemCommentLauncher';
import { useAuth } from '@/context/AuthProvider';
import Header from './small/Header';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
   const auth = useAuth();
   const currentUser = localStorage.getItem("shopeasy_token");

  // Hide site chrome on admin routes
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return <>{children}</>; 

  return (
    <>
     {currentUser ? <ShopHeader /> : <Header />}
      {/* <ShopHeader /> */}
      <SystemCommentLauncher />
      {children}
      <Footer />
    </>
  );
}
