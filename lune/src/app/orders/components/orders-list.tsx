"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleArrowLeft,
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

export const OrdersList: FC<OrdersListProps> = ({ data, refetch }) => {
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

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="space-y-2">
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
          <div key={index} className="relative">
            <div 
              className={`grid grid-cols-6 bg-gray-50 px-4 py-3 text-xs w-full border border-gray-300 rounded-lg items-center gap-2 text-center transition-all duration-200 cursor-pointer ${
                expandedIndex === index ? "rounded-b-none border-b-0 shadow-md" : "shadow-sm"
              }`}
              onClick={() => toggleDetails(index)}
            >
              {/* ردیف اطلاعات سفارش */}
              <div className="flex items-center gap-1.5 text-gray-800 pointer-events-none">
                <User className="w-5 h-5" />
                <span>{order?.customer_name}</span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-800 pointer-events-none">
                <Phone className="w-5 h-5" />
                <span>{order?.customer_phone}</span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-800 pointer-events-none">
                <CalendarPlus2 className="w-5 h-5" />
                <span>
                  {order?.receptions?.[0]?.reception_date?.split(" ")[0] || "—"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-800 pointer-events-none">
                <CalendarCheck className="w-5 h-5" />
                <span>
                  {order?.latest_unreceived_estimated_arrival_date || "—"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 justify-center text-gray-800 pointer-events-none">
                <DollarSign className="w-5 h-5" />
                <span className={`font-semibold ${getSettlementStyle(order?.settlement_status_overall || "تسویه نشده").color}`}>
                  {order?.settlement_status_overall || "تسویه نشده"}
                </span>
              </div>

              <div className="flex gap-4 justify-center text-gray-700">
                <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                  <DeleteOrder
                    id={String(order?.customer_id)}
                    name={order?.customer_name}
                  />
                </div>

                <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                  <EditOrderModal data={order} refetch={refetch} />
                </div>

                <motion.div
                  animate={expandedIndex === index ? "rotated" : "initial"}
                  variants={{
                    initial: { rotate: 0 },
                    rotated: { rotate: -90 }
                  }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDetails(index);
                  }}
                  className="cursor-pointer pointer-events-auto"
                >
                  <CircleArrowLeft className="w-6 h-6" />
                </motion.div>
              </div>
            </div>

            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                
                  className="overflow-hidden"
                >
                  <div className="border border-gray-300 border-t-0 rounded-b-lg bg-white">
                    <ScrollArea className="w-full h-[300px] 4xl:h-[500px]">
                      <div dir="rtl" className="w-full p-4">
                        <OrderDetails 
                          id={order.customer_id} 
                          order={order} 
                        />
                      </div>
                    </ScrollArea>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))
      )}
    </div>
  );
};