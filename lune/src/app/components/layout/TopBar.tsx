"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Clock4 } from "lucide-react";
import { Button } from "../button";

export default function TopBar() {
  const [dateTime, setDateTime] = useState<{ date: string; time: string }>({
    date: "",
    time: "",
  });
  const router = useRouter();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString("fa-IR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const time = now.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setDateTime({ date, time });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    alert("شما از سیستم خارج شدید");
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md text-sm border-b border-gray-200">
      {/* بخش ساعت و تاریخ */}
      <div className="flex items-center gap-2 text-gray-700">
        <Clock4 className="w-5 h-5 text-blue-500" />
        <div className="flex flex-col leading-tight text-right">
          <span className="font-medium">{dateTime.date}</span>
          <span className="text-xs text-gray-500">{dateTime.time}</span>
        </div>
      </div>

      {/* دکمه خروج */}
      <Button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
      >
        <LogOut className="w-5 h-5" />
        
      </Button>
    </div>
  );
}
