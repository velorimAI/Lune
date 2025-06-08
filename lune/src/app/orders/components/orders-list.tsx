"use client";

import { FC, useState } from "react";
import {
  CircleArrowLeft,
  CircleArrowDown,
  User,
  Phone,
  CalendarPlus2,
  PackageOpen,
  Wrench,
  XCircle,
  CheckCircle,
  ShoppingCart,
  Ban,
  HelpCircle,
  DollarSign,
  CalendarCheck,
} from "lucide-react";
import { DeleteItem } from "./delete-items";
import { DeleteOrder } from "./DeleteOrderButton";
import { OrdersListProps } from "@/types/orders.d.type";
import EditOrderModal from "./edit-orders-SquarePen";
import { OrderDetails } from "./OrderDetails";
import { ScrollArea } from "@/components/ui/scroll-area";

export const OrdersList: FC<OrdersListProps> = ({ data , refetch}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleDetails = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const getSettlementStyle = (settlement: string) => {
    switch (settlement) {
      case "تسویه شده":
        return { color: "text-green-600" };
      case "تسویه نشده":
        return { color: "text-red-500" };
      default:
        return { color: "text-gray-500" };
    }
  };

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 bg-white border border-gray-200 rounded-3xl shadow-xl">
          <div className="bg-gray-100 rounded-full p-4 shadow-inner mb-6">
            <ShoppingCart className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            سفارشی یافت نشد
          </h3>
          <p className="text-base text-gray-500 text-center max-w-xs">
            در حال حاضر هیچ سفارشی برای نمایش وجود ندارد. لطفاً بعداً دوباره
            بررسی کنید.
          </p>
        </div>
      ) : (
        data.map((order, index) => {
          return (
            <div key={index} className="space-y-2">

              <div className="grid grid-cols-6 bg-gray-50 shadow-sm px-4 py-3 text-xs w-full border border-gray-300 rounded-lg items-center gap-2 text-center">

                <div className="flex items-center gap-1.5 text-gray-800">
                  <User className="w-5 h-5" />
                  <span>{order?.customer_name}</span>
                </div>


                <div className="flex items-center gap-1.5 text-gray-800">
                  <Phone className="w-5 h-5" />
                  <span>{order?.customer_phone}</span>
                </div>

                <div className="flex items-center gap-1.5 text-gray-800">
                  <CalendarPlus2 className="w-5 h-5" />
                  <span>
                    {(() => {
                      const receptions = order?.receptions || [];
                      const sorted = receptions
                        .filter((r) => r.reception_date)
                        .sort((a, b) =>
                          a.reception_date.localeCompare(b.reception_date)
                        );
                      return sorted.length
                        ? sorted[0].reception_date.split(" ")[0]
                        : "—";
                    })()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-gray-800">
                  <CalendarCheck className="w-5 h-5" />
                  <span>
                    {order?.latest_unreceived_estimated_arrival_date
                      ? order.latest_unreceived_estimated_arrival_date
                      : "—"}
                  </span>
                </div>


                <div className="flex items-center gap-1.5 justify-center text-gray-800">
                  <DollarSign className="w-5 h-5" />
                  <span
                    className={`font-semibold ${getSettlementStyle(
                      order?.settlement_status_overall || "تسویه نشده"
                    ).color}`}
                  >
                    {order?.settlement_status_overall || "تسویه نشده"}
                  </span>
                </div>


                <div className="flex gap-4 justify-center text-gray-700">
                  <DeleteOrder
                    id={String(order?.customer_id)}
                    name={order?.customer_name}
                  />


                  <EditOrderModal data={order} refetch={refetch}/>

                  {expandedIndex === index ? (
                    <CircleArrowDown
                      className="w-6 h-5 cursor-pointer text-blue-600"
                      onClick={() => toggleDetails(index)}
                    />
                  ) : (
                    <CircleArrowLeft
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => toggleDetails(index)}
                    />
                  )}
                </div>
              </div>


              {expandedIndex === index &&
                <ScrollArea className="w-full flex flex-col justify-start items-center pr-3 h-[300px] 4xl:h-[500px] mt-2">
                  <div dir="rtl" className="w-full">
                    <OrderDetails order={order} />
                  </div>
                </ScrollArea>
              }

            </div>
          );
        })
      )}
    </div>
  );
};