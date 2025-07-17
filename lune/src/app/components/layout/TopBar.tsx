"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Clock4 } from "lucide-react";
import { toast } from "sonner";
import { LogoutButton } from "./logout-button";
import UserInfo from "./user-info";

const toEnglishDigits = (str: string) =>
  str.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

const pathToTitle: Record<string, string> = {
  "/orders": "سفارشات",
  "/orders/new": "ثبت سفارش",
  "/settings": "تنظبمات",
  "/admin":"مدیریت",
  "/admin/users":"کاربران",
  "/admin/logs":"سوابق فعالیت",
  "/lost-orders":"قطعات از دست رفته"

};

export default function TopBar() {
  const [dateTime, setDateTime] = useState<{ date: string; time: string }>({
    date: "",
    time: "",
  });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const date = toEnglishDigits(
        now.toLocaleDateString("fa-IR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
      const time = toEnglishDigits(
        now.toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setDateTime({ date, time });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    toast.error(`شما با موفقیت خارج شدید`, {
      action: {
        label: "بستن",
        onClick: () => console.log("Undo"),
      },
    });
    router.push("/auth/login");
  };

  if (pathname === "/auth/login") return null;

  const currentPageTitle = pathToTitle[pathname] || "بدون عنوان";

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 shadow-sm border-b border-blue-200 rounded-b-lg mb-1 text-black text-sm">
     
      <UserInfo />

    
      <div className="font-bold text-lg">{currentPageTitle}</div>

     
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Clock4 className="w-4 h-4" />
          <div className="leading-tight text-xs text-right">
            <div className="font-semibold">{dateTime.date}</div>
            <div className="text-gray-500">{dateTime.time}</div>
          </div>
        </div>

        <Bell className="w-4 h-4 text-gray-600 hover:text-blue-600 cursor-pointer" />

        <LogoutButton />
      </div>
    </div>

  );
}
