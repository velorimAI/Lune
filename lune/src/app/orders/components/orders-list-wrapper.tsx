import { FC } from "react";
import { OrdersList } from "@/app/orders/components/orders-list";

interface Props {
  orders: any[];
  refetch: () => void;
}

export const OrdersListWrapper: FC<Props> = ({ orders, refetch }) => {
  return <OrdersList data={orders} refetch={refetch} />;
};
