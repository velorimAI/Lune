"use client";

import { Form } from "@/app/components/custom-form/form";
import { JalaliDatePicker } from "@/app/components/date-picker-ui";
import { Modal } from "@/app/components/modal";
import { TimePicker } from "@/app/components/time-picker";
import { getTodayJalaliDate } from "@/app/utils/getTodayJalali";
import { toZonedTime } from "date-fns-tz";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface InsertDateProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { Date: string; time: string }) => void;
}

export const InsertDate = ({
  open,
  onClose,
  onSubmit,
}: InsertDateProps) => {
  const [time, setTime] = useState("00:00");

  const { control, watch, reset } = useForm({
    defaultValues: { date: getTodayJalaliDate() },
  });

  const selectedDate = watch("date");

  useEffect(() => {
    if (open) {
      const now = toZonedTime(new Date(), "Asia/Tehran");
      const hour = now.getHours().toString().padStart(2, "0");
      const minute = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hour}:${minute}`);
      reset({ date: getTodayJalaliDate() });
    }
  }, [open, reset]);

  const submitHandler = () => {
    if (!selectedDate || !time) return;

    onSubmit({
      Date: selectedDate,
      time,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="تاریخ و ساعت نوبت داده شده را وارد کنید"
      hideCancel
      hideConfirm
    >
      <Form
        onSubmit={submitHandler}
        onCancel={onClose}
        submitText="ثبت تاریخ و ساعت"
        cancelText="انصراف"
        className="w-full"
      >
        <div className="flex  gap-2 w-full">
          <div className="w-full sm:w-2/3 text-right">
            <JalaliDatePicker
              control={control}
              name="date"
              label="تاریخ پذیرش"
              required
              className=" w-full"
            />
          </div>
          <div className="w-full sm:w-1/3">
            <TimePicker
              value={time}
              onChange={setTime}
              required
              label="ساعت"
            />
          </div>
        </div>
      </Form>
    </Modal>
  );
};
