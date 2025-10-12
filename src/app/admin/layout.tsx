"use client";
import React from 'react';
import ReusableSidebar from '@/components/admin/ReusableSidebar';
import { Home, ShoppingCart, Box, Users, CreditCard, Settings, Repeat, MessageCircle } from 'lucide-react';

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
        label: 'Main',
        items: [
          { title: 'Dashboard', url: '/admin/dashboard', icon: Home },
          { title: 'Products', url: '/admin/products', icon: Box },
          { title: 'Carts', url: '/admin/carts', icon: ShoppingCart },
          { title: 'Users', url: '/admin/users', icon: Users },
          { title: 'Checkout', url: '/admin/checkout', icon: ShoppingCart },
          { title: 'Payments', url: '/admin/payments', icon: CreditCard },
          { title: 'Profile', url: '/admin/profile', icon: Users },
          { title: 'Refunds', url: '/admin/refunds', icon: Repeat },
          { title: 'Comments', url: '/admin/comments', icon: MessageCircle },
          { title: 'Settings', url: '/admin/settings', icon: Settings },
        ],
      },
    ],
    notifications: [],
  };

  return (
    <ReusableSidebar config={sidebarConfig}>
      {children}
    </ReusableSidebar>
  );
}