"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/app/components/modal";
import { Input } from "@/app/components/custom-form/input";
import { CirclePlus } from "lucide-react";
import { Form } from "@/app/components/custom-form/form";
import { Select } from "@/app/components/custom-form/select-box";
import { TimePicker } from "@/app/components/time-picker";
import { toZonedTime } from "date-fns-tz";
import { TextArea } from "@/app/components/custom-form/text-area";
import { useAddLostItem } from "../hooks";
import { JalaliDatePicker } from "@/app/components/date-picker-ui";
import { useForm } from "react-hook-form";
import { PartNameInput } from "./part-name-input";
import { useQueryClient } from "@tanstack/react-query";
import { PartIdInput } from "@/app/orders/components/part-id-input";
import { getTodayJalaliDate } from "@/app/utils/getTodayJalali";
import { carOptions } from "@/constants/carOptions";
import { SelectPopover } from "@/app/components/custom-form/select-popover";

interface AddUserModalProps {
  refetch?: () => void;
}

export const AddLostItem = ({ refetch }: AddUserModalProps) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useAddLostItem();
  const [formValues, setFormValues] = useState({
    piece_name: "",
    part_id: ""
  });
  const [hasSelected, setHasSelected] = useState(false);
  const queryClient = useQueryClient();


  const [time, setTime] = useState("00:00");

  useEffect(() => {
    if (open) {
      const now = toZonedTime(new Date(), "Asia/Tehran");
      const hour = now.getHours().toString().padStart(2, "0");
      const minute = now.getMinutes().toString().padStart(2, "0");

      setTime(`${hour}:${minute}`);
    }
  }, [open]);

  const handleSubmit = (formData: any) => {
    const finalData = {
      ...formData,
      piece_name: formValues.piece_name,
      piece_code: formValues.part_id,
      lost_date: lost_date,
      lost_time: time,
    };

    mutate(finalData, {
      onSuccess: () => {
        setFormValues({ piece_name: "", part_id: "" });
        queryClient.invalidateQueries({ queryKey: ["part-suggestions"] });
        refetch?.();
        toast.success(`قطعه "${formData.piece_name}" با موفقیت اضافه شد`);
        setOpen(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "خطا در افزودن قطعه");
      },
    });
  };

  const { control, watch } = useForm({
    defaultValues: { lost_date: getTodayJalaliDate() },
  });
  const lost_date = watch("lost_date");

  return (
    <>
      <CirclePlus
        className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform"
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        title="اضافه کردن قطعه"
        hideCancel
        hideConfirm
        contentClassName="pb-2"
        onCancel={() => setOpen(false)}
      >
        <Form
          cancelText="لغو"
          submitText="اضافه"
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        >
          <div className="grid grid-cols-3 gap-4">
            <PartNameInput
              value={formValues.piece_name}
              onChange={(val) => {
                setFormValues((prev) => ({
                  ...prev,
                  piece_name: val,
                }));
              }}
              setPieceName={(name) => {
                setFormValues((prev) => ({ ...prev, piece_name: name }));
              }}
              setHasSelected={setHasSelected}
            />

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

            // ref={refs.partIdRef}
            />

            {/* <Input label="شماره فنی" name="piece_code" required /> */}
            <Input
              label="تعداد"
              type="number"
              name="count"
              required
              isPositiveNumber={true}
            />
            {/* <Select
              label="کاربرد"
              name="car_name"
              value="MVM X5"
              inputStyle="w-full"
              options={carOptions}
              required
            /> */}
            <SelectPopover
              label="کاربرد"
              name="car_name"
              value="MVM X5"
              options={carOptions}
              required
              placeholder="انتخاب خودرو..."
            />
            {/* <Input label="تاریخ" name="lost_date" required /> */}

            <JalaliDatePicker
              control={control}
              name="lost_date"
              label="تاریخ"
              required
              className="text-right mb-2"
            />
            <TimePicker
              value={time}
              onChange={(val) => setTime(val)}
              required
              label="ساعت"
            />
            <div className="col-span-1 sm:col-span-2 md:col-span-3">
              <TextArea
                label="توضیحات"
                name="lost_description"
                placeholder="توضیحاتی درباره سفارش وارد کنید..."
                className="mb-6 w-full col-span-1 sm:col-span-2 md:col-span-4"
              />
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};
