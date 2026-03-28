'use client';

import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Camera, Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Please check your environment variables.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error } = await supabase!.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setError(error.message);
      setIsSubmitting(false);
    } else {
      setIsSent(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-card p-8 shadow-xl">
        <div className="flex flex-col items-center space-y-2">
          <div className="rounded-2xl bg-foreground p-3">
            <Camera className="h-8 w-8 text-background" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
          <p className="text-sm text-foreground/60 text-center">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {isSent ? (
          <div className="flex flex-col items-center space-y-6 py-4">
            <div className="rounded-full bg-green-500/10 p-3">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-medium text-foreground">Check your email</p>
              <p className="text-sm text-foreground/60">
                We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
              </p>
            </div>
            <Link 
              href="/login"
              className="flex h-11 w-full items-center justify-center rounded-xl border font-bold transition-colors hover:bg-foreground/5"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-6">
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

            {error && (
              <p className="text-xs font-medium text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-foreground font-bold text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Reset Link'}
            </button>

            <Link 
              href="/login"
              className="flex items-center justify-center space-x-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
