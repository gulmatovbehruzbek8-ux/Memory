'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Calendar, Star, Plus, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthProvider';

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const navItems = [
    { label: 'Archive', href: '/', icon: Camera },
    { label: 'Timeline', href: '/timeline', icon: Calendar },
    { label: 'Favorites', href: '/favorites', icon: Star },
    { label: 'New Event', href: '/create', icon: Plus },
  ];

  if (!mounted) return null;

  if (!user) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-lg bg-foreground p-1.5">
                <Camera className="h-5 w-5 text-background" />
              </div>
              <span className="text-xl font-bold tracking-tight">Memory</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full p-2 hover:bg-foreground/5 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link
                href="/login"
                className="rounded-lg bg-foreground px-4 py-2 text-sm font-bold text-background transition-colors hover:bg-foreground/90"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const userInitials = user.email ? user.email.substring(0, 2).toUpperCase() : '??';

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="rounded-lg bg-foreground p-1.5">
              <Camera className="h-5 w-5 text-background" />
            </div>
            <span className="text-xl font-bold tracking-tight">Memory</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-1.5 text-sm font-medium transition-colors hover:text-foreground/80",
                    isActive ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full p-2 hover:bg-foreground/5 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="flex items-center space-x-2 border-l pl-4">
              <div className="h-8 w-8 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold">
                {userInitials}
              </div>
              <button
                onClick={() => signOut()}
                className="rounded-full p-2 hover:bg-red-500/10 text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t bg-background">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center p-2 transition-colors",
                  isActive ? "text-foreground" : "text-foreground/60"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
