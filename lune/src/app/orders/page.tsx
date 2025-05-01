"use client";

import { FC } from "react";
import { OrdersList } from "./components/orders-list";

const Orders: FC = () => {
  // const onSubmit = (data: any) => {
  //   console.log(data.username);
  // };

  return (
    <div>
      <OrdersList />
    </div>
  );
};
export default Orders;
