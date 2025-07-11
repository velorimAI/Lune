// app/components/order-list.tsx
"use client";

import { Card } from "@/app/components/card";
import { Button } from "@/app/components/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ItemList } from "./item-list";

interface OrderItem {
  part_id: string;
  piece_name: string;
  number_of_pieces: number;
  order_channel: string;
  market_name?: string | null;
  market_phone?: string | null;
  order_number: string;
  estimated_arrival_days: number;
  status?: string;
  settlement_status?: string;
  description?: string;
  dealer_approved?: boolean;
}

interface OrderListProps {
  items: OrderItem[];
  onDelete: (index: number) => void;
  onSubmit: () => void;
  isPending: boolean;
  resetCustomerForm: () => void;
}

export default function OrderList({
  items,
  onDelete,
  onSubmit,
  isPending,
  resetCustomerForm,
}: OrderListProps) {
  return (
    <Card
      title="قطعات ثبت شده :"
      className="h-full flex flex-col p-1"
      contentClassName="h-full flex flex-col justify-between"
    >
      <ScrollArea className="w-full max-h-[565px]">
        <div dir="rtl" className="w-full">
          <ItemList data={items} onDelete={onDelete} />
        </div>
        <ScrollBar />
      </ScrollArea>

      {items.length > 0 && (
        <div className="mt-3 px-3 pb-4">
          <Button
            className="w-full"
            disabled={isPending}
            isLoading={isPending}
            onClick={() => {
              onSubmit();             // ارسال نهایی سفارش‌ها
              resetCustomerForm();    // ریست فرم اطلاعات مشتری پس از ثبت نهایی
            }}
          >
            ثبت نهایی
          </Button>
        </div>
      )}
    </Card>
  );
}
