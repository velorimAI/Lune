"use client";

import React from "react";
import {
  Box,
  Hash,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  FileText,
  CreditCard,
  Package,
  Grid,
} from "lucide-react";

export interface Item {
  order_id: number;
  piece_name: string;
  part_id: string;
  number_of_pieces: number;
  channel: string;
  market: {
    name: string | null;
    phone: string | null;
  };
  order_date: string;
  predicted_delivery_date: string;
  delivered_date: string | null;
  arrive_duration: string | null;
  estimated_arrival_days: number;
  status: string;
  settlement: string;
  note: string;
  order_number: string;
  dealer_approved: boolean;
}


interface Props {
  data: Item[] | undefined | null;
}

export const ItemsList: React.FC<Props> = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-gray-500">هیچ قطعه‌ای یافت نشد.</div>;
  }

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div
          key={item.order_id}
          className="p-3 border rounded-xl bg-white shadow-sm text-sm text-gray-800 flex flex-col gap-1"
        >
          <div className="flex flex-wrap justify-between gap-2 items-center">
            <div className="flex items-center gap-1">
              <Package size={16} />
              <span className="font-bold">{item.piece_name}</span> ({item.part_id})
            </div>
            <div className="flex items-center gap-1">
              <Grid size={16} />
              تعداد: {item.number_of_pieces}
            </div>
            <div className="flex items-center gap-1">
              <Hash size={16} />
              سفارش: {item.order_number}
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              تاریخ سفارش: {item.order_date}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              تحویل تا {item.predicted_delivery_date}
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              بازار: {item.market?.name || "ندارد"}
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-2 text-gray-600 text-xs pt-1 border-t mt-1">
            <div className="flex items-center gap-1">
              <Box size={14} />
              وضعیت: {item.status}
            </div>
            <div className="flex items-center gap-1">
              <CreditCard size={14} />
              تسویه: {item.settlement}
            </div>
            <div className="flex items-center gap-1">
              <Grid size={14} />
              کانال: {item.channel}
            </div>
            {item.note && (
              <div className="flex items-center gap-1">
                <FileText size={14} />
                {item.note}
              </div>
            )}
            <div className="flex items-center gap-1">
              {item.dealer_approved ? (
                <>
                  <CheckCircle size={14} className="text-green-600" />
                  تایید نمایندگی
                </>
              ) : (
                <>
                  <XCircle size={14} className="text-red-600" />
                  تایید نمایندگی نشده
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
