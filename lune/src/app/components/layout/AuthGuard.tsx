'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    if (!payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicPaths = ['/auth/login', '/register'];
    const isPublic = publicPaths.includes(pathname);

    const checkToken = () => {
      const token = localStorage.getItem('token');

      if (!token && !isPublic) {
        router.replace('/auth/login');
        return;
      }

      if (token && isTokenExpired(token)) {
        localStorage.removeItem('token');
        router.replace('/auth/login');
      }
    };

    // اولین بار بلافاصله چک کنه
    checkToken();

    // بعدش هر 5 ثانیه یکبار
    const interval = setInterval(checkToken, 5000);

    // پاک‌سازی تایمر موقع unmount
    return () => clearInterval(interval);
  }, [pathname]);

  return <>{children}</>;
}
