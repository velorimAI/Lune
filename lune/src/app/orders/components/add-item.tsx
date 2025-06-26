"use client";

import { CheckBox } from "@/app/components/custom-form/check-box";
import { Form } from "@/app/components/custom-form/form";
import { Input } from "@/app/components/custom-form/input";
import { Select } from "@/app/components/custom-form/select-box";
import { Modal } from "@/app/components/modal";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddItem } from "../hooks/use-add-item";

interface AddItemModalProp {
  data?: any;
  refetch?: () => void;
  id?: number;
}

const AddItem: React.FC<AddItemModalProp> = ({ data, refetch, id }) => {
  const [open, setOpen] = useState(false);
  const [orderChannel, setOrderChannel] = useState("");
  const { mutate, isPending } = useAddItem();

  const handleUpdate = async (formData: any) => {
    const order = {
      piece_name: formData.piece_name,
      part_id: formData.part_id,
      number_of_pieces: Number(formData.number_of_pieces),
      order_number: formData.order_number,
      order_channel: formData.order_channel,
      ...(formData.order_channel === "بازار آزاد" && {
        market_name: formData.market_name,
        market_phone: formData.market_phone,
      }),
      estimated_arrival_days: 7,
      status: formData.status,
      settlement_status: formData.settlement_status,
      description: formData.description || "",
      dealer_approved: formData.dealer_approved || false,
    };

    const payload = {
      reception_number: formData.reception_number,
      reception_date: formData.reception_date,
      orders: [order],
    };

    if (!id) return;

    mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success("سفارش با موفقیت اضافه شد");
          setOpen(false);
          refetch?.();
        },
        onError: () => {
          toast.error("خطا در ارسال سفارش");
        },
      }
    );
  };

  // const isAccountant = role === "حسابدار";
  // const isWarehouse = role === "انباردار";

  return (
    <>
      <CirclePlus
        className="cursor-pointer w-6 h-6 mr-auto  transition-all duration-300 hover:text-teal-500 hover:scale-125 hover:rotate-12 hover:drop-shadow-lg"
        onClick={() => setOpen(true)}
      />

      <Modal
        open={open}
        title="اضافه کردن قطعه"
        onCancel={() => setOpen(false)}
        hideCancel
        hideConfirm
      >
        <Form
          cancelText="لغو"
          submitText="اضاقه کردن قطعه"
          onCancel={() => setOpen(false)}
          onSubmit={handleUpdate}
        >
          <div className="flex flex-col gap-2">
            {/* اطلاعات پذیرش */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input label="شماره پذیرش" name="reception_number" />
              <Input label="تاریخ پذیرش" name="reception_date" />
            </div>

            {/* اطلاعات قطعه */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input label="نام قطعه" name="piece_name" />
              <Input label="کد قطعه" name="part_id" />
              <Input
                label="تعداد"
                name="number_of_pieces"
                type="number"
                isPositiveNumber
              />
            </div>

            {/* اطلاعات سفارش */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Input label="شماره سفارش" name="order_number" />
              <Select
                label="کانال"
                name="order_channel"
                value="VOR"
                options={[
                  { label: "VOR", value: "VOR" },
                  { label: "VIS", value: "VIS" },
                  { label: "بازار آزاد", value: "بازار آزاد" },
                ]}
                onChange={(data) => {
                  setOrderChannel(data);
                }}
                inputStyle="w-full"
              />
              {orderChannel === "بازار آزاد" && (
                <>
                  <Input label="نام بازار" name="market_name" />
                  <Input label="تلفن بازار" name="market_phone" />
                </>
              )}
              <Select
                label="وضعیت تحویل"
                name="status"
                options={[
                  { label: "دریافت شده", value: "دریافت شده" },
                  { label: "دریافت نشده", value: "دریافت نشده" },
                ]}
                inputStyle="w-[105px]"
                value="دریافت نشده"
              />
              <Select
                label="وضعیت پرداخت"
                name="settlement_status"
                options={[
                  { label: "تسویه شده", value: "تسویه شده" },
                  { label: "تسویه نشده", value: "تسویه نشده" },
                ]}
                inputStyle="w-[105px]"
                value="تسویه نشده"
                disabled
              />
            </div>

            {/* وضعیت‌ها */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}

            {/* </div> */}

            {/* توضیحات و تایید */}
            <div className="grid grid-cols-1 gap-4">
              <Input label="توضیحات (اختیاری)" name="description" />
            </div>
            <div className="grid grid-cols-1 gap-4 ml-auto">
              <CheckBox label="تأیید نماینده" name="dealer_approved" />
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AddItem;
