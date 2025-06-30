"use client";

import { FC, useMemo, useState } from "react";
import { OrdersList } from "./components/orders-list";
import { useStaticSearchDevices } from "./hooks/use-static-search-devices";
import { SearchBox } from "../components/table/search-box";
import { Card } from "../components/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CirclePlus } from "lucide-react";
import { getOrdersList } from "../apis/orders/orderService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const sortOptions = [
  { value: "default", label: "مرتب‌سازی پیش‌فرض" },
  { value: "name", label: "مرتب‌سازی بر اساس تاریخ سفارش" },
  { value: "receptionDate", label: "مرتب‌سازی بر اساس تاریخ پذیرش" },
];

const Orders: FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const router = useRouter();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrdersList,
  });

  const filteredDataList = useStaticSearchDevices(data?.data || [], searchText);

  const handleSearch = (value?: string) => {
    setSearchText(value || "");
  };

  const tabCounts = useMemo(() => {
    const allOrders = data?.data || [];
    const settledOrders = allOrders.filter((item: any) => {
      const status = item.settlement_status_overall?.toString().trim().toLowerCase();
      return status?.includes("تسویه") && status?.includes("شده") && !status?.includes("ن");
    });
    const notSettledOrders = allOrders.filter((item: any) => {
      const status = item.settlement_status_overall?.toString().trim().toLowerCase();
      return status?.includes("تسویه") && status?.includes("نشده");
    });
    const canceledOrders = allOrders.filter((item: any) => {
      const status = item.settlement_status_overall?.toString().trim().toLowerCase();
      return status?.includes("لغو");
    });

    return {
      all: allOrders.length,
      settled: settledOrders.length,
      notSettled: notSettledOrders.length,
      canceled: canceledOrders.length,
    };
  }, [data?.data]);

 const tabs = [
  { label: `همه سفارش‌ها (${tabCounts.all || 0})`, value: "all" },
  { label: `در انتظار تائید شرکت (${tabCounts.notSettled || 0})`, value: "در انتظار تائید شرکت" },
  { label: `در انتظار تائید حسابداری (${tabCounts.settled || 0})`, value: "در انتظار تئید حسابداری" },
  { label: `در انتظار دریافت (${tabCounts.canceled || 0})`, value: "در انتظار دریافت" }
];


  const filteredOrdersByTab = useMemo(() => {
    if (activeTab === "all") return filteredDataList;

    return filteredDataList?.filter((item: any) => {
      const status = item.settlement_status_overall?.toString().trim().toLowerCase();
      if (!status) return false;

      switch (activeTab) {
        case "تسویه شده":
          return status.includes("تسویه") && status.includes("شده") && !status.includes("ن");
        case "تسویه نشده":
          return status.includes("تسویه") && status.includes("نشده");
        case "لغو شده":
          return status.includes("لغو");
        default:
          return true;
      }
    });
  }, [filteredDataList, activeTab]);

  console.log(filteredOrdersByTab);


  return (
    <Card contentClassName="min-h-[85vh]">
      {/* Tabs + Filters */}
      <div className="flex flex-wrap justify-between items-center gap-2  pb-2 border-b border-gray-300">
        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`group relative px-3 py-1 text-sm font-medium transition-colors duration-300 ease-in-out
              ${activeTab === tab.value ? "text-primary" : "text-gray-500 hover:text-primary"}
              `}
            >
              {tab.label}
              <span
                className={`absolute left-0 -bottom-[2px] h-[2px] bg-primary transition-all duration-300 ease-in-out
              ${activeTab === tab.value ? "w-full opacity-100 scale-x-100" : "w-full opacity-30 scale-x-90 "}
             `}
              />
            </button>
          ))}
        </div>
        <div className="flex justify-start items-start w-[300px] pb-2">
          <SearchBox onSearch={handleSearch} className="min-h-[0px] " />
        </div>
      </div>

      {/* Orders List */}
      <ScrollArea className="w-full pr-3 mt-3  max-h-[75vh] overflow-auto">
        <div dir="rtl" className="w-full">
          {isLoading ? (
            <>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="p-3 mb-2 border rounded-[10px] animate-pulse bg-white border-gray-200"
                >
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-2 w-2/4" />
                </div>
              ))}
            </>
          ) : (
            <OrdersList data={(filteredOrdersByTab as any[]) || []} refetch={refetch} />
          )}
        </div>

        {/* Add new order button */}
        <div className="fixed left-10 bottom-[30px] bg-white rounded-lg">
          <CirclePlus
            className="w-[30px] h-[30px] cursor-pointer"
            onClick={() => router.push("/orders/new")}
          />
        </div>
        <ScrollBar />
      </ScrollArea>
    </Card>
  );
};

export default Orders;
