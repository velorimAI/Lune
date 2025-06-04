"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { OrdersList } from "./components/orders-list";
import { useStaticSearchDevices } from "./hooks/use-static-search-devices";
import { SearchBox } from "../components/table/search-box";
import { Card } from "../components/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CirclePlus } from "lucide-react";
import { getOrdersList } from "../apis/orders/orderService";
import { useQuery } from "@tanstack/react-query";
import { Select } from "../components/custom-form/select-box";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const sortOptions = [
  { value: "default", label: "مرتب‌سازی پیش‌فرض" },
  { value: "name", label: "مرتب‌سازی بر اساس نام" },
  { value: "receptionDate", label: "مرتب‌سازی بر اساس تاریخ پذیرش" },
];

const Orders: FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [role, setRole] = useState<string | null>("");
  const [userName, setUserName] = useState<string | null>("");
  const [userLastname, setUserLastname] = useState<string | null>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrdersList,
  });

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setUserName(localStorage.getItem("name"));
    setUserLastname(localStorage.getItem("lastname"));
  }, []);

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
    { label: `تسویه شده (${tabCounts.settled || 0})`, value: "تسویه شده" },
    { label: `تسویه نشده (${tabCounts.notSettled || 0})`, value: "تسویه نشده" },
    { label: `لغو شده (${tabCounts.canceled || 0})`, value: "لغو شده" },
    { label: `ارشیو  (${tabCounts.all || 0})`, value: "ارشیو" },
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

  console.log(data?.data);

  return (
    <Card
      title={`سفارش ها (${filteredOrdersByTab?.length || 0})`}
      description={
        <div className="flex items-center gap-3 mt-2">
          {role && userName && userLastname && (
            <span className="text-xs text-gray-500">
              <strong>
                {userName} {userLastname}
              </strong>
              <span className="text-xs text-gray-500 mx-1">({role})</span>
            </span>
          )}
        </div>
      }
    >
      <div className="w-[300px]">
        <SearchBox onSearch={handleSearch} />
      </div>

      
      <div className="flex gap-2 p-4 border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`relative px-4 py-2 text-sm font-medium transition-all duration-200
              ${activeTab === tab.value
                ? "text-primary"
                : "text-gray-500 hover:text-primary"
              }
            `}
          >
            {tab.label}
            <span
              className={`absolute left-0 -bottom-[2px] w-full h-[2px] transition-all duration-200
                ${activeTab === tab.value ? "bg-primary" : "bg-gray-300"}
              `}
            />
          </button>
        ))}
      </div>

      
      <div className="flex items-center gap-4 w-full max-w-[600px] px-4 pt-2">
        <div>
          <Select
            value={sortBy}
            onChange={(selected) => setSortBy(selected?.value || "default")}
            options={sortOptions}
            className="py-2"
          />
        </div>
      </div>

      
      <ScrollArea className="w-full flex flex-col justify-start items-center pr-3 h-[73vh] 4xl:h-[80vh] mt-2">
        <div dir="rtl" className="w-full">
          {isLoading ? (
            <>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="p-3 mb-3 border rounded-[10px] animate-pulse bg-white border-gray-200"
                >
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-2 w-2/4" />
                </div>
              ))}
            </>
          ) : (
            <OrdersList data={(filteredOrdersByTab as any[]) || []} />
          )}
        </div>

        
        <div className="fixed left-10 bottom-[30px]">
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