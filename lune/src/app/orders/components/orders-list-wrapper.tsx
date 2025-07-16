import { FC } from "react";
import { OrdersList } from "@/app/orders/components/orders-list";

interface Props {
  orders: any[];
  refetch: () => void;
  currentTab : string;
  role : string | null
}

export const OrdersListWrapper: FC<Props> = ({ orders, refetch, currentTab , role }) => {
  return <OrdersList data={orders} refetch={refetch} currentTab={currentTab} role={role} />;
};
