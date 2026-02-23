'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useEffect, useMemo, useRef, useState } from 'react';
import { assetPaths } from '@/paths/path';
import NavigineHeader from "@/components/navigine header/navigine header";
import Overview from "@/components/dashboard/Overview";
import DeviceOverview from "@/components/dashboard/DeviceOverview";
import GoogleMapView from "@/components/maps/GoogleMapView";
import HistoryPage from "@/components/dashboard/HistoryPage";
import SettingsPage from "@/components/dashboard/SettingsPage";
import PixelAnalyticsDashboard from "@/components/dashboard/PixelAnalyticsDashboard";
import { useSelector } from 'react-redux';
import { deleteCookie } from 'cookies-next';

const drawerWidth = 240;
const drawerNarrowWidth = 80;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `${drawerNarrowWidth}px`,
  ...(open && {
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})({
  width: '100%',
  height: '70px',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const ProfileSection = styled('div')<{ open: boolean }>(({ theme, open }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  flexDirection: open ? 'row' : 'column',
  gap: open ? theme.spacing(2) : theme.spacing(1),
}));

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number>(1); // default to "User Management"
  const pathname = usePathname();
  const router = useRouter();
  const [allowedRoutesState, setAllowedRoutesState] = useState<string[]>([]);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [expandedSite, setExpandedSite] = useState<string | null>(null);
  const [selectedWell, setSelectedWell] = useState<string | null>(null);
  const [isSitesLoading, setIsSitesLoading] = useState<boolean>(false);
  const isDashboard = pathname === '/' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin/dashboard');
  const didInitDefaultRef = useRef(false);
  const searchParams = useSearchParams();
  const authState: any = useSelector((state: any) => state.auth);
  let lsUser: any = null;
  let lsRole: string | null = null;
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('user');
      if (raw) lsUser = JSON.parse(raw);
      lsRole = localStorage.getItem('role');
    }
  } catch {}
  const headerUser = authState?.user?.user || authState?.user || lsUser || null;
  const headerName = headerUser?.full_name || headerUser?.username || headerUser?.email || 'User';
  const headerRole = authState?.user?.role || headerUser?.role || authState?.role || lsRole || 'User';

  const normalizedPath = React.useMemo(() => {
    const p = pathname || '/';
    const np = p.startsWith('/admin') ? p.replace(/^\/admin/, '') : p;
    return np || '/';
  }, [pathname]);

  const isSuperAdmin = React.useMemo(() => {
    const r = String(headerRole || '').trim().toLowerCase();
    return r === 'admin' || r === 'system administrator' || r === 'system admin' || r === 'super admin';
  }, [headerRole]);

  const allowedRoutes = allowedRoutesState;

  useEffect(() => {
    const readAllowedRoutes = () => {
      try {
        const raw = localStorage.getItem('allowed_routes');
        const parsed = raw ? JSON.parse(raw) : null;
        const next = Array.isArray(parsed) ? parsed.map((x) => String(x)) : [];
        setAllowedRoutesState(next);
      } catch {
        setAllowedRoutesState([]);
      }
    };

    if (typeof window === 'undefined') return;
    readAllowedRoutes();

    const onPermUpdate = () => readAllowedRoutes();
    window.addEventListener('permissions_updated', onPermUpdate as any);
    return () => window.removeEventListener('permissions_updated', onPermUpdate as any);
  }, []);

  const permissionKeyForPath = React.useMemo(() => {
    return {
      '/dashboard': 'dashboard',
      '/user-management': 'users:list',
      '/roles': 'roles:manage',
      '/change-password': 'change_password',
    } as Record<string, string>;
  }, []);

  const canAccessPath = React.useCallback(
    (path: string) => {
      if (isSuperAdmin) return true;
      const key = permissionKeyForPath[path];
      if (!key) return true; // if not mapped, don't block
      if (!allowedRoutes || allowedRoutes.length === 0) return true; // fail-open until permissions loaded
      return allowedRoutes.includes(key);
    },
    [allowedRoutes, isSuperAdmin, permissionKeyForPath]
  );

  // Initialize sidebar openness: desktop open, mobile collapsed
  useEffect(() => {
    try {
      const isDesktop = window.innerWidth >= 1024; // ~Tailwind lg breakpoint
      setOpen(isDesktop);
    } catch (_) {
      // noop for SSR
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const hasAuthToken = document.cookie.split(';').some((c) => c.trim().startsWith('AuthToken='));
    const isUserAuthed = document.cookie.split(';').some((c) => c.trim().startsWith('UserAuthenticated='));
    setIsAuthenticated(hasAuthToken && isUserAuthed);
    const timeout = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  // Reset selections when leaving dashboard
  useEffect(() => {
    if (!isDashboard) {
      setExpandedSite(null);
      setSelectedWell(null);
    }
  }, [isDashboard, pathname]);

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      let sessionId: string | null = null;
      try { sessionId = localStorage.getItem('sessionId'); } catch {}
      try {
        await fetch('/admin/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
          cache: 'no-store',
        });
      } catch {}
    } finally {
      // Clear auth cookies (ensure root path)
      try {
        deleteCookie('AuthToken', { path: '/' });
        deleteCookie('RefreshToken', { path: '/' });
        deleteCookie('user_object', { path: '/' });
        deleteCookie('UserAuthenticated', { path: '/' });
      } catch {}
      // Clear client storage just in case
      try { localStorage.clear(); } catch {}
      try { sessionStorage.clear(); } catch {}

      setIsLoggingOut(false);
      setLogoutSuccess(true);
      // Hard redirect to basePath login to avoid client routing cache
      window.location.replace('/admin/login');
    }
  };

  // API data for companies -> sites -> devices
  type Device = { id: number; device_serial: string; geolocation?: { x: number; y: number } | [number, number] | null };
  type Site = { location_id: number; site_name: string; devices: Device[] };
  type Company = { company_id: number; company_name: string; sites: Site[] };
  const [apiCompanies, setApiCompanies] = useState<Company[] | null>(null);
  const [apiLoadError, setApiLoadError] = useState<string | null>(null);

  // Build map markers for the currently expanded site (parent clicked)
  type MapMarker = {
    id: string;
    position: { lat: number; lng: number };
    label?: string;
    color?: 'red' | 'orange' | 'green';
    info?: React.ReactNode;
  };

  const siteMarkers = useMemo<MapMarker[]>(() => {
    if (!expandedSite || !apiCompanies) return [];
    // expandedSite label format: `${site_name} (${company_name})`
    const m = expandedSite.match(/^(.+?) \((.+)\)$/);
    const siteName = m ? m[1] : expandedSite;
    const companyName = m ? m[2] : '';
    const company = apiCompanies.find(c => c.company_name === companyName) || null;
    const site = company?.sites?.find(s => s.site_name === siteName) || null;
    if (!site) return [];

    const metrics = (site as any)?.metrics as any;
    const pumped24 = typeof metrics?.pumped_last_24h_gal === 'number' ? metrics.pumped_last_24h_gal : null;
    const timeouts24 = typeof metrics?.timeouts_last_24h === 'number' ? metrics.timeouts_last_24h : null;
    const tempF = typeof metrics?.temperature_f === 'number' ? metrics.temperature_f : null;
    const vacuum = typeof metrics?.vacuum_inwc === 'number' ? metrics.vacuum_inwc : null;

    const detailsNode = (
      <div style={{ minWidth: 220 }}>
        <div style={{ fontWeight: 800, marginBottom: 6, color: '#2f6b2f' }}>{(site as any)?.site_name || 'Site'}</div>
        <div style={{ fontSize: 13, color: '#111827', lineHeight: 1.6 }}>
          <div>Pumped Last 24 Hours: {pumped24 == null ? '-' : pumped24.toLocaleString()} gal</div>
          <div>Timeouts Last 24 Hours: {timeouts24 == null ? '-' : timeouts24.toLocaleString()}</div>
          <div>Temperature: {tempF == null ? '-' : tempF} F</div>
          <div>Vacuum: {vacuum == null ? '-' : vacuum} inwc</div>
        </div>
      </div>
    );

    return (site.devices || [])
      .map((d) => {
        const g = d.geolocation as any;
        let lng: number | null = null;
        let lat: number | null = null;
        if (Array.isArray(g) && g.length >= 2) {
          lng = typeof g[0] === 'number' ? g[0] : null;
          lat = typeof g[1] === 'number' ? g[1] : null;
        } else if (g && typeof g === 'object') {
          lng = typeof g.x === 'number' ? g.x : null;
          lat = typeof g.y === 'number' ? g.y : null;
        }
        if (lng == null || lat == null) return null;
        return {
          id: String(d.id || d.device_serial || Math.random()),
          label: d.device_serial,
          position: { lat, lng },
          color: 'green' as const,
          info: detailsNode,
        };
      })
      .filter(Boolean) as MapMarker[];
  }, [expandedSite, apiCompanies]);

  // Build sidebar items from API or fallback static data
  const dashboardSites = useMemo(() => {
    if (apiCompanies && apiCompanies.length) {
      const groups: { site: string; wells: string[]; company_id: number }[] = [];
      for (const comp of apiCompanies) {
        for (const s of comp.sites || []) {
          const label = `${s.site_name} (${comp.company_name})`;
          const wells = [
            'Wellfield Overview',
            ...((s.devices || []).map((d) => d.device_serial).filter(Boolean)),
          ];
          groups.push({ site: label, wells, company_id: comp.company_id });
        }
      }
      return groups;
    }
    // No fallback: keep empty until API returns
    return [];
  }, [apiCompanies]);

  // Dashboard default selection: run once when we have data (API or fallback)
  useEffect(() => {
    if (!isDashboard) return;
    if (didInitDefaultRef.current) return;
    if (!dashboardSites || dashboardSites.length === 0) return;
    const firstGroup = dashboardSites[0];
    const target = firstGroup?.site || 'LRI (WC)';
    setExpandedSite(target);
    // Do NOT select a specific well by default so that the map view shows first
    setSelectedWell(null);
    didInitDefaultRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDashboard, dashboardSites]);

  useEffect(() => {
    if (!isDashboard) return;
    if (!isAuthenticated) return;
    let ignore = false;
    // Fetch sidebar data
    (async () => {
      try {
        setApiLoadError(null);
        setIsSitesLoading(true);
        const token = (() => {
          try {
            const match = document.cookie.match(/(?:^|; )AuthToken=([^;]+)/);
            return match ? decodeURIComponent(match[1]) : null;
          } catch { return null; }
        })();
        const res = await fetch('/admin/api/companies/all/sites-with-devices', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          cache: 'no-store',
        });
        const json = await res.json().catch(() => ({}));
        if (ignore) return;
        if (res.ok && Array.isArray(json?.data)) {
          setApiCompanies(json.data as Company[]);
        } else {
          setApiLoadError('Failed to load sites');
        }
        setIsSitesLoading(false);
      } catch (e) {
        if (!ignore) setApiLoadError('Network error');
        setIsSitesLoading(false);
      }
    })();
    (async () => {
      try {
        // Avoid hitting /auth/me repeatedly; once per tab/session unless data is missing
        try {
          const alreadyFetched = sessionStorage.getItem('did_fetch_auth_me') === '1';
          const hasUser = !!localStorage.getItem('user');
          const hasRole = !!localStorage.getItem('role');
          const hasAllowedRoutes = (() => {
            try {
              const raw = localStorage.getItem('allowed_routes');
              const parsed = raw ? JSON.parse(raw) : null;
              return Array.isArray(parsed) && parsed.length > 0;
            } catch {
              return false;
            }
          })();
          if (alreadyFetched && hasUser && hasRole && hasAllowedRoutes) {
            return;
          }
        } catch { }

        const res = await fetch('/admin/api/auth/me', { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        if (ignore) return;
        if (res.ok && data) {
          // Also persist only the nested user object for direct access
          try { if (data?.user) localStorage.setItem('user', JSON.stringify(data.user)); } catch { }

          // Persist specific fields
          try {
            const role = data?.user?.role;
            if (typeof role === 'string') {
              localStorage.setItem('role', role);
            }
            if (Array.isArray(data?.allowed_tables)) {
              localStorage.setItem('allowed_tables', JSON.stringify(data.allowed_tables));
            }
            if (Array.isArray(data?.allowed_routes)) {
              localStorage.setItem('allowed_routes', JSON.stringify(data.allowed_routes));
            }
          } catch { }

          // Mark as fetched for this tab/session
          try { sessionStorage.setItem('did_fetch_auth_me', '1'); } catch { }
        }
      } catch { }
    })();
    return () => { ignore = true; };
  }, [isDashboard, isAuthenticated]);

  // Guard: redirect if user opens a page they don't have access to
  useEffect(() => {
    if (!isAuthenticated) return;
    if (isSuperAdmin) return;
    if (!isLoaded) return;

    const topLevelPath = (() => {
      const seg = normalizedPath.split('?')[0].split('#')[0];
      if (seg === '/' || seg.startsWith('/dashboard')) return '/dashboard';
      if (seg.startsWith('/user-management')) return '/user-management';
      if (seg.startsWith('/roles')) return '/roles';
      if (seg.startsWith('/change-password')) return '/change-password';
      return seg;
    })();

    if (!canAccessPath(topLevelPath)) {
      const fallback = (() => {
        if (!allowedRoutes || allowedRoutes.length === 0) return '/dashboard';
        const ordered = ['/dashboard', '/user-management', '/roles', '/change-password'];
        for (const p of ordered) {
          if (canAccessPath(p)) return p;
        }
        return '/dashboard';
      })();

      if (topLevelPath !== fallback) {
        router.replace(fallback);
      }
    }
  }, [allowedRoutes, canAccessPath, isAuthenticated, isLoaded, isSuperAdmin, normalizedPath, router]);

  if (!isLoaded || isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return <div>{children}</div>;
  }

  const navItems = [
    { text: 'Dashboard', href: '/dashboard', icon: <DashboardOutlinedIcon /> },
    { text: 'Pizza Analytics', href: '/dashboard/pizza-analytics', icon: <DashboardOutlinedIcon /> },
    { text: 'User Management', href: '/user-management', icon: <ManageAccountsOutlinedIcon /> },
    { text: 'Role Management', href: '/roles', icon: <ManageAccountsOutlinedIcon /> },
    { text: 'Change Password', href: '/change-password', icon: <LockOutlinedIcon /> },
  ].filter((i) => canAccessPath(i.href));


  const userData = {
    name: 'Demo User',
    email: 'demo@email.com',
    profilePic: '/icons/1.png',
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      {/* <AppBar position="fixed" style={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Image src={assetPaths.XourceLogo} alt="Logo" width={120} height={40} priority />
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton size="small">
              <NotificationsNoneOutlinedIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountCircleOutlinedIcon />
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>John Doe</Typography>
                <Typography variant="caption" color="text.secondary">Admin</Typography>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar> */}

      <Box sx={{ display: 'flex', marginTop: '0px' }}>
        <IconButton
          onClick={handleDrawerToggle}
          style={{
            backgroundColor: 'white',
            borderRadius: '10%',
            width: 24,
            height: 24,
            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
            position: 'fixed',
            top: 40,
            left: (open ? drawerWidth : drawerNarrowWidth) - 12,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgb(255, 255, 255)',
          }}
        >
          {open ? (
            <ChevronLeftIcon sx={{ color: 'black', fontSize: 14 }} />
          ) : (
            <ChevronRightIcon sx={{ color: 'black', fontSize: 14 }} />
          )}
        </IconButton>

        <Drawer
          sx={{
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: open ? drawerWidth : drawerNarrowWidth,
              boxSizing: 'border-box',
              top: '0px',
              height: '100vh',
              transition: 'width 0.3s ease',
              backgroundColor: '#E92137',
              backgroundImage: 'linear-gradient(180deg, #E92137 0%, #E92137 45%, #1976d2 140%)',
              borderTopRightRadius: 0,
              borderRight: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            },
          }}
          variant="persistent"
          anchor="left"
          open={true}
        >
          {/* Sidebar logo/header block */}
          <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.92)',
                borderRadius: 2,
                py: open ? 1.75 : 1.25,
                px: open ? 2 : 1,
              }}
            >
              <Image
                src={assetPaths.XourceLogo}
                alt="Sidebar Logo"
                width={open ? 70 : 48}
                height={open ? 56 : 48}
                priority
                style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
              />
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

          {(() => {
            return (
              <List>
                {navItems.map((item, idx) => {
                  const selected = (item.href === '/dashboard' && (pathname === '/' || pathname === '/dashboard')) ||
                    (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  return (
                    <ListItem key={item.text} disablePadding sx={{ px: open ? 1 : 0, py: 0.5 }}>
                      <ListItemButton
                        component={Link}
                        href={item.href}
                        selected={selected}
                        onClick={() => setSelectedIdx(idx)}
                        sx={{
                          width: '100%',
                          cursor: 'pointer',
                          m: 0,
                          borderRadius: '8px',
                          color: 'rgba(255,255,255,0.95)',
                          '&.Mui-selected': {
                            backgroundColor: 'white',
                            color: '#C81D30',
                            '&:hover': { backgroundColor: 'white' },
                          },
                          '&:not(.Mui-selected):hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
                          justifyContent: !open ? 'center' : 'flex-start',
                        }}
                      >
                        <ListItemIcon
                          sx={{ minWidth: 0, justifyContent: 'center', color: 'inherit', width: '40px' }}
                        >
                          {React.cloneElement(item.icon as any, { sx: { color: 'inherit' } })}
                        </ListItemIcon>
                        {open && <ListItemText primary={item.text} />}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            );
          })()}

          <Box sx={{ position: 'absolute', bottom: 0, width: '100%', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <ListItem disablePadding style={{ color: 'white' }}>
              <ListItemButton
                onClick={() => setConfirmLogoutOpen(true)}
                disabled={isLoggingOut}
                sx={{ justifyContent: !open ? 'center' : 'flex-start' }}
              >
                <ListItemIcon
                  style={{
                    marginLeft: !open ? '0' : '0px',
                    width: '40px',
                    minWidth: !open ? '0' : '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    color: 'inherit',
                  }}
                >
                  {isLoggingOut ? (
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                  ) : (
                    <LogoutOutlinedIcon sx={{ color: 'white' }} />
                  )}
                </ListItemIcon>
                {open && <ListItemText primary={isLoggingOut ? 'Logging out...' : 'Logout'} />}
              </ListItemButton>
            </ListItem>
          </Box>
        </Drawer>

        <Main open={open}>
          {/* Top header aligned with the main content area */}
          {(() => {
            let currentPath = pathname === '/' ? '/dashboard' : pathname;
            if (currentPath.startsWith('/admin/dashboard')) currentPath = '/dashboard';
            const current = [...navItems]
              .sort((a, b) => (b.href.length - a.href.length))
              .find((n) => currentPath.startsWith(n.href));
            let title = current?.text || 'Dashboard';
            let trail: string[] = [title];

            return (
              <>
                <NavigineHeader
                  title={title}
                  trail={trail}
                  variant="compact"
                  userName={headerName}
                  userRole={headerRole}
                  offsetLeft={open ? drawerWidth : drawerNarrowWidth}
                  onLogout={() => setConfirmLogoutOpen(true)}
                  canAccessHref={canAccessPath}
                />

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    overflow: 'auto',
                    backgroundColor: 'transparent',
                    mt: '64px',
                  }}
                >
                  {(() => {
                    const well = selectedWell ? selectedWell.split('__')[1] : null;
                    const view = searchParams?.get('view');
                    const isDashboardRoot = pathname === '/' || pathname === '/dashboard' || pathname === '/admin/dashboard';
                    if (!isDashboardRoot) return children;
                    return <PixelAnalyticsDashboard showVideo={false} />;
                  })()}
                </Box>
              </>
            );
          })()}
        </Main>
      </Box>

      {isLoggingOut && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: (theme) => theme.zIndex.modal + 1,
          }}
          aria-label="Logging out"
          role="status"
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={48} sx={{ color: 'white' }} />
            <Typography variant="body2" sx={{ color: 'white' }}>Logging out...</Typography>
          </Box>
        </Box>
      )}

      <Dialog open={confirmLogoutOpen} onClose={() => setConfirmLogoutOpen(false)}>
        <DialogTitle>Log Out?</DialogTitle>
        <DialogContent>
          Are you sure you want to log out? You can sign in again to access the dashboard.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmLogoutOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleLogout} disabled={isLoggingOut}>Log Out</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={logoutSuccess}
        autoHideDuration={2000}
        onClose={() => setLogoutSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setLogoutSuccess(false)} severity="success">
          Logged out successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppLayout;