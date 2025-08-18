"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface HotkeyRedirectProps {
  keyCode?: string;
  redirectTo: string;
}

export const HotkeyRedirect = ({ keyCode = "Escape", redirectTo }: HotkeyRedirectProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === keyCode) {
        router.push(redirectTo);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyCode, redirectTo, router]);

  return null;
};
