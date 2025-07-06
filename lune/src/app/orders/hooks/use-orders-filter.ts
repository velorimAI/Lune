import { useMemo } from "react";
import { useStaticSearchDevices } from "../hooks/use-static-search-devices";

export const useOrdersFilter = (
  data: any[],
  searchText: string,
  activeTab: string,
  setSearchText: (v: string) => void
) => {
  const filteredDataList = useStaticSearchDevices(data, searchText);

  const tabCounts = useMemo(() => {
    const settledOrders = data.filter((item: any) =>
      item.settlement_status_overall?.toLowerCase().includes("تسویه شده")
    );
    const notSettledOrders = data.filter((item: any) =>
      item.settlement_status_overall?.toLowerCase().includes("تسویه نشده")
    );
    const canceledOrders = data.filter((item: any) =>
      item.settlement_status_overall?.toLowerCase().includes("لغو")
    );

    return {
      all: data.length,
      settled: settledOrders.length,
      notSettled: notSettledOrders.length,
      canceled: canceledOrders.length,
    };
  }, [data]);

  const filteredOrdersByTab = useMemo(() => {
    if (activeTab === "all") return filteredDataList;

    return filteredDataList?.filter((item: any) => {
      const status = item.settlement_status_overall?.toLowerCase();
      if (!status) return false;

      switch (activeTab) {
        case "تسویه شده":
          return status.includes("تسویه") && status.includes("شده") && !status.includes("نشده");
        case "تسویه نشده":
          return status.includes("تسویه") && status.includes("نشده");
        case "لغو شده":
          return status.includes("لغو");
        default:
          return true;
      }
    });
  }, [filteredDataList, activeTab]);

  const handleSearch = (value?: string) => {
    setSearchText(value || "");
  };

  return { filteredOrdersByTab, tabCounts, handleSearch };
};
