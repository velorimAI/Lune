"use client";

import { FC } from "react";
import { Info } from "lucide-react";

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
    <div className="space-y-4">
      {data.map((order: Order, index: any) => (
        <div
          key={index}
          className="grid grid-cols-7 bg-white shadow-sm px-4 py-3 text-xs w-full border border-gray-300 rounded-lg items-center gap-2 text-center"
        >
          <div>نام و نام خانوادگی: {order.fullName}</div>
          <div>شماره تلفن: {order.phone}</div>
          <div>تاریخ سفارش: {order.orderDate}</div>
          <div>تاریخ تحویل: {order.deliveryDate}</div>
          <div>شماره پذیرش: {order.orderNumber}</div>
          <div>
            وضعیت:{" "}
            <span
              className={
                order.status === "تسویه نشده"
                  ? "text-red-500"
                  : "text-green-600"
              }
            >
              {order.status}
            </span>
          </div>
          <div className="flex justify-center">
            <Info className="w-4 h-4 text-blue-500" />
          </div>
        </div>
      ))}
    </div>
  );
};
