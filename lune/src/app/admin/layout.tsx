'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { role } = useAuth();  
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (role !== 'مدیریت') {
      router.replace('/orders');
    } else {
      setIsAuthorized(true);
    }
  }, [role, router]); 

  if (!isAuthorized) return null;

  return <>{children}</>;
}
