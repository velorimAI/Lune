'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const publicPaths = ['/auth/login', '/register'];
    const isPublic = publicPaths.includes(pathname);

    if (!token && !isPublic) {
      router.replace('/auth/login');
    }
  }, [pathname]);

  return <>{children}</>;
}
