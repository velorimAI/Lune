"use client";

import { FC, useState } from "react";
import { Card } from "../../components/card";
import { useRouter } from "next/navigation";
import { CirclePlus } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getOrdersList } from "../../apis/orders/orderService";
import { SearchBox } from "../../components/table/search-box";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrdersFilter } from "../hooks/use-orders-filter";
import { Tabs } from "../components/tabs";
import { OrdersListWrapper } from "../components/orders-list-wrapper";
import { Select } from "@/app/components/custom-form/select-box";

const Orders: FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");
  const role = localStorage.getItem('role');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrdersList,
  });

  const { filteredOrdersByTab, tabCounts, handleSearch } = useOrdersFilter(
    data?.data || [],
    searchText,
    searchField,
    activeTab,
    setSearchText
  );


  


  return (
    <Card contentClassName="min-h-[85vh]" className="lg:h-[calc(100%-55px)]">
      <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-gray-300">
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabCounts={tabCounts}
        />
        <div className="flex justify-start items-center w-full max-w-md gap-2 pb-2">
          <Select
            options={[
              { value: "all", label: "همه" },
              { value: "customer_name", label: "نام مشتری" },
              { value: "customer_phone", label: "تلفن مشتری" },
              { value: "piece_name", label: "نام قطعه" },
              { value: "part_id", label: "کد فنی" },
              { value: "reception_number", label: "شماره پذیرش" },
              { value: "order_number", label: "شماره سفارش" },
            ]}
            value={searchField}
            onChange={(val) => setSearchField(val ?? "all")}
            placeholder="انتخاب فیلد"
            hiddenSearch
            inputStyle="w-32"
            className="min-h-[0px] mt-2"
          />
          <SearchBox
            onSearch={handleSearch}
            className="min-h-[0px] flex-1"
          />
        </div>
      </div>

      <ScrollArea className="w-full pr-3 mt-3 max-h-[75vh] overflow-auto">
        <div dir="rtl" className="w-full">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="p-3 mb-2 border rounded-[10px] animate-pulse bg-white border-gray-200"
              >
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-2 w-2/4" />
              </div>
            ))
          ) : (
            <OrdersListWrapper
              orders={filteredOrdersByTab}
              refetch={refetch}
              currentTab={activeTab}
              role={role}
            />
          )}
        </div>

       
        <ScrollBar />
      </ScrollArea>
      <motion.div
        className={`
    fixed left-6 bottom-[20px] 
    ${role === "حسابدار" ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
  `}
        whileHover={role === "حسابدار" ? {} : { scale: 1.2 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => {
          if (role !== "حسابدار") {
            router.push("/orders/new");
          }
        }}
        role="button"
        aria-label="Add new order"
      >
        <CirclePlus className="w-8 h-8 text-gray-700" />
      </motion.div>

    </Card>
  );
};

export default Orders;