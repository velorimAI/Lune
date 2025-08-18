import { OrdersList } from "@/app/orders/components/orders-list";

interface Props {
  orders: any[];
  refetch: () => void;
  currentTab : string;
  role : string | null
}

export const OrdersListWrapper= ({ orders, refetch, currentTab , role } :Props) => {
  return <OrdersList data={orders} refetch={refetch} currentTab={currentTab} role={role} />;
};
