"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Globe, Search, Settings, Moon } from 'lucide-react';

export default function AdminHeader() {
  const { t, locale, setLocale } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = {
    name: 'Admin User',
    role: 'Administrator',
    image: '/avatar.png',
  };

  const locales = ['en', 'es', 'fr', 'rw'] as const;

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const selectLocale = (selectedLocale: typeof locales[number]) => {
    setLocale(selectedLocale);
    setMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm backdrop-blur-sm bg-white/95">
      <div className="flex items-center justify-between w-full px-6 py-3">
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('admin.searchPlaceholder') || 'Search admin...'}
              aria-label="Search admin panel"
              className="w-full pl-10 focus-visible:ring-2 focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Theme">
              <Moon className="h-4 w-4" />
            </Button>
          </div>

          {/* Language selector */}
          <div className="relative" ref={menuRef}>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={toggleMenu} 
              aria-label="Change language" 
              aria-expanded={menuOpen}
              className="relative"
            >
              <Globe className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
            </Button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 backdrop-blur-sm bg-white/95">
                <div className="py-1">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-indigo-50 ${
                        locale === loc 
                          ? 'font-semibold text-indigo-600 bg-indigo-50' 
                          : 'text-gray-700'
                      }`}
                      onClick={() => selectLocale(loc)}
                    >
                      <span className="flex items-center justify-between">
                        {loc.toUpperCase()}
                        {locale === loc && (
                          <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User profile */}
          <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 ring-2 ring-indigo-100">
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => { 
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
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