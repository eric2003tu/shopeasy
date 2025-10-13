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
        label: 'admin.nav.main',
        items: [
          { title: 'admin.dashboard', url: '/admin/dashboard', icon: Home },
          { title: 'admin.products', url: '/admin/products', icon: Box },
          { title: 'admin.nav.carts', url: '/admin/carts', icon: ShoppingCart },
          { title: 'admin.users', url: '/admin/users', icon: Users },
          { title: 'admin.checkout', url: '/admin/checkout', icon: ShoppingCart },
          { title: 'admin.payment', url: '/admin/payments', icon: CreditCard },
          { title: 'admin.profile', url: '/admin/profile', icon: Users },
          { title: 'admin.nav.refunds', url: '/admin/refunds', icon: Repeat },
          { title: 'admin.nav.comments', url: '/admin/comments', icon: MessageCircle },
          { title: 'admin.settings', url: '/admin/settings', icon: Settings },
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