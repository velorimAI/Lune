"use client";

import { Form } from "@/app/components/custom-form/form";
import { Input } from "@/app/components/custom-form/input";
import { Select } from "@/app/components/custom-form/select-box";
import { Modal } from "@/app/components/modal";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddItem } from "../hooks/use-add-item";
import { getTodayJalaliDate } from "@/app/utils/getTodayJalali";

interface AddItemModalProp {
  data?: any;
  refetch?: () => void;
  id?: number;
}

const AddItem: React.FC<AddItemModalProp> = ({ data, refetch, id }) => {
  const [open, setOpen] = useState(false);
  const [orderChannel, setOrderChannel] = useState<string>("VOR");
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
      description: formData.description || "", // اینجا از فیلد توضیحات استفاده می‌شود
      dealer_approved: formData.dealer_approved || false,
    };

    const payload = {
      reception_number: formData.reception_number,
      reception_date: formData.reception_date,
      car_status: formData.car_status,
      orders: [order],
    };

    if (!id) return;

    mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success("قطعه با موفقیت اضافه شد");
          setOpen(false);
          refetch?.();
        },
        onError: () => {
          toast.error("خطا در ارسال سفارش");
        },
      }
    );
  };

  return (
    <>
      <CirclePlus
        className="cursor-pointer w-6 h-6 mr-auto transition-all duration-300 hover:text-teal-500 hover:scale-125 hover:rotate-12 hover:drop-shadow-lg"
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
          submitText="اضافه کردن قطعه"
          onCancel={() => setOpen(false)}
          onSubmit={handleUpdate}
        >
          <div
            className="
              p-4 bg-white rounded-lg shadow
              grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4
            "
          >
            {/* 1. شماره پذیرش */}
            <Input label="شماره پذیرش" name="reception_number" />

            {/* 2. تاریخ پذیرش */}
            <Input
              label="تاریخ پذیرش"
              name="reception_date"
              value={getTodayJalaliDate()}
              readOnly
            />

            {/* 3. شماره سفارش */}
            <Input label="شماره سفارش" name="order_number" />

            {/* 4. وضعیت خودرو */}
            <Select
              label="وضعیت خودرو"
              name="car_status"
              value="متوقع"
              options={[
                { label: "متوقع", value: "متوقع" },
                { label: "متوقف", value: "متوقف" },
              ]}
              inputStyle="w-full"
            />

            {/* 5. کد فنی */}
            <Input label="کد فنی" name="part_id" />

            {/* 6. نام قطعه */}
            <Input label="نام قطعه" name="piece_name" />

            {/* 7. تعداد */}
            <Input
              label="تعداد"
              name="number_of_pieces"
              type="number"
              isPositiveNumber
            />

            {/* 8. کانال سفارش */}
            <Select
              label="کانال"
              name="order_channel"
              value={orderChannel}
              options={[
                { label: "VOR", value: "VOR" },
                { label: "VIS", value: "VIS" },
                { label: "بازار آزاد", value: "بازار آزاد" },
                { label: "شارژ انبار", value: "شارژ انبار" },
              ]}
              onChange={(val) => setOrderChannel(val)}
              inputStyle="w-full"
            />

            {/* فیلدهای اضافی در صورت بازار آزاد */}
            {orderChannel === "بازار آزاد" && (
              <>
                <div className="col-span-1 sm:col-span-2 md:col-span-2">
                  <Input label="نام بازار" name="market_name" />
                </div>
                <div className="col-span-1 sm:col-span-2 md:col-span-2">
                  <Input label="تلفن بازار" name="market_phone" />
                </div>
              </>
            )}

            {/* فیلد توضیحات - اضافه شده */}
            <div className="col-span-full">
              <Input
                label="توضیحات"
                name="description"
                placeholder="توضیحات اختیاری..."
                type="textArea"
                
              />
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AddItem;