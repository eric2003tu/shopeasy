"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Bell, Globe } from 'lucide-react';

export interface SidebarSubItem {
  title: string;
  url: string;
  isActive?: boolean;
}

export interface SidebarItem {
  title: string;
  url: string;
  icon?: React.ElementType;
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
    } catch {
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
    } catch {
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

  // Local inline component to render a globe language selector with dropdown
  function LanguageSelector() {
    const { locale, setLocale } = useI18n();
    const [open, setOpen] = useState(false);
    const ref = React.useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      function onDoc(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      }
      document.addEventListener('mousedown', onDoc);
      return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    return (
      <div className="relative" ref={ref}>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={() => setOpen((s) => !s)} 
          aria-label="Change language" 
          aria-expanded={open}
          className="relative text-gray-600 hover:bg-[#634bc1] hover:text-white transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        </Button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-[#1f1730] border border-white/10 rounded-lg shadow-lg z-50 backdrop-blur-sm">
            <div className="py-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-accent/10 ${
                    locale === l.code ? 'font-semibold text-primary bg-accent/10' : 'text-white/80'
                  }`}
                  onClick={() => { setLocale(l.code as 'en' | 'fr' | 'es' | 'rw'); setOpen(false); }}
                >
                  <span className="flex items-center justify-between">
                    {l.label}
                    {locale === l.code && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const toggleGroup = (idx: number) => {
    setOpenGroups((s) => ({ ...s, [idx]: !s[idx] }));
  };

  return (
    <SidebarProvider className="w-full">
      <div className="flex w-full min-h-screen">
        {/* Fixed Header at the top - always full width */}
        <header className="fixed top-0 left-0 right-0 h-16 flex items-center gap-4 border-b px-6 z-50 bg-white text-gray-800 shadow-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="text-gray-600 hover:bg-[#634bc1] hover:text-white transition-colors" />
            <div className="ml-2 font-semibold text-sm">
              {config.user.systemName || 'Dashboard'}
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Notifications"
              className="text-gray-600 hover:bg-[#634bc1] hover:text-white transition-colors"
            >
              <Bell className="h-4 w-4" />
            </Button>

            {/* Language globe button copied from admin header style */}
            <LanguageSelector />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#634bc1] border border-[#ffdc89]">
                {config.user.avatar ? (
                  <Image src={config.user.avatar} alt={config.user.name} width={32} height={32} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#634bc1] text-white text-xs font-bold">
                    {config.user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="text-sm text-right">
                <div className="font-medium text-gray-800">{config.user.name}</div>
                <div className="text-xs text-gray-500">{config.user.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar - Fixed colors for better readability */}
        <Sidebar className="shadow-lg bg-white border-r border-gray-200 relative mt-16"> {/* Added mt-16 for header space */}
          <SidebarHeader className="p-4 pt-6 min-h-40 relative overflow-hidden bg-gradient-to-r from-[#332e47] to-[#1d163c]">
            {/* decorative blobs matching home hero */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#332e47] to-[#1d163c] opacity-10 pointer-events-none"></div>
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#634bc1] opacity-10 pointer-events-none"></div>
            <div className="flex flex-col items-center gap-3 text-center relative z-10">
              <Image src="/logo.jpg" alt="logo" width={60} height={60} className="rounded-full object-cover border-2 border-[#ffdc89]" />
              <div className="text-sm font-semibold text-white">{config.user.systemName || 'ShopEasy'}</div>
              <div className="text-xs text-[#ffdc89]">Admin Panel</div>
            </div>
          </SidebarHeader>

          <SidebarContent className="overflow-y-auto">
            {config.navigationGroups.map((group, gi) => (
              <SidebarGroup key={gi}>
                <SidebarGroupLabel className="text-gray-500 font-medium text-xs uppercase tracking-wide px-4">
                  {t ? t(group.label) : group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item, ii) => (
                      <SidebarMenuItem key={ii}>
                        {item.subItems && item.subItems.length > 0 ? (
                          <div>
                            <SidebarMenuButton 
                              className="w-full text-gray-700 hover:bg-[#634bc1] hover:text-white transition-colors"
                              onClick={() => toggleGroup(gi)} 
                              isActive={item.isActive || currentPath === item.url}
                            >
                              {item.icon && React.createElement(item.icon, { className: 'h-4 w-4' })}
                              <span>{t ? t(item.title) : item.title}</span>
                            </SidebarMenuButton>
                            {openGroups[gi] && (
                              <SidebarMenuSub>
                                {item.subItems!.map((s, si) => (
                                  <SidebarMenuSubItem key={si}>
                                    <SidebarMenuSubButton 
                                      asChild 
                                      isActive={s.isActive || currentPath === s.url}
                                      className="text-gray-600 hover:text-[#634bc1] hover:bg-gray-100 transition-colors"
                                    >
                                      <Link href={s.url}>{t ? t(s.title) : s.title}</Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            )}
                          </div>
                        ) : (
                          <SidebarMenuButton 
                            asChild 
                            isActive={item.isActive || currentPath === item.url}
                            className="text-gray-700 hover:bg-[#634bc1] hover:text-white transition-colors"
                          >
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

          <SidebarFooter className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="text-gray-600 hover:bg-[#634bc1] hover:text-white transition-colors"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>

              <div />
            </div>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="flex-1 flex flex-col min-w-0 mt-16"> {/* Added mt-16 for header space */}
          {/* Main content */}
          <main className="flex-1 p-8 bg-gray-50 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}