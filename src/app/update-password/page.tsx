'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Camera, Lock, Loader2, CheckCircle2 } from 'lucide-react';

export default function UpdatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Basic check: if Supabase isn't configured, this flow won't work
    if (!isSupabaseConfigured()) {
      router.replace('/');
    }
  }, [router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error } = await supabase!.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setIsSubmitting(false);
    } else {
      setIsSuccess(true);
      setIsSubmitting(false);
      // Wait a bit then redirect to login or home
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-card p-8 shadow-xl">
        <div className="flex flex-col items-center space-y-2">
          <div className="rounded-2xl bg-foreground p-3">
            <Camera className="h-8 w-8 text-background" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">New Password</h1>
          <p className="text-sm text-foreground/60 text-center">
            Set your new secure password below.
          </p>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center space-y-6 py-4">
            <div className="rounded-full bg-green-500/10 p-3">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-medium text-foreground">Password updated!</p>
              <p className="text-sm text-foreground/60">
                Your password has been reset successfully. Redirecting you to login...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">New Password</label>
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

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
                    placeholder="••••••••"
                  />
                </div>
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
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
