"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Clock4 } from "lucide-react";
import { toast } from "sonner";
import { LogoutButton } from "./logout-button";
import UserInfo from './user-info';

const toEnglishDigits = (str: string) =>
  str.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

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

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-gray-50 shadow-sm border-b border-blue-200 rounded-b-lg mb-1">
      
      {/* ساعت و تاریخ */}
      <div className="flex items-center gap-3 text-black">
        <Clock4 className="w-5 h-5 text-black" />
        <div className="flex flex-col text-sm leading-tight text-right">
          <span className="font-semibold">{dateTime.date}</span>
          <span className="text-xs text-gray-500">{dateTime.time}</span>
        </div>
      </div>

      {/* اطلاعات کاربر */}
      <UserInfo />

      {/* دکمه خروج */}
      <LogoutButton />
    </div>
  );
}