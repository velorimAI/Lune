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

interface AddItemModalProp {
  data?: any;
  refetch?: () => void;
  id?: number;
}

const AddItem: React.FC<AddItemModalProp> = ({ data, refetch, id }) => {
  const [open, setOpen] = useState(false);
  const [orderChannel, setOrderChannel] = useState<string>("VOR");
  const { mutate, isPending } = useAddItem();
  const [formValues, setFormValues] = useState({
    part_id: "",
    piece_name: "",
  });

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
        className="cursor-pointer w-6 h-6 mr-auto transition-all duration-300 hover:text-gray-700 hover:scale-125 hover:rotate-12 hover:drop-shadow-lg"
        onClick={() => setOpen(true)}
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
              <Input label="شماره پذیرش" name="reception_number" required/>
              <Input
                label="تاریخ پذیرش"
                name="reception_date"
                value={getTodayJalaliDate()}
                readOnly
                required
              />
              <Input label="شماره سفارش" name="order_number"  required/>
            </div>
             <Select
            label="نام خودرو"
            name="car_name"
            value=""
            inputStyle="w-full"
            placeholder="نام خودرو را انتخاب کنید"
            options={[
              { value: "MVM X22 Pro MT", label: "MVM X22 Pro MT" },
              { value: "MVM X22 Pro AT", label: "MVM X22 Pro AT" },
              { value: "MVM X33 Cross MT", label: "MVM X33 Cross MT" },
              { value: "MVM X33 Cross CVT", label: "MVM X33 Cross CVT" },
              { value: "MVM Arrizo5 FL", label: "MVM Arrizo5 FL" },
              { value: "MVM X55 Pro IE", label: "MVM X55 Pro IE" },
              { value: "MVM X77", label: "MVM X77" },
              { value: "MVM X5", label: "MVM X5" },
              { value: "MVM 110", label: "MVM 110" },
              { value: "MVM 110S", label: "MVM 110S" },
              { value: "MVM 315", label: "MVM 315" },
              { value: "MVM 315 plus", label: "MVM 315 plus" },
              { value: "MVM 530", label: "MVM 530" },
              { value: "MVM 550", label: "MVM 550" },
              { value: "MVM X22", label: "MVM X22" },
              { value: "MVM X33s", label: "MVM X33s" },
              { value: "MVM X55", label: "MVM X55" },
              { value: "Fownix Arrizo 8", label: "Fownix Arrizo 8" },
              { value: "Fownix Arrizo 6 Pro", label: "Fownix Arrizo 6 Pro" },
              { value: "Fownix Arrizo 6 GT", label: "Fownix Arrizo 6 GT" },
              { value: "MVM Tiggo 7", label: "MVM Tiggo 7" },
              { value: "MVM Tiggo 7 IE", label: "MVM Tiggo 7 IE" },
              {
                value: "Fownix Tiggo 7 Pro Premium",
                label: "Fownix Tiggo 7 Pro Premium",
              },
              {
                value: "Fownix Tiggo 7 Pro Max",
                label: "Fownix Tiggo 7 Pro Max",
              },
              {
                value: "Fownix Tiggo 7 Pro Max AWD",
                label: "Fownix Tiggo 7 Pro Max AWD",
              },
              { value: "Arrizo 8 e+", label: "Arrizo 8 e+" },
              {
                value: "Fownix Tiggo 8 Pro Max IE",
                label: "Fownix Tiggo 8 Pro Max IE",
              },
              { value: "Fownix FX", label: "Fownix FX" },
              { value: "Fownix FX AWD", label: "Fownix FX AWD" },
              {
                value: "Fownix Tiggo 7 Pro e+",
                label: "Fownix Tiggo 7 Pro e+",
              },
              {
                value: "Fownix Tiggo 8 Pro e+",
                label: "Fownix Tiggo 8 Pro e+",
              },
              { value: "Fownix FX EV", label: "Fownix FX EV" },
              { value: "XTRIM VX", label: "XTRIM VX" },
              { value: "XTRIM TXL", label: "XTRIM TXL" },
              { value: "XTRIM LX", label: "XTRIM LX" },
              { value: "XTRIM RX", label: "XTRIM RX" },
            ]}
            required
          />

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
               {orderChannel === "بازار آزاد" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="نام بازار" name="market_name" required/>
                <Input label="تلفن بازار" name="market_phone" required />
              </div>
            )}


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
            </div>

            {/* تغییر فقط این بخش: تعداد و نام قطعه در یک ردیف */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="نام قطعه"
                name="piece_name"
                value={formValues.piece_name}
                readOnly
                required
              />
              <Input
                label="تعداد"
                name="number_of_pieces"
                type="number"
                isPositiveNumber
                required
              />
            </div>

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