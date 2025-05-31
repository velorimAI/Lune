"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../button";
 

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("lastname");

    
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
      className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 transition px-3 py-1.5 rounded-md shadow-sm"
    >
      <LogOut className="w-4 h-4" />
      <span className="text-sm">خروج</span>
    </Button>
  );
};
