import { CheckCircle, XCircle, Ban, HelpCircle } from "lucide-react";

export const getStatusStyle = (status: string) => {
  switch (status) {
    case "دریافت شده":
      return {
        color: "text-green-600",
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      };
    case "دریافت‌ نشده":
      return {
        color: "text-yellow-500",
        icon: <XCircle className="w-5 h-5 text-yellow-500" />,
      };
    case "ابطال شده":
      return {
        color: "text-red-500",
        icon: <Ban className="w-5 h-5 text-red-500" />,
      };
    case "لغو شده":
      return {
        color: "text-gray-400",
        icon: <HelpCircle className="w-5 h-5 text-gray-400" />,
      };
    default:
      return { color: "text-gray-600", icon: null };
  }
};

export const getSettlementStyle = (settlement: string) => {
  switch (settlement) {
    case "تسویه شده":
      return { color: "text-green-600" };
    case "تسویه نشده":
      return { color: "text-red-500" };
    default:
      return { color: "text-gray-500" };
  }
};

export const getPaymentStatusStyle = getStatusStyle;
