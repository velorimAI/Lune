
import { useMemo } from "react";


const mapStatusToTabValue = (status: string): string => {
  if (/نوبت\s*-?\s*دهی/.test(status)) {
    return "در انتظار نوبت‌دهی";
  }

  if (/نوبت\s*-?\s*داده/.test(status)) {
    return "نوبت داده شد";
  }

  const canceledStatuses = [
    "انصراف مشتری",
    "لغو توسط شرکت",
    "عدم پرداخت حسابداری",
    "عدم دریافت",
  ];
  if (canceledStatuses.includes(status)) {
    return "canceled";
  }

  return status;
};

export const useOrdersFilter = (
  customers: any[],
  searchText: string,
  searchField: string,
  activeTab: string,
  setSearchText: (val: string) => void
) => {
  const allPieces = useMemo(() => {
    return customers.flatMap(customer =>
      customer.receptions.flatMap((reception: any) =>
        reception.orders.map((order: any) => ({
          ...order,
          reception_car_status: reception.car_status,
          reception_id: reception.reception_id,
          reception_date: reception.reception_date,
          reception_number: reception.reception_number,
          customer_id: customer.customer_id,
          customer_name: customer.customer_name,
          customer_phone: customer.customer_phone,
          earliest_unreceived_estimated_arrival_date:
            customer.earliest_unreceived_estimated_arrival_date,
          latest_unreceived_estimated_arrival_date:
            customer.latest_unreceived_estimated_arrival_date,
        }))
      )
    );
  }, [customers]);

  const filteredPieces = useMemo(() => {
    let filtered = allPieces;

    if (activeTab !== "all") {
      if (activeTab === "canceled") {
        const canceledStatuses = [
          "انصراف مشتری",
          "لغو توسط شرکت",
          "عدم پرداخت حسابداری",
          "عدم دریافت",
        ];
        filtered = filtered.filter(p => canceledStatuses.includes(p.status));
      } else {
        filtered = filtered.filter(
          p => mapStatusToTabValue(p.status) === activeTab
        );
      }
    }

    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(piece => {
        switch (searchField) {
          case "order_number":
            return piece.order_number
              ?.toString()
              .toLowerCase()
              .includes(lower);
          case "customer_name":
            return piece.customer_name.toLowerCase().includes(lower);
          case "customer_phone":
            return piece.customer_phone.toLowerCase().includes(lower);
          case "piece_name":
            return piece.piece_name.toLowerCase().includes(lower);
          case "part_id":
            return piece.part_id.toLowerCase().includes(lower);
          case "reception_number":
            return piece.reception_number.toLowerCase().includes(lower);
          case "all":
          default:
            return (
              piece.piece_name.toLowerCase().includes(lower) ||
              piece.customer_name.toLowerCase().includes(lower) ||
              piece.customer_phone.toLowerCase().includes(lower) ||
              piece.part_id.toLowerCase().includes(lower) ||
              piece.reception_number.toLowerCase().includes(lower) ||
              piece.order_number
                ?.toString()
                .toLowerCase()
                .includes(lower)
            );
        }
      });
    }

    return filtered;
  }, [allPieces, activeTab, searchText, searchField]);

  const filteredOrdersByTab = useMemo(() => {
    const grouped: Record<string, any> = {};
    filteredPieces.forEach(piece => {
      const cKey = piece.customer_id;
      const rKey = piece.reception_id;

      if (!grouped[cKey]) {
        grouped[cKey] = {
          customer_id: piece.customer_id,
          customer_name: piece.customer_name,
          customer_phone: piece.customer_phone,
          earliest_unreceived_estimated_arrival_date:
            piece.earliest_unreceived_estimated_arrival_date,
          latest_unreceived_estimated_arrival_date:
            piece.latest_unreceived_estimated_arrival_date,
          receptions: [],
        };
      }

      let rec = grouped[cKey].receptions.find(
        (r: any) => r.reception_id === rKey
      );
      if (!rec) {
        rec = {
          reception_id: piece.reception_id,
          reception_date: piece.reception_date,
          reception_number: piece.reception_number,
          car_status: piece.reception_car_status,
          orders: [],
        };
        grouped[cKey].receptions.push(rec);
      }
      rec.orders.push(piece);
    });

    return Object.values(grouped);
  }, [filteredPieces]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allPieces.length };
    allPieces.forEach(p => {
      const key = mapStatusToTabValue(p.status || "");
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [allPieces]);

  const handleSearch = (value?: string) => setSearchText(value ?? "");

  return { filteredOrdersByTab, tabCounts, handleSearch };
};
