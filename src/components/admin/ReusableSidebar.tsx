"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Globe, Moon, Sun, Settings, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarSubItem {
  title: string;
  url: string;
  isActive?: boolean;
}

export interface SidebarItem {
  title: string;
  url: string;
  icon?: React.ComponentType<any>;
  isActive?: boolean;
  badge?: string;
  subItems?: SidebarSubItem[];
}

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export interface SidebarUser {
  name: string;
  email?: string;
  role?: string;
  avatar?: string;
  systemName?: string;
}

export interface SidebarNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  read?: boolean;
}

export interface SidebarConfig {
  user: SidebarUser;
  navigationGroups: SidebarGroup[];
  notifications?: SidebarNotification[];
}

export default function ReusableSidebar({ config, currentPath = '/', children }: { config: SidebarConfig; currentPath?: string; children: React.ReactNode; }) {
  const { t } = useI18n();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved);
        document.documentElement.classList.toggle('dark', saved === 'dark');
        return;
      }
    } catch (e) {
      // ignore
    }
    const prefersDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      // ignore
    }
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'rw', label: 'Kinyarwanda' },
  ];

  const toggleGroup = (idx: number) => {
    setOpenGroups((s) => ({ ...s, [idx]: !s[idx] }));
  };

  return (
    <SidebarProvider className="w-full">
      <div className="flex w-full min-h-screen">
        {/* Sidebar */}
        <Sidebar className="shadow-lg bg-white flex-shrink-0">
          <SidebarHeader className="p-4 pt-6 min-h-60 bg-white">
            <div className="flex flex-col items-center gap-3 text-center">
              <Image src="/logo.jpg" alt="logo" width={80} height={80} className="rounded-full object-cover" />
              <div className="text-sm font-semibold">{config.user.systemName || 'ShopEasy'}</div>
            </div>
          </SidebarHeader>

          <SidebarContent className="overflow-y-auto">
            {config.navigationGroups.map((group, gi) => (
              <SidebarGroup key={gi}>
                <SidebarGroupLabel>{t ? t(group.label) : group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item, ii) => (
                      <SidebarMenuItem key={ii}>
                        {item.subItems && item.subItems.length > 0 ? (
                          <div>
                            <SidebarMenuButton className="w-full" onClick={() => toggleGroup(gi)} isActive={item.isActive || currentPath === item.url}>
                              {item.icon && React.createElement(item.icon, { className: 'h-4 w-4' })}
                              <span>{t ? t(item.title) : item.title}</span>
                            </SidebarMenuButton>
                            {openGroups[gi] && (
                              <SidebarMenuSub>
                                {item.subItems!.map((s, si) => (
                                  <SidebarMenuSubItem key={si}>
                                    <SidebarMenuSubButton asChild isActive={s.isActive || currentPath === s.url}>
                                      <Link href={s.url}>{t ? t(s.title) : s.title}</Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            )}
                          </div>
                        ) : (
                          <SidebarMenuButton asChild isActive={item.isActive || currentPath === item.url}>
                            <Link href={item.url} className="flex items-center gap-2">
                              {item.icon && React.createElement(item.icon, { className: 'h-4 w-4' })}
                              <span>{t ? t(item.title) : item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="p-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>

              <div className="relative">
                <select
                  className={cn('bg-transparent text-sm p-1 rounded')}
                  onChange={(e) => {
                    document.cookie = `locale=${e.target.value}; path=/`;
                    window.location.reload();
                  }}
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        {/* Main Content Area - Full width from sidebar to right edge */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Full-width header that spans from sidebar edge to page right */}
          <header className="flex h-16 items-center gap-4 border-b px-6 bg-white w-full sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="ml-2 font-semibold text-sm">{config.user.systemName || 'Dashboard'}</div>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                  {config.user.avatar ? (
                    <Image src={config.user.avatar} alt={config.user.name} width={32} height={32} />
                  ) : null}
                </div>
                <div className="text-sm text-right">
                  <div className="font-medium text-indigo-600">{config.user.name}</div>
                  <div className="text-xs text-muted-foreground">{config.user.role}</div>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-8 bg-background overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}