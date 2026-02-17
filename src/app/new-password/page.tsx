"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import leftImage from "@/assets/images/login-side.png";
import styles from "../login/login.module.css";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function NewPassword() {
  const router = useRouter();
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const email = (() => {
      try {
        return sessionStorage.getItem('reset_email');
      } catch {
        return null;
      }
    })();
    const verified = (() => {
      try {
        return sessionStorage.getItem('reset_otp_verified');
      } catch {
        return null;
      }
    })();

    if (!email) {
      router.replace('/forgot-password');
      return;
    }
    if (verified !== 'true') {
      router.replace('/verify-code');
    }
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pwd1 || !pwd2) return;
    if (pwd1 !== pwd2) {
      setError('Passwords do not match');
      return;
    }
    const email = (() => { try { return sessionStorage.getItem('reset_email'); } catch { return null; } })();
    const otp = (() => { try { return sessionStorage.getItem('reset_otp'); } catch { return null; } })();
    if (!email || !otp) {
      setError('Missing email/otp. Please start again.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/admin/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword: pwd1 }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || data?.error || 'Failed to reset password');
      }
      try {
        sessionStorage.removeItem('reset_email');
        sessionStorage.removeItem('reset_otp');
        sessionStorage.removeItem('reset_otp_verified');
      } catch {}
      router.push('/login');
    } catch (e: any) {
      setError(e?.message || 'Failed to reset password');
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
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white md:rounded-r-[32px] md:min-h-screen">
          <div className="w-full max-w-xl">
            <h2 className="text-2xl sm:text-4xl font-semibold mb-2 text-black text-left">Reset Password</h2>
            <p className="text-gray mb-8 text-left">Reset your password</p>
            <form onSubmit={submit} className="space-y-4">
              <div className="relative space-y-2 pb-2">
                <Label htmlFor="newpwd" className="text-sm text-black font-bold">New Password</Label>
                <Input id="newpwd" type={show1 ? "text" : "password"} placeholder="Password" value={pwd1} onChange={(e)=>setPwd1(e.target.value)} className="text-sm text-gray p-5 pr-10" />
                <button type="button" className="absolute inset-y-0 top-3 right-3 flex items-center text-[#E92137]" onClick={()=>setShow1(!show1)} aria-label={show1?"Hide password":"Show password"}>
                  {show1 ? <IoEye size={20}/> : <IoEyeOff size={20}/>}
                </button>
              </div>
              <div className="relative space-y-2 pb-2">
                <Label htmlFor="confirmpwd" className="text-sm text-black font-bold">Confirm Password</Label>
                <Input id="confirmpwd" type={show2 ? "text" : "password"} placeholder="Password" value={pwd2} onChange={(e)=>setPwd2(e.target.value)} className="text-sm text-gray p-5 pr-10" />
                <button type="button" className="absolute inset-y-0 top-3 right-3 flex items-center text-[#E92137]" onClick={()=>setShow2(!show2)} aria-label={show2?"Hide password":"Show password"}>
                  {show2 ? <IoEye size={20}/> : <IoEyeOff size={20}/>}
                </button>
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button type="submit" disabled={loading} className="w-full text-center bg-gradient-to-r from-[#E92137] to-[#1976d2] hover:from-[#C81D30] hover:to-[#115293] text-sm sm:text-base py-3 sm:py-3 rounded-md text-white">
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
              <div className="text-center text-sm"><Link href="/login" className="text-[#E92137] hover:text-[#C81D30]">Back to login</Link></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
