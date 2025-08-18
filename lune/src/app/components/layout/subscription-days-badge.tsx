"use client";

import { Crown } from "lucide-react";

interface SubscriptionDaysBadgeProps {
  days: number;
}

export default function SubscriptionDaysBadge({ days }: SubscriptionDaysBadgeProps) {
  let bgColor = "bg-green-100 text-green-700";
  let iconColor = "text-green-600";

  if (days <= 30 && days > 10) {
    bgColor = "bg-yellow-100 text-yellow-700";
    iconColor = "text-yellow-600";
  } else if (days <= 10) {
    bgColor = "bg-red-100 text-red-700 animate-pulse";
    iconColor = "text-red-600";
  }

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${bgColor}`}
    >
      <Crown className={`w-4 h-4 ${iconColor}`} />
      <span>{days} روز</span>
    </div>
  );
}
