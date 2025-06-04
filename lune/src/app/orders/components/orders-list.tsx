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
  SquarePen,
  Ban,
  HelpCircle,
  DollarSign,
  CalendarCheck,
} from "lucide-react";
import { DeleteItem } from "./delete-items";
import { DeleteOrder } from "./DeleteOrderButton";
import { OrdersListProps } from "@/types/orders.d.type";

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
        data.map((order, index) => (
          <div key={index} className="space-y-2">
            {/* Main summary row now has 7 columns (grid-cols-7) */}
            <div className="grid grid-cols-6 bg-gray-50 shadow-sm px-4 py-3 text-xs w-full border border-gray-300 rounded-lg items-center gap-2 text-center">
              {/* Customer Name */}
              <div className="flex items-center gap-1.5 text-gray-800">
                <User className="w-5 h-5" />
                <span>{order?.customer_name}</span>
              </div>

              {/* Customer Phone */}
              <div className="flex items-center gap-1.5 text-gray-800">
                <Phone className="w-5 h-5" />
                <span>{order?.customer_phone}</span>
              </div>

              {/* Latest Unreceived Estimated Arrival Date */}
              <div className="flex items-center gap-1.5 text-gray-800">
                <CalendarPlus2 className="w-5 h-5" />
                <span>
                  {
                    (() => {
                      const receptions = order?.receptions || [];

                      const sorted = receptions
                        .filter(r => r.reception_date)
                        .sort((a, b) => a.reception_date.localeCompare(b.reception_date));

                      return sorted.length
                        ? sorted[0].reception_date.split(" ")[0] // فقط بخش تاریخ بدون زمان
                        : "—";
                    })()
                  }
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



              {/* Settlement Status */}
              <div className="flex items-center gap-1.5 justify-center text-gray-800">
                <DollarSign className="w-5 h-5" />
                <span
                  className={`font-semibold ${getSettlementStyle(
                    order?.settlement_status_overall || "تسویه نشده"
                  ).color
                    }`}
                >
                  {order?.settlement_status_overall || "تسویه نشده"}
                </span>
              </div>

              {/* Actions: DeleteOrder, Edit, Expand/Collapse */}
              <div className="flex gap-4 justify-center text-gray-700">
                <DeleteOrder
                  id={String(order?.customer_id)}
                  name={order?.customer_name}
                />
                <SquarePen className="cursor-pointer hover:text-blue-600" />
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

            {/* Expanded Details Section */}
            {expandedIndex === index && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md mt-2">
                <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold text-lg">
                <Wrench className="w-5 h-5" />
                <span>
                  جزئیات قطعات
                  {" "}
                  (
                  {
                    order?.receptions
                      ?.flatMap(reception => reception.orders || [])
                      ?.length || 0
                  }
                  )
                </span>
              </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-right text-gray-800">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="px-4 py-2 font-medium whitespace-nowrap">
                          نام قطعه
                        </th>
                        <th className="px-4 py-2 font-medium whitespace-nowrap">
                          کد قطعه
                        </th>
                        <th className="px-4 py-2 font-medium whitespace-nowrap">
                          تعداد
                        </th>
                        <th className="px-4 py-2 font-medium whitespace-nowrap">
                          نوع سفارش
                        </th>
                        <th className="px-4 py-2 font-medium whitespace-nowrap">
                          تاریخ سفارش
                        </th>
                        <th className="px-4 py-2 font-medium whitespace-nowrap">
                          رسیدن (روز)
                        </th>
                        <th className="px-4 py-2 font-medium whitespace-nowrap">
                          وضعیت تحویل
                        </th>
                        <th className="px-4 py-2 font-medium whitespace-nowrap">
                          وضیعت پرداخت
                        </th>
                        <th className="px-4 py-2 font-medium whitespace-nowrap"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {order?.receptions
                        ?.flatMap((reception) => reception.orders)
                        ?.map((part, i) => (
                          <tr
                            key={i}
                            className={`border-b border-gray-200 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }`}
                          >
                            <td className="px-4 py-3 flex items-center gap-1.5 font-medium whitespace-nowrap text-gray-800">
                              <PackageOpen className="w-5 h-5 text-gray-600" />
                              {part?.piece_name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                              {part?.part_id}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                              {part?.number_of_pieces}
                            </td>
                            <td className="px-4 py-3 font-semibold whitespace-nowrap text-gray-700">
                              {part?.order_channel}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                              {part?.order_date?.split(" ")[0]}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                              {part?.estimated_arrival_days}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-bold">
                              <div className="flex items-center gap-1.5">
                                {(() => {
                                  const { color, icon } = getStatusStyle(part.status);
                                  return (
                                    <>
                                      {icon}
                                      <span className={`${color}`}>{part.status}</span>
                                    </>
                                  );
                                })()}
                              </div>
                            </td>

                            <td className="px-4 py-3 whitespace-nowrap font-bold">
                              <div className="flex items-center gap-1.5">
                                {(() => {
                                  const { color, icon } = getPaymentStatusStyle(part?.settlement_status);
                                  return (
                                    <>
                                      {icon}
                                      <span className={`${color}`}>{part?.settlement_status}</span>
                                    </>
                                  );
                                })()}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center whitespace-nowrap">
                              <DeleteItem
                                id={String(part?.order_id)}
                                name={part?.piece_name}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
