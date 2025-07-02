"use client";

import { Card } from "@/app/components/card";
import { useOrderData } from "../../hooks/use-order-data";
import PartForm from "../../components/part-form";
import { CustomerForm } from "../../components/customer-form";
import { OrdersList } from "../../components/orders-list";
import OrderList from "../../components/order-list";

export default function NewOrderPage() {
  const {
    userForm,
    userInfoSubmitted,
    userData,
    orderGroups,
    orderChannel,
    isPending,
    estimatedArrivalDays,
    setOrderChannel,
    handleUserData,
    handleSubmitItem,
    handleSubmit,
    setOrderGroups,
  } = useOrderData();

  return (
    <Card className="max-h-fit">
      <div className="flex gap-5">
        <div className="w-[50%] flex flex-col gap-5">
          <CustomerForm
            userForm={userForm}
            userInfoSubmitted={userInfoSubmitted}
            onSubmit={handleUserData}
          />
          <PartForm
            userInfoSubmitted={userInfoSubmitted}
            orderChannel={orderChannel}
            setOrderChannel={setOrderChannel}
            estimatedArrivalDays={estimatedArrivalDays}
            onSubmit={handleSubmitItem}
          />
        </div>
        <div className="w-[50%]">
          <OrderList
            items={orderGroups}
            onDelete={(index: number) => {
              const updated = [...orderGroups];
              updated.splice(index, 1);
              setOrderGroups(updated);
            }}
            onSubmit={handleSubmit}
            isPending={isPending}
          />
        </div>
      </div>
    </Card>
  );
}
