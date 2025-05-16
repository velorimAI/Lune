"use client";

import { FC } from "react";
import { CircleArrowLeft } from "lucide-react";
import { User, Phone } from "lucide-react";
import { CalendarPlus2 } from "lucide-react";
import { CalendarCheck } from "lucide-react";
import { FileDigit } from "lucide-react";
import { FileQuestion } from "lucide-react";

interface Order {
  fullName: string;
  phone: string;
  orderDate: string;
  deliveryDate: string;
  orderNumber: string;
  status: "تسویه نشده" | "تسویه شده";
}

interface OrdersListProps {
  data: Record<any, any>;
}

export const OrdersList: FC<OrdersListProps> = ({ data }) => {
  return (
    <div className="space-y-4 ">
      {data.map((order: Order, index: any) => (
        <div
          key={index}
          className="grid grid-cols-7 bg-gray-50 shadow-sm px-4 py-3 text-xs w-full border border-gray-300 rounded-lg items-center gap-2 text-center"
        >
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>نام و نام خانوادگی: {order.fullName}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            <span>شماره تلفن: {order.phone}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarPlus2 className="w-5 h-5" />
            <span>تاریخ سفارش: {order.orderDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5" />
            <span>تاریخ تحویل: {order.deliveryDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <FileDigit className="w-5 h-5" />
            <span>شماره پذیرش: {order.orderNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <FileQuestion className="w-5 h-5" />
            <span>وضعیت:</span>
            <span
              className={
                order.status === "تسویه نشده"
                  ? "text-red-500 font-bold"
                  : "text-green-600 font-bold"
              }
            >
              {order.status}
            </span>
          </div>

          <div className="flex justify-center">
            <CircleArrowLeft className="w-6 h-5" />
          </div>
          {/* <div className="flex justify-center">
            <Info className="w-4 h-4 text-blue-500" />
          </div> */}
        </div>
      ))}
    </div>
  );
};
