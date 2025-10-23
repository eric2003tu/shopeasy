"use client";
import React, { useState, useRef, useEffect } from 'react';
// UserMenu intentionally not used here; keep import commented for future wiring
import Link from 'next/link';
import Image from 'next/image';
import { BsBoxSeam, BsCart2 } from 'react-icons/bs';
import { MdPayment } from 'react-icons/md';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { HiOutlineGlobeAlt } from 'react-icons/hi';
import { BiUser } from 'react-icons/bi';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { subscribeCart, getCartCount } from '@/lib/cart';
import { useI18n } from '@/i18n/I18nProvider';

export default function ShopHeader() {
	const [scrolled, setScrolled] = useState(false);
	const [langOpen, setLangOpen] = useState(false);
	const { t, locale, setLocale } = useI18n();
	const langRef = useRef<HTMLDivElement | null>(null);
		const auth = useAuth();
		const [cartCount, setCartCount] = useState<number>(0);
		const [userMenuOpen, setUserMenuOpen] = useState(false);
		const userMenuRef = useRef<HTMLDivElement | null>(null);
		const router = useRouter();

	// Creates a small SVG avatar with initials as a data URL
	const makeInitialsAvatar = (fullName?: string) => {
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
	};

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

		useEffect(() => {
			const onClick = (e: MouseEvent) => {
				if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
				if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
			};
			window.addEventListener('click', onClick);
			return () => window.removeEventListener('click', onClick);
		}, []);

		useEffect(() => {
			// subscribe to cart changes for live badge updates
			const unsub = subscribeCart((cart) => {
				setCartCount(cart.reduce((s, it) => s + (it.quantity || 0), 0));
			});
			// also seed from localStorage
			try { setCartCount(getCartCount()); } catch {}
			return () => unsub();
		}, []);

	// No local state for user here; use auth.user and fall back to sample user if not set

	return (
		<header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#634bc1] shadow-md' : 'bg-[#634bc1]/90 backdrop-blur-sm'} shadow-lg`}>
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex items-center justify-between">
					<Link href="/shop" className="flex items-center gap-3 group">
						<div className="relative h-12 w-12">
							<Image src="/logo.jpg" alt="ShopEasy Logo" fill className="rounded-full border-2 border-white/30 group-hover:border-[#ffdc89] transition-all object-cover" sizes="48px" />
						</div>
						<span className="text-white font-bold text-xl md:text-2xl ml-2">
							Shop<span className="text-[#ffdc89]">Easy</span>
						</span>
					</Link>

					<nav className="hidden md:flex items-center space-x-4">
						<Link href="/shop/products" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2 transition-colors">
							<BsBoxSeam className="text-lg" />
							{t('header.products')}
						</Link>
						<Link href="/shop/carts" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2 transition-colors">
							<BsCart2 className="text-lg" />
							{t('header.carts')}
							{cartCount > 0 && (
								<span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-red-500 rounded-full">{cartCount}</span>
							)}
						</Link>
						<Link href="/shop/checkouts" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2 transition-colors">
							<AiOutlineCheckCircle className="text-lg" />
							{t('header.checkouts')}
						</Link>
						<Link href="/shop/payments" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2 transition-colors">
							<MdPayment className="text-lg" />
							{t('header.payments')}
						</Link>

						<div className="relative" ref={langRef}>
							<button onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }} className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2 transition-colors">
								<HiOutlineGlobeAlt className="text-lg" />
								<span className="hidden sm:inline">{locale.toUpperCase()}</span>
							</button>
							{langOpen && (
								<div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg text-gray-800 py-2 z-50">
									{(['en','fr','es','rw'] as const).map(l => (
										<button key={l} onClick={() => { setLocale(l); setLangOpen(false); }} className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${locale===l? 'font-semibold' : ''}`}>
											{l.toUpperCase()}
										</button>
									))}
								</div>
							)}
						</div>

																		{/* User menu (reusable) - show avatar/name from auth if present */}
																		<div className="ml-6 relative">
																			<button onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }} className="flex items-center gap-2 focus:outline-none">
																				<div className="relative h-10 w-10 bg-gray-200 rounded-full overflow-hidden border border-white/30">
																					{auth.user?.image ? (
																						<Image src={auth.user.image} alt={(auth.user.firstName || auth.user.username) as string} fill className="rounded-full object-cover" sizes="40px" />
																					) : (
																						<Image src={makeInitialsAvatar(auth.user ? `${auth.user.firstName || ''} ${auth.user.lastName || ''}`.trim() : 'Guest')} alt={(auth.user?.firstName || auth.user?.username || 'Guest') as string} fill className="rounded-full object-cover" sizes="40px" />
																					)}
																				</div>
																				<span className="text-white font-medium text-base">{(auth.user ? `${auth.user.firstName || ''} ${auth.user.lastName || ''}`.trim() || auth.user.username : 'Guest')}</span>
																			</button>
																			{userMenuOpen && (
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
																							setUserMenuOpen(false);
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
					</nav>
				</div>
			</div>
		</header>
	);
}
