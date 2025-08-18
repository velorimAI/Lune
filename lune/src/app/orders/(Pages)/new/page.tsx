"use client";

import { useRouter } from 'next/navigation';
import { Card } from "@/app/components/card";
import { useOrderData } from "../../hooks/use-order-data";
import PartForm from "../../components/part-form";
import { CustomerForm } from "../../components/customer-form";
import OrderList from "../../components/order-list";
import { ArrowRight } from "lucide-react";
import { Button } from '@/app/components/button';
import { HotkeyRedirect } from '@/app/components/escape-hot-key';

export default function NewOrderPage() {
  const router = useRouter();
  const {
    userForm,
    userInfoSubmitted,
    orderGroups,
    orderChannel,
    isPending,
    estimatedArrivalDays,
    setOrderChannel,
    handleUserData,
    handleSubmitItem,
    handleSubmit,
    setOrderGroups,
    customerFormKey,
  } = useOrderData();

  return (
    <Card className="max-h-fit relative">
      <Button
        onClick={() => router.push("/orders")}
        variant={"outline"}
        className="absolute top-4 right-4 flex items-center text-gray-800 hover:text-gray-1000 transition cursor-pointer"
      >
        <ArrowRight size={20} />
        <HotkeyRedirect redirectTo="/orders" />
      </Button>

      <div className="flex gap-5 pt-10">
        <div className="w-[50%] flex flex-col gap-5">
          <CustomerForm
            key={customerFormKey}
            userForm={userForm}
            userInfoSubmitted={userInfoSubmitted}
            onSubmit={handleUserData}
            onFormReset={() => userForm.reset()}
          />
          <PartForm
            userInfoSubmitted={userInfoSubmitted}
            orderChannel={orderChannel}
            setOrderChannel={setOrderChannel}
            estimatedArrivalDays={estimatedArrivalDays}
            onSubmit={handleSubmitItem}
            onFormReset={() => { }}
          />
        </div>
        <div className="w-[50%]">
          <OrderList
            items={orderGroups}
            onDelete={(index: number) => {
              const updated = orderGroups.filter((_, i) => i !== index);
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
