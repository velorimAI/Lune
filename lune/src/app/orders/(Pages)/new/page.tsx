"use client";

import { Card } from "@/app/components/card";
import { CheckBox } from "@/app/components/custom-form/check-box";
import { Form } from "@/app/components/custom-form/form";
import { Input } from "@/app/components/custom-form/input";
import { Select } from "@/app/components/custom-form/select-box";
import { useEffect, useMemo, useState } from "react";
import { ItemList } from "../../components/item-list";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAddOrder } from "../../hooks/use-add-order";
import { toast } from "sonner";
import { Button } from "@/app/components/button";
import { useForm } from "react-hook-form";
import { useCustomerInputRefs } from "../../hooks/useCustomerInputRefs";
import { usePartInputRefs } from "../../hooks/usePartInputRefs";
import { getTodayJalaliDate } from "@/app/utils/getTodayJalali";

export default function NewOrderPage() {
  const userForm = useForm();
  const { mutate, isPending } = useAddOrder();
  const [userData, setUserData] = useState<any>({});
  const [userInfoSubmitted, setUserInfoSubmitted] = useState(false);
  const { refs, clearAllFields } = useCustomerInputRefs();
  const { refs: partRefs, clearPartFields } = usePartInputRefs();
  const [orderChannel, setOrderChannel] = useState("VOR");
  const [arrivalSettings, setArrivalSettings] = useState<{ VIS: string; VOR: string }>({
    VIS: "10",
    VOR: "7",
  });


  useEffect(() => {
    const stored = localStorage.getItem("orderSettings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.VIS && parsed?.VOR) {
          setArrivalSettings(parsed);
        }
      } catch (e) {
        console.error("تنظیمات معتبر نیست");
      }
    }
  }, []);


  const [orderGroups, setOrderGroups] = useState<any[]>([]);


  const handleUserData = (data: any) => {
    setUserData(data);
    setUserInfoSubmitted(true);
  };

  const handleSubmitItem = (data: any) => {
    setOrderGroups((prevData) => [...prevData, data]);
    clearPartFields();
  };

  const handleSubmit = () => {
    if (
      !userData.customer_name ||
      !userData.phone_number ||
      !userData.car_status ||
      !userData.reception_number ||
      !userData.reception_date
    ) {
      toast.error("لطفا ابتدا اطلاعات مشتری را کامل وارد کنید.");
      return;
    }

    if (orderGroups.length === 0) {
      toast.error("لطفا حداقل یک قطعه ثبت کنید.");
      return;
    }

    const payload = {
      customer_name: userData.customer_name,
      phone_number: userData.phone_number,
      car_status: userData.car_status,
      reception_number: userData.reception_number,
      reception_date: userData.reception_date,
      orders: orderGroups.map((item) => ({
        piece_name: item.piece_name,
        part_id: item.part_id,
        number_of_pieces: parseInt(item.number_of_pieces, 10),
        order_channel: item.order_channel,
        market_name:
          item.order_channel === "بازار آزاد" ? item.market_name : null,
        market_phone:
          item.order_channel === "بازار آزاد" ? item.market_phone : null,
        order_number: item.order_number,
        estimated_arrival_days: Number(item.estimated_arrival_days),
        status: item.status,
        settlement_status: item.settlement_status || "تسویه نشده",
        description: item.description || "",
        dealer_approved: !!item.dealer_approved,
      })),
    };
    console.log(payload);


    mutate(
      { data: payload },
      {
        onSuccess: () => {
          toast.success("سفارش با موفقیت اضافه شد");
          setUserData({});
          setOrderGroups([]);
          setUserInfoSubmitted(false);
          clearAllFields();
        },
        onError: () => {
          toast.error("خطا در ارسال سفارش");
        },
      }
    );
  };


  const estimatedArrivalDays = useMemo(() => {
    return orderChannel === "VOR"
      ? arrivalSettings.VOR
      : orderChannel === "VIS"
        ? arrivalSettings.VIS
        : undefined;
  }, [orderChannel, arrivalSettings]);



  return (
    <Card className="max-h-fit">
      <div className="flex gap-5">
        <div className="w-[50%]  flex flex-col gap-5">
          <Card title="اطلاعات مشتری" >
            <Form submitText="ثبت اطلاعات" cancelHide onSubmit={handleUserData} submitDisable={userInfoSubmitted} methods={userForm} >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <Input label="نام مشتری" name="customer_name" required readOnly={userInfoSubmitted} ref={refs.customerNameRef} />
                <Input label="شماره تماس" name="phone_number" phone required readOnly={userInfoSubmitted} ref={refs.phoneNumberRef} />
                <Select
                  label="وضعیت خودرو"
                  name="car_status"
                  value="متوقف"
                  inputStyle="w-full"
                  options={[
                    { value: "متوقف", label: "متوقف" },
                    { value: "متوقع", label: "متوقع" },
                  ]}
                  required
                  disabled={userInfoSubmitted}
                />
                <Input label="شماره پذیرش" name="reception_number" required readOnly={userInfoSubmitted} ref={refs.receptionNumberRef} />
                <Input label="تاریخ پذیرش" value={getTodayJalaliDate()} name="reception_date" required readOnly />
              </div>
            </Form>
          </Card>

          <Card title="اطلاعات قطعه">
            <Form submitText="ثبت قطعه" cancelHide onSubmit={handleSubmitItem}>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input label="کد فنی" name="part_id" type="number" required ref={partRefs.partIdRef} />
                  <Input label="نام قطعه" name="piece_name" required ref={partRefs.pieceNameRef} />
                  <Input
                    label="تعداد"
                    type="number"
                    isPositiveNumber
                    name="number_of_pieces"
                    required
                    ref={partRefs.numberOfPiecesRef}
                  />
                </div>
                <div className={`grid grid-cols-1 ${orderChannel === "بازار آزاد" ? "md:grid-cols-3" : "md:grid-cols-4"} gap-2`}>
                  <Select
                    label="کانال سفارش"
                    name="order_channel"
                    value="VOR"
                    inputStyle="w-full"
                    options={[
                      { value: "VOR", label: "VOR" },
                      { value: "VIS", label: "VIS" },
                      { value: "شارژ انبار", label: "شارژ انبار" },
                      { value: "بازار آزاد", label: "بازار آزاد" },
                    ]}
                    required
                    onChange={(data) => (setOrderChannel(data))}
                  />
                  {orderChannel === "بازار آزاد" && (
                    <>
                      <Input label="نام بازار" name="market_name" />
                      <Input label="تلفن بازار" name="market_phone" />
                    </>
                  )}
                  <Input label="شماره سفارش" name="order_number" required ref={partRefs.orderNumberRef} />
                  <Input label="دریافت (روز)" name="estimated_arrival_days" required value={estimatedArrivalDays} readOnly={orderChannel === "VOR" || orderChannel === "VIS"}
                  />
                  <Select
                    label="وضعیت"
                    name="status"
                    value="دریافت نشده"
                    inputStyle="w-full"
                    options={[
                      { value: "دریافت شده", label: "دریافت شده" },
                      { value: "دریافت نشده", label: "دریافت نشده" },
                    ]}
                    required
                  />
                </div>
                <Input label="توضیحات" name="description" type="textarea" />
                <CheckBox label="تایید شرکت" name="dealer_approved" reverse />
              </div>
            </Form>
          </Card>
        </div>

        <div className="w-[50%]">
          <Card title="قطعات ثبت شده :" className="h-full flex flex-col p-1"
            contentClassName="h-full flex flex-col justify-between"
          >
            <ScrollArea className="w-full max-h-[565px]">
              <div dir="rtl" className="w-full">
                <ItemList data={orderGroups} onDelete={(index) => {
                  const updated = [...orderGroups];
                  updated.splice(index, 1);
                  setOrderGroups(updated);
                }} />

              </div>
              <ScrollBar />
            </ScrollArea>
            {orderGroups.length > 0 && (
              <div className="mt-3 px-3 pb-4">
                <Button
                  disabled={isPending}
                  onClick={handleSubmit}
                  className="w-full"
                  isLoading={isPending}
                >
                  ثبت نهایی
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Card>
  );
}