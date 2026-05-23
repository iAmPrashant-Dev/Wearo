"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAddressStore } from "@/store/useAddressStore";
import { useOrderStore } from "@/store/useOrderStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Men", href: "/products/men" },
  { label: "Women", href: "/products/women" },
  { label: "New Arrivals", href: "/products/new-arrivals" },
  { label: "Collections", href: "/collections" },
];
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const clearCart = useCartStore((state) => state.clearCart);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const clearAddress = useAddressStore((state) => state.clearAddress);
  const clearOrders = useOrderStore((state) => state.clearOrders);
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const cartItemsCount = useCartStore((state) => state.cart.length);
  const wishlistItemsCount = useWishlistStore((state) => state.wishlist.length);
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  (() => {
    if (showLogo) {
      console.log(
        `



 /$$      /$$                                        
| $$  /$ | $$                                        
| $$ /$$$| $$  /$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$ 
| $$/$$ $$ $$ /$$__  $$ |____  $$ /$$__  $$ /$$__  $$
| $$$$_  $$$$| $$$$$$$$  /$$$$$$$| $$  \__/| $$  \ $$
| $$$/ \  $$$| $$_____/ /$$__  $$| $$      | $$  | $$
| $$/   \  $$|  $$$$$$$|  $$$$$$$| $$      |  $$$$$$/
|__/     \__/ \_______/ \_______/|__/       \______/ 
                                                     
                                                     
                                                     
`)
      setShowLogo(false);
    }
  })();
  const [mounted, setMounted] = useState(false);

  const handleLogout = async () => {
    clearCart();
    clearAddress();
    clearOrders();
    clearWishlist();

    await signOut({
      callbackUrl: "/login"
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-51 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-100 dark:border-white/5">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 sm:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center shadow-sm">
              <span className="text-white dark:text-black font-bold text-base leading-none">
                W
              </span>
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Wearo.
            </span>
          </Link>

          {/* Center Nav Links — hidden on mobile */}
          <ul className="hidden xl:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname.includes(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative px-3 lg:px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg
                      ${isActive
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                  >
                    {link.label}
                    {/* Active underline indicator */}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2.5px] rounded-full bg-indigo-500" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden xl:flex items-center">
              {/* Search */}
              <div className="group relative flex items-center">
                <button
                  onClick={handleSearch}
                  className="absolute left-3 cursor-pointer z-10 hover:scale-110 transition-transform"
                >
                  <Search className="h-5 w-5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                </button>
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="
                  w-10 h-10 pl-10 pr-0 
                  cursor-pointer rounded-full border-none bg-transparent 
                  transition-all duration-300 ease-in-out
                  placeholder:opacity-0
                  
                  group-hover:w-64 group-hover:pl-10 group-hover:pr-4 
                  group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900 
                  group-hover:placeholder:opacity-100
                  
                  focus:w-64 focus:pl-10 focus:pr-4 
                  focus:bg-zinc-100 dark:focus:bg-zinc-900 
                  focus:placeholder:opacity-100 
                  focus:ring-1 focus:ring-zinc-300
                "
                />
              </div>
            </div>

            {/* Wishlist */}
            {session && <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-2.5 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors duration-200"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {/* Badge */}
              {mounted && wishlistItemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-indigo-500 rounded-full leading-none">
                  {wishlistItemsCount}
                </span>
              )}
            </Link>}

            {/* Cart */}
            {session && <Link
              href="/cart"
              aria-label="Cart"
              className="relative p-2.5 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors duration-200"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {/* Badge */}
              {mounted && cartItemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-indigo-500 rounded-full leading-none">
                  {cartItemsCount}
                </span>
              )}
            </Link>}

            {/* Profile Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Profile Menu"
                  className="ml-1 sm:ml-2 w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm hover:shadow-md transition-shadow duration-200 ring-2 ring-white dark:ring-zinc-900 outline-none"
                >
                  {session && session?.user?.name[0]}
                  {!session && <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>}
                </button>
              </DropdownMenuTrigger>
              {session ? <DropdownMenuContent align="end" className="w-48 z-99">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer w-full">
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 focus:text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent> :
                <DropdownMenuContent align="end" className="w-48 z-99">
                  <DropdownMenuItem asChild className="cursor-pointer text-cyan-600 focus:text-cyan-600">
                    <Link href="/login" >Login</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              }
            </DropdownMenu>

            {/* Mobile hamburger */}
            <button
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="xl:hidden relative p-2.5 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors duration-200 ml-1"
            >
              {mobileMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay + Drawer */}
      <div
        className={`xl:hidden fixed inset-0 transition-opacity duration-300 z-53 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-white/5">
            <span className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Menu</span>
            <button
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" x2="6" y1="6" y2="18" />
                <line x1="6" x2="18" y1="6" y2="18" />
              </svg>
            </button>
          </div>

          {/* Drawer body */}
          <div className="min-h-[calc(100dvh-65px)] bg-white w-full px-5 py-4 flex flex-col gap-5">
            {/* Mobile Search */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSearch(); setMobileMenuOpen(false); }}
              className="relative flex items-center"
            >
              <Search className="absolute left-3 h-4 w-4 text-zinc-400" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700"
              />
            </form>

            {/* Nav Links */}
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname.includes(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-colors duration-200 ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <hr className="border-zinc-100 dark:border-white/5" />

            {/* Quick links */}
            <ul className="flex flex-col gap-1">
              {session && (
                <>
                  <li>
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors duration-200"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      Wishlist
                      {mounted && wishlistItemsCount > 0 && (
                        <span className="ml-auto px-2 py-0.5 text-xs font-bold text-white bg-indigo-500 rounded-full">
                          {wishlistItemsCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cart"
                      className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors duration-200"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                        <path d="M3 6h18" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      Cart
                      {mounted && cartItemsCount > 0 && (
                        <span className="ml-auto px-2 py-0.5 text-xs font-bold text-white bg-indigo-500 rounded-full">
                          {cartItemsCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors duration-200"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors duration-200"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                        <path d="m3.3 7 8.7 5 8.7-5" />
                        <path d="M12 22V12" />
                      </svg>
                      Orders
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* Bottom action */}
            <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-white/5">
              {session ? (
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[15px] font-medium text-red-600 bg-red-50 dark:bg-red-950/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors duration-200"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[15px] font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
