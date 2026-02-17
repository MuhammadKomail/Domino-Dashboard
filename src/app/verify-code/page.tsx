"use client";

import * as React from "react";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import leftImage from "@/assets/images/login-side.png";
import styles from "../login/login.module.css";

export default function VerifyCode() {
  const router = useRouter();
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const inputs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (idx: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...values];
    next[idx] = d;
    setValues(next);
    if (d && idx < inputs.length - 1) inputs[idx + 1].current?.focus();
  };

  const onKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[idx] && idx > 0) {
      inputs[idx - 1].current?.focus();
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const otp = values.join("");
    if (otp.length !== 6) {
      setError('Please enter 6 digit OTP');
      return;
    }

    const email = (() => {
      try {
        return sessionStorage.getItem('reset_email');
      } catch {
        return null;
      }
    })();
    if (!email) {
      setError('Email missing. Please start again.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/admin/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || data?.error || 'Invalid OTP');
      }
      try {
        sessionStorage.setItem('reset_otp', otp);
        sessionStorage.setItem('reset_otp_verified', 'true');
      } catch {}
      router.push("/new-password");
    } catch (e: any) {
      setError(e?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError(null);
    const email = (() => { try { return sessionStorage.getItem('reset_email'); } catch { return null; } })();
    if (!email) {
      setError('Email missing. Please start again.');
      return;
    }
    setResendLoading(true);
    try {
      try {
        sessionStorage.removeItem('reset_otp');
        sessionStorage.removeItem('reset_otp_verified');
      } catch {}

      const res = await fetch('/admin/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || data?.error || 'Failed to resend OTP');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className={styles.authMainContainer}>
      <div className="min-h-screen md:flex bg-white">
        <div className="hidden md:block relative md:min-h-screen md:basis-1/2 md:flex-none overflow-hidden">
          <Image src={leftImage} alt="left-image" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 bg-white md:rounded-r-[32px] md:min-h-screen">
          <div className="w-full max-w-xl">
            <h2 className="text-2xl sm:text-4xl font-semibold mb-2 text-black text-left">Reset Password</h2>
            <p className="text-gray mb-8 text-left">Please enter the 6 digit OTP code sent to your email.</p>

            <form onSubmit={submit} className="space-y-6">
              <div className="flex gap-4">
                {values.map((v, i) => (
                  <input
                    key={i}
                    ref={inputs[i]}
                    value={v}
                    onChange={(e) => onChange(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    inputMode="numeric"
                    maxLength={1}
                    className="w-20 h-16 rounded-md border border-gray-300 text-center text-2xl focus:outline-none focus:ring-2 focus:ring-[#E92137]"
                  />
                ))}
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button type="submit" disabled={loading} className="w-full text-center bg-gradient-to-r from-[#E92137] to-[#1976d2] hover:from-[#C81D30] hover:to-[#115293] text-sm sm:text-base py-3 sm:py-3 rounded-md text-white">
                {loading ? 'Please wait...' : 'Continue'}
              </Button>
              <button type="button" onClick={resend} disabled={resendLoading} className="w-full text-center text-sm text-[#E92137] hover:text-[#C81D30]">
                {resendLoading ? 'Resending...' : 'Resend code'}
              </button>
              <div className="text-center text-sm"><Link href="/forgot-password" className="text-[#E92137] hover:text-[#C81D30]">Back</Link></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
