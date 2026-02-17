"use client";

import React, { useEffect, useRef, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChangePasswordPage() {
  const authState: any = useSelector((state: any) => state.auth);
  const didInitFromUserRef = useRef(false);

  let lsUser: any = null;
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("user");
      if (raw) lsUser = JSON.parse(raw);
    }
  } catch {}

  const currentUser = authState?.user?.user || authState?.user || lsUser || null;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [photoError, setPhotoError] = useState(false);
  

  useEffect(() => {
    if (didInitFromUserRef.current) return;

    const fullName: string =
      currentUser?.full_name || currentUser?.name || currentUser?.username || "";
    const nameParts = String(fullName).trim().split(/\s+/).filter(Boolean);
    const fName = nameParts[0] || "";
    const lName = nameParts.slice(1).join(" ");
    const userEmail: string = currentUser?.email || "";

    if (fName) setFirstName(fName);
    if (lName) setLastName(lName);
    if (userEmail) setEmail(userEmail);

    const userPhoto: string =
      currentUser?.photoUrl ||
      currentUser?.photo_url ||
      currentUser?.avatar ||
      currentUser?.avatarUrl ||
      currentUser?.image ||
      "";
    if (userPhoto) setPhotoUrl(String(userPhoto));
    setPhotoError(false);

    didInitFromUserRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const initials = (() => {
    const f = (firstName || "").trim();
    const l = (lastName || "").trim();
    const i1 = f ? f[0] : "";
    const i2 = l ? l[0] : "";
    return (i1 + i2).toUpperCase();
  })();

  useEffect(() => {
    return () => {
      // Cleanup object URLs if any were created
      if (photoUrl?.startsWith("blob:")) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const sessionId = typeof window !== "undefined" ? localStorage.getItem("sessionId") : null;

      if (!token && !sessionId) {
        toast.error("You are not logged in.");
        return;
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      } else if (sessionId) {
        headers["Session-ID"] = sessionId;
      }

      const response = await fetch("/admin/api/auth/change-password", {
        method: "POST",
        headers,
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      let data: any = null;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch {}
      } else {
        try {
          const txt = await response.text();
          data = txt ? { message: txt } : null;
        } catch {}
      }

      if (!response.ok || data?.success === false) {
        toast.error(data?.message || data?.error || "Unable to change password");
        return;
      }

      toast.success(data?.message || data?.error || "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-3xl">
        <div className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
          <p className="text-sm text-gray-500">Manage your account settings and preferences</p>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-2 ring-gray-100">
                <Avatar className="w-full h-full ring-1 ring-gray-200">
              {photoUrl && !photoError ? (
                <AvatarImage src={photoUrl} alt="profile" onError={() => setPhotoError(true)} />
              ) : null}
              <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold">
                {initials || (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.6"
                      d="M20 21a8 8 0 10-16 0m16 0H4m16 0a8 8 0 00-16 0m8-9a4 4 0 100-8 4 4 0 000 8z"
                    />
                  </svg>
                )}
              </AvatarFallback>
                </Avatar>
              </div>
              <div className="min-w-0">
                <div className="text-sm text-gray-900 font-medium truncate">{firstName} {lastName}</div>
                <div className="text-xs text-gray-500 truncate">{email}</div>
              </div>
            </div>

            <form onSubmit={onSave} className="mt-6">
              <div className="rounded-xl border border-gray-200 divide-y">
                <div className="p-4 sm:p-5">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">First Name</label>
                      <input value={firstName} disabled onChange={(e) => setFirstName(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-600" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Last Name</label>
                      <input value={lastName} disabled onChange={(e) => setLastName(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs text-gray-600 mb-1">Email Address</label>
                    <div className="relative">
                      <input value={email} disabled className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-600" />
                      <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">🔒</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Security Settings</h4>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Current Password</label>
                    <div className="relative">
                      <input type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm pr-10" />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center text-sm leading-5 text-[#E92137] hover:text-[#C81D30]"
                        onClick={() => setShowCurrent((v) => !v)}
                        aria-label={showCurrent ? 'Hide password' : 'Show password'}
                      >
                        {showCurrent ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs text-gray-600 mb-1">New Password</label>
                    <div className="relative">
                      <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm pr-10" />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center text-sm leading-5 text-[#E92137] hover:text-[#C81D30]"
                        onClick={() => setShowNew((v) => !v)}
                        aria-label={showNew ? 'Hide password' : 'Show password'}
                      >
                        {showNew ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button type="submit" disabled={saving} className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 rounded-md bg-gradient-to-r from-[#E92137] to-[#1976d2] hover:from-[#C81D30] hover:to-[#115293] text-white text-sm disabled:opacity-60">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
