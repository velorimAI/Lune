import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChartColumn ,
  Search,
  Settings,
  ClipboardList,
  User
} from "lucide-react";
import { CustomSidebarTrigger } from "../custom-sidebar-trigger";
import Image from "next/image";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";

const data = {
  navMain: [
    { title: "داشبورد", url: "#", icon: ChartColumn },
    { title: "سفارش ها", url: "/orders", icon: ClipboardList },
 
  ],
  navSecondary: [
    { title: "کاربر", url: "/auth/login", icon: User , sidbar: true,},
    { title: "تنظیمات", url: "settings", icon: Settings , sidbar: true,},
    // {
    //   disabled: true,
    //   icon: CreditCard,
    //   sidbar: true,
    //   title: 'Subscription',
    //   url: '/client/subscription',
    //   permissions: ['Admin', 'Limited'],
    // },
  ],
};

export function AppSidebar() {
  const { state } = useSidebar();

  return (
    <Sidebar className="max-xl:w-[10rem]" collapsible="icon">
 
  <div className="relative w-full">
    <CustomSidebarTrigger
      className="absolute top-2 left-2 z-50 text-secondaryBlue !border-1 border-secondaryBlue"
    />
  </div>

  
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
