"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Clock4 } from "lucide-react";
import { toast } from "sonner";
import { LogoutButton } from "./logout-button";
import UserInfo from "./user-info";

const toEnglishDigits = (str: string) =>
  str.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

// نقشه تبدیل مسیر به نام صفحه
const pathToTitle: Record<string, string> = {
  "/orders": "سفارشات",
  "/items": "قطعات",
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
    <div className="flex justify-between items-center px-6 py-3 bg-gray-50 shadow-sm border-b border-blue-200 rounded-b-lg mb-1">
      {/* Right section: User info */}
      <div className="flex items-center gap-4">
        <UserInfo />
      </div>

      {/* Center: Page title */}
      <div className="text-center text-black font-bold text-lg">
        {currentPageTitle}
      </div>

      {/* Left section: Time, Date, Notification, Logout */}
      <div className="flex items-center gap-4 text-black">
        <div className="flex items-center gap-2">
          <Clock4 className="w-5 h-5 text-black" />
          <div className="flex flex-col text-sm leading-tight text-right">
            <span className="font-semibold">{dateTime.date}</span>
            <span className="text-xs text-gray-500">{dateTime.time}</span>
          </div>
        </div>

        <div className="relative cursor-pointer hover:text-blue-600">
          <Bell className="w-5 h-5 text-gray-600" />
        </div>

        <LogoutButton />
      </div>
    </div>
  );
}
