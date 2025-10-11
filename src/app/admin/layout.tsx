"use client";
import React from 'react';
import ReusableSidebar from '@/components/admin/ReusableSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const sidebarConfig = {
    user: {
      name: 'Admin User',
      role: 'Administrator',
      avatar: '/avatar.png',
      systemName: 'ShopEasy Admin',
    },
    navigationGroups: [
      {
        label: 'Management',
        items: [
          { title: 'Dashboard', url: '/admin/dashboard' },
          { title: 'Products', url: '/admin/products' },
          { title: 'Users', url: '/admin/users' },
        ],
      },
    ],
    notifications: [],
  };

  return (
    <ReusableSidebar config={sidebarConfig} currentPath="/admin/dashboard">
      {children}
    </ReusableSidebar>
  );
}