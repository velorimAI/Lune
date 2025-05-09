"use client";

import { FC, useState } from "react";
import { OrdersList } from "./components/orders-list";
import { mockOrders } from "@/mock/ordersListData";
import { useStaticSearchDevices } from "./hooks/use-static-search-devices";
import { SearchBox } from "../components/table/search-box";
import { Card } from "../components/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CirclePlus } from "lucide-react";
import { Modal } from "../components/modal";
import { Form } from "../components/custom-form/form";
import { Input } from "../components/custom-form/input";
import { Select } from "../components/custom-form/select-box";


const Orders: FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState(mockOrders);

  const filteredDataList = useStaticSearchDevices(orders || [], searchText);

  const handleSearch = (value?: string) => {
    setSearchText(value || "");
  };

  const handleOpen = (e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    setOpen(true);
  };

  const handleSubmit = (data: any) => {
    const newOrder = {
      id: Date.now(), // یا UUID
      ...data,
    };
    setOrders([newOrder, ...orders]);
    setOpen(false);
  };

  return (
    <>
      <Card title="سفارش ها">
        <div className="w-[400px]">
          <SearchBox onSearch={handleSearch} />
        </div>
        <ScrollArea className="w-full flex flex-col justify-start items-center pr-3 h-[73vh] 4xl:h-[80vh]">
          <div dir="rtl">
            <OrdersList data={filteredDataList || []} />
          </div>
          <div className="fixed left-10 bottom-[55px]">
            <CirclePlus className="w-[30px] h-[30px] cursor-pointer" onClick={handleOpen} />
          </div>
          <ScrollBar />
        </ScrollArea>
      </Card>

      <Modal
        open={open}
        title="افزودن سفارش جدید"
        onCancel={() => setOpen(false)}
        onConfirm={undefined}
      >
        <Form onSubmit={handleSubmit} submitText="ثبت" cancelText="انصراف" cancelHide submitHide>
          <Input
            label="نام کامل"
            name="fullName"
            placeholder="مثلاً: مبین خراسانی"
            className="w-full"
          />
          <Input
            label="شماره تماس"
            name="phone"
            placeholder="مثلاً: 09960028362"
            className="w-full"
          />
          <Input
            label="تاریخ سفارش"
            name="orderDate"
            placeholder="مثلاً: 1404/2/5"
            className="w-full"
          />
          <Input
            label="تاریخ تحویل"
            name="deliveryDate"
            placeholder="مثلاً: 1404/2/10"
            className="w-full"
          />
          <Input
            label="شماره سفارش"
            name="orderNumber"
            placeholder="مثلاً: 923243346"
            className="w-full"
          />
          <Select
            label="وضعیت سفارش"
            name="status"
            value="تسویه نشده"
            options={[
              { label: "تسویه نشده", value: "تسویه نشده" },
              { label: "تسویه شده", value: "تسویه شده" },
              { label: "در حال آماده‌سازی", value: "در حال آماده‌سازی" },
            ]}
          />
        </Form>
      </Modal>
    </>
  );
};

export default Orders;
