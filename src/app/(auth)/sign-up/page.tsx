"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Mail } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  async function handleResend() {
    setResendError(null);
    setResendMessage(null);
    setResendLoading(true);
    const supabase = createClient();
    const { error: resendErr } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });
    setResendLoading(false);
    if (resendErr) {
      setResendError(resendErr.message);
      return;
    }
    setResendMessage("Confirmation email sent again.");
  }

  return (
    <div className="relative w-full max-w-md">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl"
        aria-hidden
      >
        <div className="absolute -left-1/4 top-0 h-[min(28rem,90vw)] w-[min(28rem,90vw)] rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute -right-1/4 top-1/3 h-[min(24rem,80vw)] w-[min(24rem,80vw)] rounded-full bg-violet-500/15 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-[min(20rem,70vw)] w-[min(20rem,70vw)] rounded-full bg-purple-500/12 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="w-full border-border/60 bg-card/80 shadow-xl shadow-black/20 backdrop-blur-sm dark:shadow-black/40">
          <CardHeader className="text-center">
            <p className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
              HyntSight
            </p>
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>
              Start designing AI-powered clothing today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col items-center gap-4 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] p-6 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/30">
                  <Mail className="size-6" aria-hidden />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-emerald-100">
                    Check your email
                  </p>
                  <p className="text-sm text-emerald-200/80">
                    We sent a confirmation link to{" "}
                    <span className="font-medium text-emerald-100">{email}</span>
                    . Open it to finish setting up your account.
                  </p>
                </div>
                {resendMessage && (
                  <p
                    role="status"
                    aria-live="polite"
                    className="text-sm text-emerald-400"
                  >
                    {resendMessage}
                  </p>
                )}
                {resendError && (
                  <p
                    role="alert"
                    aria-live="polite"
                    className="text-sm text-red-400"
                  >
                    {resendError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-sm font-medium text-indigo-400 underline-offset-4 hover:text-indigo-300 hover:underline disabled:pointer-events-none disabled:opacity-50"
                >
                  {resendLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    "Resend email"
                  )}
                </button>
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="text-indigo-400 underline-offset-4 hover:text-indigo-300 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
                  >
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-9 w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:opacity-95 dark:shadow-indigo-500/15"
                >
                  {loading && <Loader2 className="animate-spin" />}
                  Create Account
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="text-indigo-400 underline-offset-4 hover:text-indigo-300 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
