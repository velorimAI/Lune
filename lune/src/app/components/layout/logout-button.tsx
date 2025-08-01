"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../button";
import { useAuth } from "@/context/AuthContext"; 

export const LogoutButton = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); 
    toast.error("شما با موفقیت خارج شدید", {
      action: {
        label: "بستن",
        onClick: () => {},
      },
    });

    router.push("/auth/login");
  };

  return (
    <Button
      onClick={handleLogout}
      className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 transition rounded-md shadow-sm w-[70px] h-[30px] px-2 hover:cursor-pointer"
    >
      <LogOut className="w-2 h-2" />
      <span className="text-sm">خروج</span>
    </Button>
  );
};
