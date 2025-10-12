"use client";
import React, { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Globe, Search, Settings, Moon } from 'lucide-react';
import Image from 'next/image';

export default function AdminHeader() {
  const { t } = useI18n();
  const [menuOpen] = useState(false);

  const user = {
    name: 'Admin User',
    role: 'Administrator',
    image: '/avatar.png',
  };

  // language selector moved to the reusable sidebar header

  return (
    <header className="sticky top-0 z-50 w-full border-b shadow-sm bg-gradient-to-r from-[#332e47] to-[#1d163c] relative">
      {/* decorative blobs behind header */}
      <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-[#ffdc89] opacity-8 pointer-events-none"></div>
      <div className="absolute -top-8 -left-8 w-44 h-44 rounded-full bg-[#634bc1] opacity-8 pointer-events-none"></div>
      <div className="flex items-center justify-between w-full px-6 py-3 text-white relative z-10">
        {/* Sidebar trigger for mobile */}
        <div className="flex items-center lg:hidden">
          <Button variant="ghost" size="icon" className="mr-2">
            <span className="sr-only">Toggle sidebar</span>
            <div className="w-5 flex flex-col gap-1">
              <div className="w-full h-0.5 bg-current"></div>
              <div className="w-full h-0.5 bg-current"></div>
              <div className="w-full h-0.5 bg-current"></div>
            </div>
          </Button>
        </div>

        {/* Search input */}
  <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/80" />
            <Input
              placeholder={t('admin.searchPlaceholder') || 'Search admin...'}
              aria-label="Search admin panel"
              className="w-full pl-10 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-input"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" aria-label="Settings">
              <Settings className="h-4 w-4 text-white/90" />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Theme">
              <Moon className="h-4 w-4 text-white/90" />
            </Button>
          </div>

          {/* Language selector moved to ReusableSidebar header */}

          {/* User profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-muted">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-2 ring-ring">
              <div className="relative h-8 w-8">
                <Image 
                  src={user.image} 
                  alt={user.name} 
                  fill 
                  className="rounded-full object-cover" 
                  sizes="32px" 
                />
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900">{user.name}</div>
              <div className="text-xs text-gray-500">{user.role}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}