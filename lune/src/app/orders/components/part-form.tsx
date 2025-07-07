import { useEffect, useState } from "react";
import { Input } from "@/app/components/custom-form/input";
import { Select } from "@/app/components/custom-form/select-box";
import { Form } from "@/app/components/custom-form/form";
import { Card } from "@/app/components/card";
import { usePartInputRefs } from "../hooks";

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
    onSubmit({ ...data, estimated_arrival_days: arrivalDays });
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input
            label="کد فنی"
            name="part_id"
            type="number"
            required
            ref={refs.partIdRef}
            readOnly={!userInfoSubmitted}
          />
          <Input
            label="نام قطعه"
            name="piece_name"
            required
            ref={refs.pieceNameRef}
            readOnly={!userInfoSubmitted}
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
            orderChannel === "بازار آزاد" ? "md:grid-cols-5" : "md:grid-cols-3"
          } gap-2`}
        >
          <Select
            label="کانال سفارش"
            name="order_channel"
            value={orderChannel}
            inputStyle="w-full"
            options={[
              { value: "VOR", label: "VOR" },
              { value: "VIS", label: "VIS" },
              { value: "شارژ انبار", label: "شارژ انبار" },
              { value: "بازار آزاد", label: "بازار آزاد" },
            ]}
            required
            onChange={setOrderChannel}
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
            onChange={(v) => setArrivalDays(v || "7")}
            readOnly={!userInfoSubmitted}
          />
        </div>
      </Form>
    </Card>
  );
}
