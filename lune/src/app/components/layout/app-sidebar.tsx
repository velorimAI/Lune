'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChartColumn,
  Search,
  Settings,
  ClipboardList,
  Package,
} from "lucide-react";
import Image from "next/image";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";

const data = {
  navMain: [
    { title: "داشبورد", url: "#", icon: ChartColumn },
    { title: "سفارش ها", url: "/orders", icon: ClipboardList },
    { title: " قطعات", url: "/items", icon: Package }, 
  ],
  navSecondary: [
    { title: "تنظیمات", url: "settings", icon: Settings, sidbar: true },
  ],
};

export function AppSidebar() {
  const { state } = useSidebar();

  return (
    <Sidebar className="max-xl:w-[10rem]" collapsible="icon">

      <SidebarHeader className="flex flex-col justify-center items-center pt-10 pb-4">
        <div className="flex justify-center items-center w-full">
          <Image
            alt="App logo"
            className="rounded-full cursor-pointer"
            src={
              state === "expanded"
                ? "/img/logo/logo-lune.jpg"
                : "/img/logo/fix-logo.jpg"
            }
            width={state === "expanded" ? 80 : 60}
            height={state === "expanded" ? 80 : 60}
            priority
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <NavMain items={data.navMain} />
        <NavSecondary className="mt-auto" items={data.navSecondary} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
