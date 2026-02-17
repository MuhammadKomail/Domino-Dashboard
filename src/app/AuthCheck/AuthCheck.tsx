'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

export default function AuthCheck(): null {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            const authToken = getCookie('AuthToken');
            const UserAuthenticated = getCookie('UserAuthenticated');
            const user_object = getCookie('user_object');

            if (!authToken && !UserAuthenticated && !user_object) {
                // Clear all cookies
                document.cookie.split(';').forEach((cookie) => {
                    const cookieName = cookie.split('=')[0].trim();
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                });

                // Redirect to login page
                router.replace('/login');
            }
        }, 1000); // Check every 1 second

        return () => clearInterval(interval);
    }, [router]);

    return null;
}
