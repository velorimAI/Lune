"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Toaster } from "@/components/ui/sonner";

export const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const hideSidebar = pathname === "/auth/login";

  return (
    <SidebarProvider>
      {!hideSidebar && (
        <>
          <AppSidebar />
        </>
      )}
      <div className={hideSidebar ? "w-full" : "w-full m-2"}>{children}</div>
      <Toaster richColors />
    </SidebarProvider>
  );
};
