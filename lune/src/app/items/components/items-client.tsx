'use client';


import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Item, ItemsList } from "./items-list";
import { getItemsList } from "@/app/apis/orders/orderService";


export const ItemsClient = () => {
  const {
    data: items,
    isLoading,
    isError,
  } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const data = await getItemsList(token);

      if (data && typeof data === "object") {
        return Object.values(data);
      } else {
        throw new Error("Invalid data format");
      }
    },
  });

  if (isError) {
    return (
      <Card title="لیست قطعات">
        <div className="p-4 text-red-500">خطا در دریافت قطعات، دوباره تلاش کنید.</div>
      </Card>
    );
  }

  return (
    <Card title={`لیست قطعات ${items?.length ? `(${items.length})` : ""}`}>
      <div className="p-4 space-y-2">
        {isLoading ? (
          // 🔻 اسکلتون برای حالت لودینگ
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-xl" />
          ))
        ) : (
          <ItemsList data={items} />
        )}
      </div>
    </Card>
  );
};
