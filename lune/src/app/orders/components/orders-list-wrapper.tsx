import { FC } from "react";
import { OrdersList } from "@/app/orders/components/orders-list";

interface Props {
  orders: any[];
  refetch: () => void;
  currentTab : string;
}

export const OrdersListWrapper: FC<Props> = ({ orders, refetch, currentTab }) => {
  return <OrdersList data={orders} refetch={refetch} currentTab={currentTab} />;
};
