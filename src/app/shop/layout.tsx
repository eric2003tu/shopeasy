import React from 'react';
import ShopHeader from '@/components/small/ShopHeader';
// import AuthGuard from '@/components/auth/AuthGuard';

export const metadata = {
  title: 'Shop - ShopEasy',
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ShopHeader />
      <main className="pt-16">{/* offset for fixed header */}
        {/* <AuthGuard> */}
          {children}
        {/* </AuthGuard> */}
      </main>
    </div>
  );
}
