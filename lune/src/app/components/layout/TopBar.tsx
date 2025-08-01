"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {  Clock4 } from "lucide-react";
import { LogoutButton } from "./logout-button";
import UserInfo from "./user-info";
import { useQuery } from "@tanstack/react-query";
import { getSubscription } from "@/app/apis/dealers/dealersServices";
import SubscriptionDaysBadge from "./subscription-days-badge";
import DealerInfo from "./dealer-info";
import ToolTip from "../custom-tooltip";

const toEnglishDigits = (str: string) =>
  str.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

const pathToTitle: Record<string, string> = {
  "/orders": "سفارشات",
  "/orders/new": "ثبت سفارش",
  "/settings": "تنظیمات",
  "/admin": "مدیریت",
  "/admin/users": "کاربران",
  "/admin/logs": "سوابق فعالیت",
  "/lost-orders": "قطعات از دست رفته"
};

export default function TopBar() {
  const [dateTime, setDateTime] = useState<{ date: string; time: string }>({
    date: "",
    time: "",
  });

  const pathname = usePathname();


  const { data, isLoading, isError } = useQuery({
    queryKey: ["getSubscription"],
    queryFn: getSubscription,
  });

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


  if (pathname === "/auth/login") return null;
  if (isLoading) return <div className="text-xs text-gray-400">در حال بارگذاری...</div>;
  if (isError || !data) return null;

  const { dealer_name, dealer_code, remaining_subscription } = data;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 shadow-sm border-b border-blue-200 rounded-b-lg mb-1 text-black text-sm">

        <ToolTip
          hint={
            <DealerInfo dealerName={dealer_name} dealerCode={dealer_code} />
          }
        >
          <UserInfo />
        </ToolTip>

      <div className="font-bold text-lg">{pathToTitle[pathname] || "بدون عنوان"}</div>

      <div className="flex items-center gap-3">
        <SubscriptionDaysBadge days={remaining_subscription} />
        <div className="flex items-center gap-2">
          <Clock4 className="w-5 h-5" />
          <div className="leading-tight text-xs text-right">
            <div className="font-semibold">{dateTime.date}</div>
            <div className="text-gray-500">{dateTime.time}</div>
          </div>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
