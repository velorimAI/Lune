"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";


function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payloadJson = atob(parts[1]);
    const payload = JSON.parse(payloadJson);

    if (!payload.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return false;
  }
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, logout } = useAuth();

  useEffect(() => {
    const publicPaths = ["/auth/login", "/register"];
    const isPublic = publicPaths.includes(pathname);

    const checkToken = () => {
      if (!token && !isPublic) {
        router.replace("/auth/login");
        return;
      }
      if (token && isTokenExpired(token)) {
        console.log("Token expired for user:", token);
        logout();
        router.replace("/auth/login");
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 5000);

    return () => clearInterval(interval);
  }, [pathname, token, logout, router]);

  return <>{children}</>;
}
