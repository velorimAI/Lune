import { useEffect, useState } from "react";
import { Input } from "@/app/components/custom-form/input";
import { Select } from "@/app/components/custom-form/select-box";
import { Form } from "@/app/components/custom-form/form";
import { Card } from "@/app/components/card";
import { usePartInputRefs } from "../hooks";
import { PartIdInput } from "./part-id-input";
import { TextArea } from "@/app/components/custom-form/text-area";
import { useGetSettings } from "@/app/settings/hooks/use-get-settings";


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
  const [arrivalDays, setArrivalDays] = useState<string>("1");
  const [formValues, setFormValues] = useState({
    part_id: '',
    piece_name: '',
  });

  useEffect(() => {
    if (estimatedArrivalDays !== undefined && estimatedArrivalDays !== null) {
      setArrivalDays(String(estimatedArrivalDays));
    } else {
      setArrivalDays("1");
    }
  }, [estimatedArrivalDays]);


  return (
    <Card title="اطلاعات قطعه" className="p-0 pb-4">
      <Form
      
        submitText="ثبت قطعه"
        cancelHide
        onSubmit={(data) => {
          onSubmit({ ...data, estimated_arrival_days: arrivalDays });
        }}
        submitDisable={!userInfoSubmitted}
        className="mt-1"
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
              disabled={!userInfoSubmitted}
            // ref={refs.partIdRef}
            />
            <Input
              label="نام قطعه"
              name="piece_name"
              value={formValues.piece_name}
              required
              readOnly
              disabled={!userInfoSubmitted}
              ref={refs.pieceNameRef}
            />
            <Input
              label="تعداد"
              type="number"
              name="number_of_pieces"
              required
              ref={refs.numberOfPiecesRef}
              disabled={!userInfoSubmitted}
              isPositiveNumber={true}
            />
          </div>

          <div
            className={`grid grid-cols-1 ${orderChannel === "بازار آزاد"
              ? "md:grid-cols-5"
              : "md:grid-cols-3"
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
              onChange={(data) => setOrderChannel(data)}
              disabled={!userInfoSubmitted}
              hiddenSearch
            />
            {orderChannel === "بازار آزاد" && (
              <>
                <Input label="نام فروشنده" name="market_name" required />
                <Input label="تلفن فروشنده" name="market_phone" phone required />
              </>
            )}
            <Input
              label="شماره سفارش"
              name="order_number"
              required
              ref={refs.orderNumberRef}
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
              onChange={(value) => setArrivalDays(value || "1")}
              disabled={!userInfoSubmitted}
            />
          </div>

          <div className="mt-2">

            <div className="col-span-1 sm:col-span-2 md:col-span-4">
              <TextArea
                label="توضیحات"
                name="all_description"
                placeholder="توضیحاتی درباره سفارش وارد کنید..."
                className="mb-6 w-full col-span-1 sm:col-span-2 md:col-span-4"
              />
            </div>
          </div>
        </div>
      </Form>
    </Card>
  );
}