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
import { TextArea } from "@/app/components/custom-form/text-area";
import { PartIdInput } from "./part-id-input";
import { useForm } from "react-hook-form";
import { JalaliDatePicker } from "@/app/components/date-picker-ui";

interface AddItemModalProp {
  data?: any;
  refetch?: () => void;
  id?: number;
  disabled?: boolean;
}

const AddItem= ({
  data,
  refetch,
  id,
  disabled,
} : AddItemModalProp) => {
  const [open, setOpen] = useState(false);
  const [orderChannel, setOrderChannel] = useState<string>("VOR");
  const { mutate } = useAddItem();
  const [formValues, setFormValues] = useState({
    part_id: "",
    piece_name: "",
  });

  const { control , watch } = useForm({
    defaultValues: { reception_date: getTodayJalaliDate() },
  });

  const reception_date = watch("reception_date");


  const handleUpdate = async (formData: any) => {
    const order = {
      piece_name: formValues.piece_name,
      part_id: formValues.part_id,
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
      all_description: formData.all_description || "",
      dealer_approved: formData.dealer_approved || false,
    };

    const payload = {
      reception_number: formData.reception_number,
      reception_date: reception_date,
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
          setFormValues({ part_id: "", piece_name: "" });
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
        className={`cursor-pointer w-6 h-6 mr-auto transition-all duration-300 
        ${
          disabled
            ? "text-gray-300 cursor-not-allowed"
            : "hover:text-gray-700 hover:scale-125 hover:rotate-12 hover:drop-shadow-lg"
        }
        `}
        onClick={() => {
          if (!disabled) setOpen(true);
        }}
      />

      <Modal
        open={open}
        title="ثبت پذیرش جدید"
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
          <div className="bg-white rounded-lg ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="شماره پذیرش" name="reception_number" required />
              {/* <Input
                label="تاریخ پذیرش"
                name="reception_date"
                value={getTodayJalaliDate()}
                readOnly
                required
              /> */}
              <JalaliDatePicker
                control={control}
                name="reception_date"
                label=" تاریخ پذیرش"
                required
                className="text-right"
              />
              <Input label="شماره سفارش" name="order_number" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="وضعیت خودرو"
                name="car_status"
                value="متوقع"
                options={[
                  { label: "متوقع", value: "متوقع" },
                  { label: "متوقف", value: "متوقف" },
                ]}
                inputStyle="w-full"
                hiddenSearch
                required
              />
              <PartIdInput
                value={formValues.part_id}
                onChange={(val) =>
                  setFormValues((prev) => ({
                    ...prev,
                    part_id: val,
                    piece_name: val ? prev.piece_name : "",
                  }))
                }
                setPieceName={(name) =>
                  setFormValues((prev) => ({
                    ...prev,
                    piece_name: name,
                  }))
                }
              />
              <Input
                label="نام قطعه"
                name="piece_name"
                value={formValues.piece_name}
                readOnly
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="تعداد"
                name="number_of_pieces"
                type="number"
                isPositiveNumber
                required
              />
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
                hiddenSearch
                required
              />
            </div>

            {orderChannel === "بازار آزاد" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="نام بازار" name="market_name" required />
                <Input label="تلفن بازار" name="market_phone" required />
              </div>
            )}

            <div className="mb-4">
              <TextArea
                label="توضیحات"
                name="all_description"
                placeholder="توضیحاتی درباره سفارش وارد کنید..."
                className="w-full"
              />
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AddItem;
