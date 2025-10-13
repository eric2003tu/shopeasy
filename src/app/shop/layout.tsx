import React from 'react';
import ShopHeader from '@/components/small/ShopHeader';
import Footer from '@/components/small/Footer';

export const metadata = {
  title: 'Shop - ShopEasy',
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
  <ShopHeader />
        <main className="pt-16">{/* offset for fixed header */}
          {children}
        </main>
      </body>
    </html>
  );
}
