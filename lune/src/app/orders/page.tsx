"use client";

import { FC, useState } from "react";
import { Card } from "../components/card";
import { useRouter } from "next/navigation";
import { CirclePlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getOrdersList } from "../apis/orders/orderService";
import { SearchBox } from "../components/table/search-box";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrdersFilter } from "./hooks/use-orders-filter";
import { Tabs } from "./components/tabs";
import { OrdersListWrapper } from "./components/orders-list-wrapper";




const Orders: FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrdersList,
  });

  const {
    filteredOrdersByTab,
    tabCounts,
    handleSearch
  } = useOrdersFilter(data?.data || [], searchText, activeTab, setSearchText);

  return (
    <Card contentClassName="min-h-[85vh]" className="lg:h-[calc(100%-55px)]">
      <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-gray-300">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabCounts={tabCounts} />
        <div className="flex justify-start items-start w-[300px] pb-2">
          <SearchBox onSearch={handleSearch} className="min-h-[0px]" />
        </div>
      </div>

      <ScrollArea className="w-full pr-3 mt-3 max-h-[75vh] overflow-auto">
        <div dir="rtl" className="w-full">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="p-3 mb-2 border rounded-[10px] animate-pulse bg-white border-gray-200">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-2 w-2/4" />
              </div>
            ))
          ) : (
            <OrdersListWrapper orders={filteredOrdersByTab} refetch={refetch} />
          )}
        </div>

        <div className="fixed left-6 bottom-[20px] bg-white rounded-lg">
          <CirclePlus className="w-[30px] h-[30px] cursor-pointer" onClick={() => router.push("/orders/new")} />
        </div>
        <ScrollBar />
      </ScrollArea>
    </Card>
  );
};

export default Orders;
