'use client';

// Redux Integration
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store';

// Material-UI
import CssBaseline from '@mui/material/CssBaseline';

// Global CSS and React Activity
import "react-activity/dist/library.css";
import "./globals.css";

// shadcn Sidebar Components
import { SidebarProvider } from '@/components/ui/sidebar';

// Updated AppLayOut
import AppLayOut from "@/app/page";

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import NoInternet from './No-Inter-Net/NoInternet';

import '@/il8n';

const RootLayout = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();

  // Check if current route requires SidebarProvider
  const excludesSidebar = ["/login", "/register", "/forgot-password", "/verify-code", "/new-password"]; // Auth pages: render without dashboard shell
  const requiresSidebar = !excludesSidebar.includes(pathName);

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(window.navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <title>Domino's - Admin</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#E92137" />
      </head>
      <body suppressHydrationWarning={true} className='font-Mulish'>
        {isOnline ? null : <NoInternet />}
        <Toaster
          position="top-right"
          reverseOrder={true}
        />
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            {/* Conditionally wrap SidebarProvider */}
            {requiresSidebar ? (
              <SidebarProvider>
                <CssBaseline />
                <AppLayOut>{children}</AppLayOut>
              </SidebarProvider>
            ) : (
              // For auth pages, render children directly without dashboard shell
              <>
                <CssBaseline />
                {children}
              </>
            )}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
