import { useEffect, useState } from "react";
import { Input } from "@/app/components/custom-form/input";
import { Select } from "@/app/components/custom-form/select-box";
import { Form } from "@/app/components/custom-form/form";
import { Card } from "@/app/components/card";
import { usePartInputRefs } from "../hooks";
import { PartIdInput } from "./part-id-input";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea component

interface PartFormProps {
  userInfoSubmitted: boolean;
  orderChannel: string;
  setOrderChannel: (value: string) => void;
  estimatedArrivalDays?: string | number;
  onSubmit: (data: any) => void;
}

export default function PartForm({
  userInfoSubmitted,
  orderChannel,
  setOrderChannel,
  estimatedArrivalDays,
  onSubmit,
}: PartFormProps) {
  const { refs } = usePartInputRefs();
  const [formKey, setFormKey] = useState(0);
  const [arrivalDays, setArrivalDays] = useState<string>("1");
  const [formValues, setFormValues] = useState({
    part_id: '',
    piece_name: '',
  });

  useEffect(() => {
    if (
      estimatedArrivalDays === undefined ||
      estimatedArrivalDays === null ||
      estimatedArrivalDays === ""
    ) {
      setArrivalDays("1");
    } else {
      setArrivalDays(String(estimatedArrivalDays));
    }
  }, [estimatedArrivalDays, formKey]);

  const handleFormSubmit = (data: any) => {
    onSubmit({ 
      ...data, 
      estimated_arrival_days: arrivalDays,
      description: data.description || "" // اضافه کردن توضیحات به داده‌های ارسالی
    });
    setFormKey((prev) => prev + 1);
    setOrderChannel("VOR");
    setArrivalDays("7");
  };

  return (
    <Card title="اطلاعات قطعه">
      <Form
        key={formKey}
        submitText="ثبت قطعه"
        cancelHide
        onSubmit={handleFormSubmit}
        submitDisable={!userInfoSubmitted}
      >
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <PartIdInput
              value={formValues.part_id}
              onChange={(val) => {
                setFormValues((prev) => ({
                  ...prev,
                  part_id: val,
                  piece_name: val ? prev.piece_name : "",
                }));
              }}
              setPieceName={(name) => {
                setFormValues((prev) => ({ ...prev, piece_name: name }));
              }}
              readOnly={!userInfoSubmitted}
            />
            <Input
              label="نام قطعه"
              name="piece_name"
              value={formValues.piece_name}
              required
              readOnly
            />
            <Input
              label="تعداد"
              type="number"
              isPositiveNumber
              name="number_of_pieces"
              required
              ref={refs.numberOfPiecesRef}
              readOnly={!userInfoSubmitted}
            />
          </div>

          <div
            className={`grid grid-cols-1 ${
              orderChannel === "بازار آزاد"
                ? "md:grid-cols-5"
                : "md:grid-cols-3"
            } gap-2`}
          >
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
              onChange={(data) => setOrderChannel(data)}
              disabled={!userInfoSubmitted}
            />
            {orderChannel === "بازار آزاد" && (
              <>
                <Input label="نام فروشنده" name="market_name" />
                <Input label="تلفن فروشنده" name="market_phone" phone />
              </>
            )}
            <Input
              label="شماره سفارش"
              name="order_number"
              required
              ref={refs.orderNumberRef}
              readOnly={!userInfoSubmitted}
            />
            <Input
              label={
                orderChannel === "بازار آزاد"
                  ? "دریافت(روز)"
                  : "زمان تخمینی دریافت (روز)"
              }
              name="estimated_arrival_days"
              required
              value={arrivalDays}
              onChange={(value) => setArrivalDays(value || "1")}
              readOnly={!userInfoSubmitted}
            />
          </div>

          {/* فیلد توضیحات جدید */}
          <div className="mt-4">
            <Textarea
              aria-label="توضیحات"
              name="description"
              placeholder="توضیحات اختیاری (مثلاً محل دقیق قطعه یا نکات فنی)"
              className="min-h-[100px]"
              readOnly={!userInfoSubmitted}
              onInput={(e) => {
                const target = e.currentTarget;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
          </div>
        </div>
      </Form>
    </Card>
  );
}