"use client";

import { FC, useState } from "react";
import {
  CircleArrowLeft,
  CircleArrowDown,
  User,
  Phone,
  CalendarPlus2,
  CalendarCheck,
  FileDigit,
  FileQuestion,
  PackageOpen,
  Wrench,
  XCircle,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";

export const OrdersList: FC<OrdersListProps> = ({ data }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleDetails = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 bg-white border border-gray-200 rounded-3xl shadow-xl">
          <div className="bg-gray-100 rounded-full p-4 shadow-inner mb-6">
            <ShoppingCart className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2 tracking-tight">
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
            <div className="grid grid-cols-7 bg-gray-50 shadow-sm px-4 py-3 text-xs w-full border border-gray-300 rounded-lg items-center gap-2 text-center">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{order?.fullName}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>{order?.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <CalendarPlus2 className="w-5 h-5" />
                <span>{order?.orderDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5" />
                <span>{order.deliveryDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <FileDigit className="w-5 h-5" />
                <span>{order?.orderNumber}</span>
              </div>

              <div className="flex items-center gap-2">
                <FileQuestion className="w-5 h-5" />
                <span
                  className={
                    order.status === "تسویه نشده"
                      ? "text-red-500 font-bold"
                      : "text-green-600 font-bold"
                  }
                >
                  {order?.status}
                </span>
              </div>

              <div className="flex justify-center">
                {expandedIndex === index ? (
                  <CircleArrowDown
                    className="w-6 h-5 cursor-pointer transition-transform duration-200 scale-125 text-blue-600"
                    onClick={() => toggleDetails(index)}
                  />
                ) : (
                  <CircleArrowLeft
                    className="w-6 h-5 cursor-pointer transition-transform duration-200"
                    onClick={() => toggleDetails(index)}
                  />
                )}
              </div>
            </div>
            {expandedIndex === index && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md mt-2">
                <div className="flex items-center gap-3 mb-4 text-gray-900 font-semibold text-lg">
                  <Wrench className="w-5 h-5 text-gray-700" />
                  <span>جزئیات قطعات</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-right text-gray-800">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="px-4 py-2 font-medium whitespace-nowrap">
                          نام قطعه
                        </th>
                        <th className="px-4 py-2 font-medium whitespace-nowrap">
                          نوع سفارش
                        </th>
                        <th className="px-4 py-2 font-medium whitespace-nowrap">
                          تعداد
                        </th>
                        <th className="px-4 py-2 font-medium whitespace-nowrap">
                          وضعیت تحویل
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order?.items?.map((part, i) => (
                        <tr
                          key={i}
                          className={`border-b border-gray-200 ${
                            i % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <td className="px-4 py-3 flex items-center gap-2 font-medium text-black whitespace-nowrap">
                            <PackageOpen className="w-5 h-5 text-gray-500" />
                            {part.partName}
                          </td>

                          <td className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                            {part.orderType}
                          </td>

                          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                            {part.quantity}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap flex items-center gap-2 font-bold">
                            {part.deliveryStatus === "رسیده" ? (
                              <>
                                <CheckCircle className="w-5 h-5 " />
                                <span className="">{part.deliveryStatus}</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 text-red-400" />
                                <span className="text-red-400">
                                  {part.deliveryStatus}
                                </span>
                              </>
                            )}
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
