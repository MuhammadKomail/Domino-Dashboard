"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import leftImage from "@/assets/images/login-side.png";
import styles from "../login/login.module.css";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const nextEmail = email.trim();
    if (!nextEmail) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/admin/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: nextEmail }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || data?.error || 'Failed to send OTP');
      }
      try { sessionStorage.setItem('reset_email', nextEmail); } catch {}
      router.push("/verify-code");
    } catch (e: any) {
      setError(e?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authMainContainer}>
      <div className="min-h-screen md:flex bg-white">
        <div className="hidden md:block relative md:min-h-screen md:basis-1/2 overflow-hidden">
          <Image src={leftImage} alt="left-image" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 bg-white md:rounded-r-[32px]">
          <div className="w-full max-w-xl">
            <h2 className="text-2xl sm:text-4xl font-semibold mb-2 text-black text-left">Lost your Password?</h2>
            <p className="text-gray mb-8 text-left">Enter your email to receive a recovery code</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 pb-2">
                <Label htmlFor="email" className="text-sm text-black font-bold">Email</Label>
                <Input id="email" placeholder="john.doe@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="text-sm text-gray p-5" />
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button type="submit" disabled={loading} className="w-full text-center bg-gradient-to-r from-[#E92137] to-[#1976d2] hover:from-[#C81D30] hover:to-[#115293] text-sm sm:text-base py-3 sm:py-3 rounded-md text-white">
                {loading ? 'Sending...' : 'Receive Code'}
              </Button>
              <div className="text-center text-sm"><Link href="/login" className="text-[#E92137] hover:text-[#C81D30]">Back to login</Link></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
