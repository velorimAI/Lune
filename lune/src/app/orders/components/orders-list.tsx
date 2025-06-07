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
import EditOrderModal, { PartData } from "./edit-orders-SquarePen";
import { OrderDetails } from "./OrderDetails";
import { ScrollArea } from "@/components/ui/scroll-area";

export const OrdersList: FC<OrdersListProps> = ({ data }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleDetails = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const getStatusStyle = (status: string) => {
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

  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case "تسویه شده":
        return {
          color: "text-green-600",
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        };
      case "تسویه نشده":
        return {
          color: "text-red-500",
          icon: <XCircle className="w-5 h-5 text-red-500" />,
        };
      default:
        return {
          color: "text-gray-500",
          icon: <HelpCircle className="w-5 h-5 text-gray-500" />,
        };
    }
  };

  /**
   * تابعی که پس از ویرایش یک قطعه فراخوانی می‌شود.
   * در این‌جا با updatedPart می‌توانید به بک‌اند درخواست PUT/POST بزنید یا در صورت نیاز در State محلی، داده‌ها را به‌روزرسانی کنید.
   */
  const handlePartUpdate = async (
    orderIndex: number,
    updatedPart: PartData
  ) => {
    console.log(
      `قطعه با آیدی ${updatedPart.part_id} از سفارش شماره ${orderIndex} به‌روز شد:`,
      updatedPart
    );
    // در صورت نیاز به به‌روزرسانی State محلی:
    // const newData = [...ordersData];
    // newData[orderIndex].receptions = newData[orderIndex].receptions.map((reception) => ({
    //   ...reception,
    //   orders: reception.orders.map((p: any) =>
    //     p.part_id === updatedPart.part_id ? { ...updatedPart } : p
    //   ),
    // }));
    // setOrdersData(newData);

    // در صورت نیاز به ارسال به سرور:
    // await fetch(`/api/orders/${yourOrderId}/parts/${updatedPart.part_id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(updatedPart),
    // });
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
          // استخراج لیست کامل قطعات از تمام receptions
          const allParts: PartData[] =
            order?.receptions
              ?.flatMap((reception) =>
                reception.orders.map((p: any) => ({
                  order_id: p.order_id,
                  piece_name: p.piece_name,
                  order_channel: p.order_channel,
                  number_of_pieces: p.number_of_pieces,
                  status: p.status as PartData["status"],
                  order_date: p.order_date,
                  estimated_arrival_days: p.estimated_arrival_days,
                  part_id: p.part_id,
                  settlement_status: p.settlement_status as PartData["settlement_status"],
                }))
              ) || [];

          return (
            <div key={index} className="space-y-2">
              {/* ردیف خلاصه سفارش */}
              <div className="grid grid-cols-6 bg-gray-50 shadow-sm px-4 py-3 text-xs w-full border border-gray-300 rounded-lg items-center gap-2 text-center">
                {/* نام مشتری */}
                <div className="flex items-center gap-1.5 text-gray-800">
                  <User className="w-5 h-5" />
                  <span>{order?.customer_name}</span>
                </div>

                {/* تلفن مشتری */}
                <div className="flex items-center gap-1.5 text-gray-800">
                  <Phone className="w-5 h-5" />
                  <span>{order?.customer_phone}</span>
                </div>

                {/* اولین تاریخ دریافت نشده (Reception Date) */}
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

                {/* Latest Unreceived Estimated Arrival Date */}
                <div className="flex items-center gap-1.5 text-gray-800">
                  <CalendarCheck className="w-5 h-5" />
                  <span>
                    {order?.latest_unreceived_estimated_arrival_date
                      ? order.latest_unreceived_estimated_arrival_date
                      : "—"}
                  </span>
                </div>

                {/* وضعیت تسویه کلی */}
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

                {/* عملیات: حذف سفارش، ویرایش قطعات، باز/بسته کردن جزئیات */}
                <div className="flex gap-4 justify-center text-gray-700">
                  <DeleteOrder
                    id={String(order?.customer_id)}
                    name={order?.customer_name}
                  />

                  {/* مودال ویرایش قطعه‌ها */}
                  <EditOrderModal
                    parts={allParts}
                    onSave={async (updatedPart) => {
                      await handlePartUpdate(index, updatedPart);
                    }}
                  />

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

              {/* بخش جزئیات قطعات */}
              {expandedIndex === index &&
                <ScrollArea className="max-h-[300px]  overflow-auto border rounded-md p-2" dir="rtl">
                  <OrderDetails order={order} />
                </ScrollArea>
              }
            </div>
          );
        })
      )}
    </div>
  );
};