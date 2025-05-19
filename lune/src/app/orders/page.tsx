"use client";

import { FC, useEffect, useMemo, useState } from "react";
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

const sortOptions = [
  { value: "default", label: "مرتب‌سازی پیش‌فرض" },
  { value: "name", label: "مرتب‌سازی بر اساس نام" },
  { value: "receptionDate", label: "مرتب‌سازی بر اساس تاریخ پذیرش" },
];

const Orders: FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState(mockOrders);
  const [sortBy, setSortBy] = useState<string>("default");
  const [role, setRole] = useState<string | null>("");
  const [userName, setUserName] = useState<string | null>("");
  const [userLastname, setUserLastname] = useState<string | null>("");

  //   const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ["orders"],
  //   queryFn: getOrdersList,
  // });
  // console.log(data);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    const storedName = localStorage.getItem("name");
    const storedLastname = localStorage.getItem("lastname");
    setUserName(storedName);
    setUserLastname(storedLastname);
  }, []);
  const filteredDataList = useStaticSearchDevices(orders || [], searchText);

  const handleSearch = (value?: string) => {
    setSearchText(value || "");
  };

  const handleOpen = (e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    setOpen(true);
  };

  // const handleSubmit = (data: any) => {
  //   const newOrder = {
  //     id: Date.now(),
  //     fullName: `${data.name} ${data.lastname}`,
  //     ...data,
  //   };
  //   setOrders([newOrder, ...orders]);
  //   setOpen(false);
  // };

  return (
    <>
      {/* <h1>{role && <div className="text-right p-4">{role}</div>}</h1> */}
      <Card
        title={`سفارش ها (${orders?.length})`}
        description={
          <div className="flex items-center gap-3 mt-2">
            {role && userName && userLastname && (
              <span className="text-xs text-gray-500">
                <strong>
                  {userName} {userLastname}
                </strong>
                <span className="text-xs text-gray-500 mx-1">({role})</span>
              </span>
            )}
          </div>
        }
      >
        <div className="flex items-center gap-4 w-full max-w-[600px]">
          <div className="w-[300px]">
            <SearchBox onSearch={handleSearch} />
          </div>
          <div>
            <Select
              value={sortBy}
              onChange={(selected) => setSortBy(selected?.value || "default")}
              options={sortOptions}
              className="py-2"
            />
          </div>
          {/* <option value="default">مرتب‌سازی پیش‌فرض</option>
            <option value="name">مرتب‌سازی بر اساس نام</option>
            <option value="receptionDate">مرتب‌سازی بر اساس تاریخ پذیرش</option> */}
        </div>
        <ScrollArea className="w-full flex flex-col justify-start items-center pr-3 h-[73vh] 4xl:h-[80vh]">
          <div dir="rtl">
            <OrdersList data={(filteredDataList as Order[]) || []} />
          </div>
          <div className="fixed left-10 bottom-[30px]">
            <CirclePlus
              className="w-[30px] h-[30px] cursor-pointer"
              onClick={handleOpen}
            />
          </div>
          <ScrollBar />
        </ScrollArea>
      </Card>
      {/* {role && <div className="text-right p-4">نقش شما: {role}</div>} */}

      <Modal
        open={open}
        title="افزودن سفارش جدید"
        onCancel={() => setOpen(false)}
        // onConfirm={handleSubmit}
        cancelText="لفو"
        confirmText="اضافه"
      >
        <Form
          //   onSubmit={handleSubmit}
          submitText="ثبت"
          cancelText="انصراف"
          cancelHide
          submitHide
        >
          <div className="flex gap-6 w-full">
            <div className="w-full">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <Input
                    label="نام"
                    name="name"
                    placeholder="نام را وارد کنید :"
                    className="w-full"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <Input
                    label="نام خانوادگی"
                    name="lastname"
                    placeholder="نام خانوادگی را وارد کنید :"
                    className="w-full"
                    required
                  />
                </div>
              </div>

              <Input
                label="شماره تماس"
                name="phone"
                placeholder="******0912"
                className="w-full"
                required
              />
              <Input
                label="شماره پذیرش:"
                name="receptionNumber"
                placeholder="******"
                className="w-full"
                required
              />
              <Input
                label="تاریخ پذیرش:"
                name="receptionDate"
                placeholder="1404/01/01"
                className="w-full"
                required
              />
              <Input
                label="تاریخ سفارش"
                name="orderDate"
                placeholder="مثلاً: 1404/2/5"
                className="w-full"
              />
              <Input
                label="شماره سفارش"
                name="orderNumber"
                placeholder="********"
                className="w-full"
              />
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default Orders;
