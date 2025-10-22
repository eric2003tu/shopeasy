"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BiUser } from 'react-icons/bi';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { sampleUsers, SampleUser } from '@/lib/sampleData';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

// Creates a small SVG avatar with initials as a data URL
function makeInitialsAvatar(fullName?: string) {
  const name = fullName || '';
  const initials = name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() || 'U';
  const bg = '#6b46c1';
  const fg = '#ffffff';
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>
    <rect width='100%' height='100%' fill='${bg}' />
    <text x='50%' y='50%' dy='.35em' fill='${fg}' font-family='Arial, Helvetica, sans-serif' font-size='52' text-anchor='middle'>${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function UserMenu() {
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  return (
    <div className="ml-6 relative" ref={menuRef}>
      <button
        onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="relative h-10 w-10 bg-gray-200 rounded-full overflow-hidden border border-white/30">
          {auth.user?.image ? (
            <Image src={auth.user.image} alt={(auth.user.firstName || auth.user.username) as string} fill className="rounded-full object-cover" sizes="40px" />
          ) : (
            <Image src={makeInitialsAvatar(auth.user ? `${auth.user.firstName || ''} ${auth.user.lastName || ''}`.trim() : sampleUsers[0].name)} alt={(auth.user?.firstName || auth.user?.username || sampleUsers[0].name) as string} fill className="rounded-full object-cover" sizes="40px" />
          )}
        </div>
        <span className="text-white font-medium text-base">{auth.user ? `${auth.user.firstName || ''} ${auth.user.lastName || ''}`.trim() || auth.user.username : sampleUsers[0].name}</span>
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow-lg text-gray-800 py-2 z-50">
          <Link href="/shop/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
            <BiUser className="text-lg" />
            <span>My profile</span>
          </Link>
          <Link href="/shop/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
            <FiSettings className="text-lg" />
            <span>Settings</span>
          </Link>
          <button
            onClick={() => {
              auth.logout();
              setMenuOpen(false);
              router.push('/login');
            }}
            className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
