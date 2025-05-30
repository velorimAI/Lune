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
    { title: "جست و جو", url: "#", icon: Search,  sidbar: true}
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
      <SidebarHeader className="flex gap-0 justify-start items-end relative">
        <CustomSidebarTrigger
          className={`${
            state === "expanded" ? "mt-3" : "mt-0.5"
          } text-secondaryBlue absolute left-0 z-50 !border-1 border-secondaryBlue`}
        />
        <div className=" w-full my-3 flex justify-center">
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

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary
          className="mt-auto"
          items={data.navSecondary}
        />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
