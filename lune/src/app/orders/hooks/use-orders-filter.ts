import { useMemo } from "react";

export const useOrdersFilter = (
  customers: any[],
  searchText: string,
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
          earliest_unreceived_estimated_arrival_date: customer.earliest_unreceived_estimated_arrival_date,
          latest_unreceived_estimated_arrival_date: customer.latest_unreceived_estimated_arrival_date,
        }))
      )
    );
  }, [customers]);

  const filteredPieces = useMemo(() => {
    let filtered = allPieces;

    if (activeTab !== "all") {
      if (activeTab === "canceled") {
        const canceledStatuses = ["انصراف مشتری", "لغو توسط شرکت", "عدم پرداخت حسابداری", "عدم دریافت"];
        filtered = filtered.filter(piece => canceledStatuses.includes(piece.status));
      } else {
        filtered = filtered.filter(piece => piece.status === activeTab);
      }
    }

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(piece =>
        piece.piece_name.toLowerCase().includes(lowerSearch) ||
        piece.customer_name.includes(searchText)
      );
    }

    return filtered;
  }, [activeTab, searchText, allPieces]);


  const filteredOrdersByTab = useMemo(() => {
    const groupedByCustomer: Record<string, any> = {};

    filteredPieces.forEach(piece => {
      const customerKey = piece.customer_id;
      const receptionKey = piece.reception_id;

      if (!groupedByCustomer[customerKey]) {
        groupedByCustomer[customerKey] = {
          customer_id: piece.customer_id,
          customer_name: piece.customer_name,
          customer_phone: piece.customer_phone,
          earliest_unreceived_estimated_arrival_date: piece.earliest_unreceived_estimated_arrival_date,
          latest_unreceived_estimated_arrival_date: piece.latest_unreceived_estimated_arrival_date,
          receptions: [],
        };
      }

      let reception = groupedByCustomer[customerKey].receptions.find(
        (r: any) => r.reception_id === receptionKey
      );

      if (!reception) {
        reception = {
          reception_id: piece.reception_id,
          reception_date: piece.reception_date,
          reception_number: piece.reception_number,
          car_status: piece.reception_car_status,
          orders: [],
        };
        groupedByCustomer[customerKey].receptions.push(reception);
      }

      reception.orders.push(piece);
    });


    return Object.values(groupedByCustomer);
  }, [filteredPieces]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allPieces.length };

    allPieces.forEach(piece => {
      const status = piece.status || "نامشخص";
      counts[status] = (counts[status] || 0) + 1;
    });

    // تعداد تب لغو شده را مجموع وضعیت‌های مختلف حساب می‌کنیم
    const canceledStatuses = ["انصراف مشتری", "لغو توسط شرکت", "عدم پرداخت حسابداری", "عدم دریافت"];
    counts["canceled"] = canceledStatuses.reduce(
      (sum, status) => sum + (counts[status] || 0),
      0
    );

    return counts;
  }, [allPieces]);


  const handleSearch = (value?: string) => {
    setSearchText(value ?? "");
  };

  return { filteredOrdersByTab, tabCounts, handleSearch };
};
