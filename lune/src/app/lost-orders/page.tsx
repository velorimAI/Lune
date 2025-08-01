"use client";

import { useState } from "react";
import { MessageCircleMore } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SearchBox } from "@/app/components/table/search-box";
import { AddLostItem, DeleteLostItem, DownloadModal, EditLostItem } from "./components";
import { useQuery } from "@tanstack/react-query";
import { getLostItemsList } from "../apis/lost-orders/lostOrdersService";
import { Skeleton } from "@/components/ui/skeleton";
import ToolTip from "../components/custom-tooltip";
import { cn } from "@/app/utils/cn";

export default function MyCustomPage() {
  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState("all");


  const {
    data: lostItems = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["lostOrders"],
    queryFn: getLostItemsList,
  });

  const filteredItems = lostItems.filter((item: any) => {
    if (!searchText) return true;

    const searchLower = searchText.toLowerCase();

    switch (searchField) {
      case "piece_name":
        return item.piece_name?.toLowerCase().includes(searchLower);
      case "part_id":
        return item.part_id?.toLowerCase().includes(searchLower);
      case "car_name":
        return item.car_name?.toLowerCase().includes(searchLower);
      case "all":
      default:
        return (
          item.piece_name?.toLowerCase().includes(searchLower) ||
          item.part_id?.toLowerCase().includes(searchLower) ||
          item.car_name?.toLowerCase().includes(searchLower)
        );
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-gray-50 min-h-[91vh]">
        <div className="space-y-4 w-full max-w-3xl px-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-[92vh]">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col md:flex-row  items-start md:items-center gap-2 w-full">
            <SearchBox
              searchText={searchText}
              setSearchText={setSearchText}
              className="flex-1 min-w-[250px] md:max-w-[400px]"
            />
            <DownloadModal />
          </div>
        </div>




        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <ScrollArea className="w-full h-[75vh]">
            <table className="w-full" dir="rtl">
              <thead className="sticky top-0 z-10 bg-white border-b border-gray-100">
                <tr>
                  <th className="p-4 text-right font-medium text-gray-500">نام قطعه</th>
                  <th className="p-4 text-right font-medium text-gray-500">کد فنی</th>
                  <th className="p-4 text-right font-medium text-gray-500">تعداد</th>
                  <th className="p-4 text-right font-medium text-gray-500">کاربرد</th>
                  <th className="p-4 text-center font-medium text-gray-500">تاریخ و ساعت</th>
                  <th className="p-4 text-center font-medium text-gray-500">توضیحات</th>
                  <th className="p-4 text-center font-medium text-gray-500"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      {searchText
                        ? "موردی با این مشخصات یافت نشد"
                        : "هنوز قطعه‌ای ثبت نشده است"}
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item: any, index: number) => (
                    <tr
                      key={item.id || index}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="p-4 font-medium text-gray-900">
                        {item.piece_name || "-"}
                      </td>
                      <td className="p-4 font-mono text-gray-700">
                        <span className={`rounded px-2 py-1 text-sm ${item.part_id ? "bg-gray-100" : ""
                          }`}>
                          {item.part_id || "---"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-medium">
                          {item.count || 0}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {item.car_name || "-"}
                      </td>
                      <td className="p-4 text-center text-sm">
                        <div className="flex flex-col items-center space-y-1">
                          <span className="text-gray-900 font-medium">
                            {item.lost_date || "-"}
                          </span>
                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                            {item.lost_time || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <ToolTip
                          hint={item.lost_description || "توضیحاتی وجود ندارد"}
                        >
                          <button
                            className={cn(
                              "transition-colors cursor-pointer",
                              item.lost_description
                                ? "text-gray-500 hover:text-gray-600"
                                : "text-gray-300"
                            )}
                          >
                            <MessageCircleMore size={20} />
                          </button>
                        </ToolTip>
                      </td>
                      <td className="flex gap-4 justify-center items-center p-4 py-7 text-center">
                        <EditLostItem data={item} refetch={refetch} />
                        <DeleteLostItem id={item?.id} name={item.piece_name} refetch={refetch} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <ScrollBar />
          </ScrollArea>
        </div>
      </div>

      <div className="fixed bottom-6 left-6 z-50">
        <AddLostItem refetch={refetch} />
      </div>
    </div>
  );
}
