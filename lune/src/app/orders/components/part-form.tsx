// part-form.tsx
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/app/components/custom-form/input";
import { Select } from "@/app/components/custom-form/select-box";
import { Form } from "@/app/components/custom-form/form";
import { Card } from "@/app/components/card";
import { PartIdInput } from "./part-id-input";
import { TextArea } from "@/app/components/custom-form/text-area";

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
  const [formKey, setFormKey] = useState(0);
  const [arrivalDays, setArrivalDays] = useState<string>("1");
  const [formValues, setFormValues] = useState({ part_id: "", piece_name: "" });
  const [numberOfPieces, setNumberOfPieces] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState<string>("");

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

  const resetFormFields = () => {
    setFormValues({ part_id: "", piece_name: "" });
    setArrivalDays("1");
    setNumberOfPieces("");
    setOrderNumber("");
  };

  const handleFormSubmit = (data: any) => {
    onSubmit({ ...data, estimated_arrival_days: arrivalDays });

    // با تغییر key، <Form> مجدداً mount می‌شود و همه فیلدهای غیرکنترل‌شده خالی می‌گردد:
    setFormKey((prev) => prev + 1);

    // برای فیلدهای کنترل‌شده هم state را ریست می‌کنیم:
    resetFormFields();

    // بازنشانی کانال و مقدار پیش‌فرض
    setOrderChannel("VOR");
    setArrivalDays("7");
  };

  return (
    <Card title="اطلاعات قطعه" className="p-0 pb-4">
      <Form
        key={formKey}
        submitText="ثبت قطعه"
        cancelHide
        onSubmit={handleFormSubmit}
        submitDisable={!userInfoSubmitted}
        className="mt-1"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <PartIdInput
            value={formValues.part_id}
            onChange={(val) =>
              setFormValues((prev) => ({
                ...prev,
                part_id: val ?? "",
                piece_name: val ? prev.piece_name : "",
              }))
            }
            setPieceName={(name) =>
              setFormValues((prev) => ({ ...prev, piece_name: name }))
            }
            disabled={!userInfoSubmitted}
          />

          <Input
            label="نام قطعه"
            name="piece_name"
            value={formValues.piece_name}
            required
            readOnly
            disabled={!userInfoSubmitted}
          />

          <Input
            label="تعداد"
            type="number"
            isPositiveNumber
            name="number_of_pieces"
            required
            value={numberOfPieces}
            onChange={(val) => setNumberOfPieces(val ?? "")}
            disabled={!userInfoSubmitted}
          />
        </div>

        <div
          className={`grid grid-cols-1 ${
            orderChannel === "بازار آزاد" ? "md:grid-cols-5" : "md:grid-cols-3"
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
            onChange={(data) => setOrderChannel(data ?? "VOR")}
            disabled={!userInfoSubmitted}
            hiddenSearch
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
            value={orderNumber}
            onChange={(val) => setOrderNumber(val ?? "")}
            disabled={!userInfoSubmitted}
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
            onChange={(value) => setArrivalDays(value ?? "1")}
            disabled={!userInfoSubmitted}
          />
        </div>

        <div className="mt-2">
          <TextArea
            label="توضیحات"
            name="all_description"
            placeholder="توضیحاتی درباره سفارش وارد کنید..."
            className="mb-6 w-full"
          />
        </div>
      </Form>
    </Card>
  );
}
