"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleArrowLeft,
  User,
  Phone,
  CalendarPlus2,
  ShoppingCart,
  CalendarCheck,
  Check,
  FileDigit,
} from "lucide-react";
import { DeleteOrder } from "./DeleteOrderButton";
import { OrdersListProps } from "@/types/orders.d.type";
import { OrderDetails } from "./OrderDetails";
import { extractMonthDay } from "@/app/utils/extractMonthlyDay";

export const OrdersList: FC<OrdersListProps> = ({ data, refetch , currentTab}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleDetails = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleArrowClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    toggleDetails(index);
  };

  const displayDates = (order: any) => {
    const earliestDate = order.earliest_unreceived_estimated_arrival_date;
    const latestDate = order.latest_unreceived_estimated_arrival_date;

    const earliestMonthDay = earliestDate ? extractMonthDay(earliestDate) : null;
    const latestMonthDay = latestDate ? extractMonthDay(latestDate) : null;

    if (earliestDate && latestDate) {
      if (earliestDate === latestDate) return earliestDate;
      return `${latestMonthDay} - ${earliestMonthDay}`;
    }
    if (earliestDate) return earliestDate;
    if (latestDate) return latestDate;
    return <Check className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 bg-white border border-gray-200 rounded-3xl shadow-xl">
          <div className="bg-gray-100 rounded-full p-4 shadow-inner mb-6">
            <ShoppingCart className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">سفارشی یافت نشد</h3>
          <p className="text-base text-gray-500 text-center max-w-xs">
            در حال حاضر هیچ سفارشی برای نمایش وجود ندارد. لطفاً بعداً دوباره بررسی کنید.
          </p>
        </div>
      ) : (
        data.map((order, index) => {
          const receptions = order?.receptions || [];
          const sorted = receptions
            .filter((r: any) => r.reception_date)
            .sort((a: any, b: any) =>
              a.reception_date.localeCompare(b.reception_date)
            );
          const firstReception = sorted.length ? sorted[0] : null;

          // Combine all reception numbers separated by '/'
          const receptionNumbers = sorted
            .map((r: any) => r.reception_number)
            .filter(Boolean)
            .join(" / ") || "—";

          return (
            <div
              key={order.customer_id ?? index}
              className="bg-gray-50 border border-gray-200 rounded-xl shadow-md overflow-hidden"
            >
              <div
                onClick={() => toggleDetails(index)}
                className={`grid grid-cols-6 px-4 py-3 text-sm cursor-pointer transition hover:bg-gray-100 ${
                  expandedIndex === index ? "bg-gray-100 border-b" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800">{order?.customer_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800">{order?.customer_phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileDigit className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800">{receptionNumbers}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarPlus2 className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800">
                    {firstReception
                      ? firstReception.reception_date.split(" ")[0]
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800">{displayDates(order)}</span>
                </div>
                <div
                  className="flex justify-center items-center mr-auto gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DeleteOrder
                    id={String(order?.customer_id)}
                    name={order?.customer_name}
                  />
                  {/* <EditOrderModal data={order} refetch={refetch} /> */}
                  <motion.div
                    className="cursor-pointer ml-2"
                    onClick={(e) => handleArrowClick(e, index)}
                    whileHover={{ scale: 1.1 }}
                    animate={expandedIndex === index ? "rotated" : "initial"}
                    variants={{
                      initial: { rotate: 0 },
                      rotated: { rotate: -90 },
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <CircleArrowLeft
                      className={`w-6 h-6 transition-colors duration-200 ${
                        expandedIndex === index
                          ? "text-blue-500"
                          : "text-gray-500"
                      } hover:text-blue-500`}
                    />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-gray-100"
                  >
                    <div className="px-3 pt-2 pb-4 max-h-[350px] overflow-y-auto rounded-b-xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      <OrderDetails order={order} id={order.customer_id} refetch={refetch} selectable={true}   currentTab={currentTab}/>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })
      )}
    </div>
  );
};