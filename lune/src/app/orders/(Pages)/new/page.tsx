"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/card";
import { Form } from "@/app/components/custom-form/form";
import { Input } from "@/app/components/custom-form/input";
import { Select } from "@/app/components/custom-form/select-box";
import { Button } from "@/app/components/button";
import { toast } from "sonner";

const NewOrderPage = () => {
  const router = useRouter();

  // وضعیت کانال سفارش رو نگه می‌داریم
  const [orderChannel, setOrderChannel] = useState<string>("");

  const handleSubmit = async (data: any) => {
    const fixedNumberOfPieces = 1;

    if (data.orders && data.orders[0] && data.orders[0].piece_info) {
      data.orders[0].piece_info.number_of_pieces = fixedNumberOfPieces;
    }

    // اگر کانال سفارش چیز دیگه‌ای جز "انبار مرکزی" بود، اطلاعات فروشگاه رو null کن
    if (data.orders && data.orders[0]) {
      if (data.orders[0].source.order_channel !== "انبار مرکزی") {
        data.orders[0].source.market_name = null;
        data.orders[0].source.market_phone = null;
      }
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3001/api/orders/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(`سفارش با موفقیت ثبت شد`, {
          action: {
            label: "بستن",
            onClick: () => console.log("Undo"),
          },
        });
        router.push("/orders");
      } else {
        toast.error("ثبت سفارش با مشکل مواجه شد.");
      }
    } catch (err) {
      console.error(err);
      alert("مشکلی در ثبت سفارش وجود دارد.");
    }
  };

  const handleOrderChannelChange = (value: string) => {
    setOrderChannel(value);
  };

  return (
    <Card
      title="ثبت سفارش جدید"
      extra={
        <Button onClick={() => router.push("/orders")}>
          بازگشت به سفارشات
        </Button>
      }
      className="max-w-5xl mx-auto p-6"
    >
      <Form cancelHide submitText="ثبت" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-10">
          {/* ستون سمت چپ */}
          <div className="flex-1 space-y-6">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">
              اطلاعات مشتری
            </h3>
            <Input name="customer.name" label="نام" required />
            <Input name="customer.last_name" label="نام خانوادگی" required />
            <Input name="customer.phone_number" label="شماره تماس" required />
            <Select
              labelClassName="m-1"
              name="customer.car_status"
              label="وضعیت خودرو"
              required
              value="متوقف"
              options={[
                { value: "متوقف", label: "متوقف" },
                { value: "در حال تعمیر", label: "در حال تعمیر" },
                { value: "آزاد شده", label: "آزاد شده" },
              ]}
            />

            <h3 className="text-xl font-semibold mt-10 mb-4 border-b pb-2">
              اطلاعات پذیرش
            </h3>
            <Input
              name="reception.reception_number"
              label="شماره پذیرش"
              required
            />
            <Input
              name="reception.reception_date"
              label="تاریخ پذیرش"
              required
            />
          </div>

          <div className="flex-1 space-y-6 ">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">
              جزئیات سفارش
            </h3>
            <Input
              name="order_detail.order_number"
              label="شماره سفارش"
              required
            />

            <div className="border rounded-lg p-4 space-y-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                سفارش قطعه 1
              </h3>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    name="orders[0].piece_info.piece_name"
                    label="نام قطعه"
                    required
                  />
                </div>
                <div className="flex-1">
                  <Input
                    name="orders[0].piece_info.part_id"
                    label="کد قطعه"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    name="orders[0].piece_info.number_of_pieces"
                    label="تعداد"
                    type="number"
                    required
                  />
                </div>
                <div className="flex-1">
                  <Select
                    name="orders[0].source.order_channel"
                    label="کانال سفارش"
                    placeholder="انتخاب کنید"
                    options={[
                      { value: "VOR", label: "VOR" },
                      { value: "VIS", label: "VIS" },
                      { value: "انبار مرکزی", label: "انبار مرکزی" },
                    ]}
                    value={orderChannel}
                    onChange={(e) => handleOrderChannelChange(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    name="orders[0].source.market_name"
                    label="نام فروشگاه"
                    disabled={orderChannel !== "انبار مرکزی"}
                    required={orderChannel === "انبار مرکزی"}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    name="orders[0].source.market_phone"
                    label="شماره فروشگاه"
                    disabled={orderChannel !== "انبار مرکزی"}
                    required={orderChannel === "انبار مرکزی"}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    name="orders[0].dates.order_date"
                    label="تاریخ سفارش"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    name="orders[0].dates.prediction_delivery_date"
                    label="تاریخ پیش‌بینی تحویل"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Select
                    name="orders[0].status.status"
                    label="وضعیت سفارش"
                    value="دریافت نشده"
                    options={[
                      { value: "دریافت نشده", label: "دریافت نشده" },
                      { value: "دریافت شده", label: "دریافت شده" },
                    ]}
                  />
                </div>
                <div className="flex-1">
                  <Select
                    name="orders[0].status.settlement_status"
                    label="وضعیت تسویه"
                    value="پرداخت نشده"
                    options={[
                      { value: "پرداخت نشده", label: "پرداخت نشده" },
                      { value: "پرداخت شده", label: "پرداخت شده" },
                    ]}
                  />
                </div>
              </div>

              <Input
                name="orders[0].description"
                label="توضیحات"
                type="textarea"
              />
            </div>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default NewOrderPage;
