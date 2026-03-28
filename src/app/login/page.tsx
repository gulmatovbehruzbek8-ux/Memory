'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { Camera, Lock, Mail, Loader2 } from 'lucide-react';

export default function Login() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) return;

    setIsSubmitting(true);
    setError(null);

    const { error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsSubmitting(false);
    } else {
      router.replace('/');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-foreground/20" />
      </div>
    );
  }

  if (!isSupabaseConfigured()) {
    return null; // Should redirect to / via useEffect
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-card p-8 shadow-xl">
        <div className="flex flex-col items-center space-y-2">
          <div className="rounded-2xl bg-foreground p-3">
            <Camera className="h-8 w-8 text-background" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Memory Archive</h1>
          <p className="text-sm text-foreground/60 text-center">
            Your private vault of memories. Please sign in to continue.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-foreground font-bold text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-foreground/40">
            Securely powered by Supabase Auth.
          </p>
        </div>
      </div>
    </div>
  );
}
