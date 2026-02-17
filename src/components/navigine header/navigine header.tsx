import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from "next/navigation";
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

type Tab = {
  label: string;
};

interface HeaderProps {
  title: string;
  trail?: string[]; // breadcrumbs before title
  tabs?: Tab[];
  activeIndex?: number;
  variant?: 'default' | 'compact';
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
  showBell?: boolean;
  offsetLeft?: number;
  onLogout?: () => void;
  canAccessHref?: (href: string) => boolean;
}

export default function NavigineHeader({ title, trail = [], tabs = [], activeIndex = 0, variant = 'default', userName, userRole, avatarUrl, showBell = false, offsetLeft = 80, onLogout, canAccessHref }: HeaderProps) {
  const { t } = useTranslation();
  const pathname = usePathname()?.replace(/^\/+/, '') || '';
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(target)) setNotifOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenuOpen(false); setNotifOpen(false); }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const initials = (name?: string) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  };

  const formatRole = (role?: string) => {
    const raw = String(role || '').trim();
    if (!raw) return '';
    const cleaned = raw.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
    return cleaned
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const displayRole = formatRole(userRole);

  const canShow = (href: string) => {
    try {
      return canAccessHref ? canAccessHref(href) : true;
    } catch {
      return true;
    }
  };

  return (
    <header className="fixed top-0 z-20 bg-white border-b px-8" style={{ left: offsetLeft, right: 0 }}>
      <div className="w-full py-3 pr-4 md:pr-6">
        {variant === 'compact' ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0 flex items-center text-sm text-gray-500 whitespace-nowrap overflow-x-auto">
              {trail.map((item, idx) => (
                <div key={item} className="flex items-center">
                  <span className={idx === trail.length - 1 ? 'text-[#E92137] font-medium' : ''}>{item}</span>
                  {idx < trail.length - 1 && <span className="mx-2 text-gray-400">›</span>}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {showBell && (
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    aria-label="Notifications"
                    onClick={() => setNotifOpen((v) => !v)}
                    className="relative text-gray-500 hover:text-gray-700"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-[#E92137] ring-2 ring-white" />
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-3 w-96 max-w-sm rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-30">
                      <div className="px-4 py-3 border-b flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">Notifications</div>
                        <button className="text-xs text-gray-500 hover:text-gray-700" onClick={() => setNotifOpen(false)}>Close</button>
                      </div>
                      <ul className="max-h-80 overflow-auto divide-y">
                        <li className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
                          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-200">
                            !
                          </span>
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">XYZ pump haven't cycled in last 24 hours</div>
                            <div className="text-xs text-gray-500">Critical</div>
                          </div>
                          <div className="text-xs text-gray-400 whitespace-nowrap">2 min</div>
                        </li>
                        <li className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
                          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-200">!</span>
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">XYZ pump haven't cycled in last 24 hours</div>
                            <div className="text-xs text-gray-500">Warning</div>
                          </div>
                          <div className="text-xs text-gray-400 whitespace-nowrap">2 min</div>
                        </li>
                        <li className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
                          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-green-600 ring-1 ring-green-200">•</span>
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">All systems normal</div>
                            <div className="text-xs text-gray-500">Normal</div>
                          </div>
                          <div className="text-xs text-gray-400 whitespace-nowrap">5 min</div>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {(userName || avatarUrl) && (
                <div className="relative" ref={profileRef}>
                  <button type="button" onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-700 text-sm font-semibold ring-1 ring-gray-300 shadow-sm">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt={userName || 'User'} className="w-full h-full object-cover" />
                      ) : (
                        <span>{initials(userName)}</span>
                      )}
                    </div>
                    <div className="leading-tight text-left hidden sm:block">
                      {userName && <div className="text-sm text-gray-900">{userName}</div>}
                      {displayRole && <div className="text-xs text-gray-500">{displayRole}</div>}
                    </div>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-3 w-72 rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-30">
                      <div className="px-4 py-3 flex items-center gap-3 border-b">
                        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-700 ring-1 ring-gray-300 shadow-sm">
                          {avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatarUrl} alt={userName || 'User'} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-base font-semibold">{initials(userName)}</span>
                          )}
                        </div>
                        <div className="leading-tight">
                          {userName && <div className="text-sm font-medium text-gray-900">{userName}</div>}
                          {displayRole && <div className="text-xs text-gray-500">{displayRole}</div>}
                        </div>
                      </div>

                      <div className="py-2 text-sm select-none">
                        <div className="px-4 pb-1 text-xs font-semibold text-gray-500">Management</div>
                        {canShow('/user-management') ? (
                          <Link href="/user-management" className="flex items-center justify-between px-4 py-2 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                            <span>User Management</span>
                          </Link>
                        ) : null}
                        <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500">Privacy</div>
                        {canShow('/change-password') ? (
                          <Link href="/change-password" className="flex items-center justify-between px-4 py-2 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                            <span>Change Password</span>
                          </Link>
                        ) : null}
                      </div>

                      <div className="border-t">
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-gray-50"
                          onClick={() => {
                            if (onLogout) {
                              onLogout();
                            } else {
                              // Fallback: simple redirect if no handler provided
                              window.location.href = '/admin/login';
                            }
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              {trail.length > 0 && (
                <div className="text-gray-500 text-sm truncate">
                  {trail.join(' › ')} {trail.length ? '› ' : ''}
                  <span className="text-gray-900">{title}</span>
                </div>
              )}
              <h1 className="text-2xl font-semibold text-gray-900 mt-1 truncate">{title}</h1>
            </div>

            {tabs.length > 0 && (
              <nav className="ml-6 flex-1 flex justify-end overflow-x-auto">
                <ul className="flex items-center gap-2">
                  {tabs.map((tab, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <li key={tab.label}>
                        <button
                          className={
                            `px-3 py-1.5 rounded-md text-sm whitespace-nowrap ` +
                            (isActive
                              ? 'bg-[#E92137] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                          }
                          type="button"
                        >
                          {tab.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}
          </div>
        )}
      </div>

    </header>
  );
}