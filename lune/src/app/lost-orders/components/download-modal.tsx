"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/app/components/modal";
import { Download } from "lucide-react";
import { DownloadLostOrders } from "./download-lost-order";
import { JalaliDatePicker } from "@/app/components/date-picker-ui";

type FormValues = {
  fromDate: string;
  toDate: string;
};

export const DownloadModal = () => {
  const [open, setOpen] = useState(false);

  const { control, watch } = useForm<FormValues>({
    defaultValues: { fromDate: "", toDate: "" },
  });

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  const isValidRange = (() => {
    if (!fromDate || !toDate) return true;
    const [fy, fm, fd] = fromDate.split("/").map(Number);
    const [ty, tm, td] = toDate.split("/").map(Number);
    const fKey = fy * 10000 + fm * 100 + fd;
    const tKey = ty * 10000 + tm * 100 + td;
    return fKey <= tKey;
  })();

  const canDownload = !!fromDate && !!toDate && isValidRange;

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-colors"
        title="دانلود گزارش"
      >
        <Download className="text-gray-700 hover:text-purple-600" />
      </div>

      <Modal
        open={open}
        title="دانلود قطعات از دست رفته"
        hideCancel
        hideConfirm
        contentClassName="pb-2"
        onCancel={() => setOpen(false)}
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <JalaliDatePicker<FormValues>
                control={control}
                name="fromDate"
                label="از تاریخ"
                required
                className="text-right"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <JalaliDatePicker<FormValues>
                control={control}
                name="toDate"
                label="تا تاریخ"
                required
                className="text-right"
              />
            </div>
          </div>

          {!isValidRange && fromDate && toDate && (
            <div className="text-right text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              ⚠️ تاریخ شروع باید کمتر یا مساوی تاریخ پایان باشد
            </div>
          )}

          {canDownload && (
            <div className="text-right text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
              ✅ بازه تاریخی انتخاب شده: از {fromDate} تا {toDate}
            </div>
          )}

          <div className="mt-6 pt-4 border-t">
            {canDownload ? (
              <DownloadLostOrders fromDate={fromDate} toDate={toDate} />
            ) : (
              <div className="text-center py-4">
                <div className="text-gray-500 mb-2">
                  برای دانلود، لطفاً هر دو تاریخ را انتخاب کنید
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  {!fromDate && "• تاریخ شروع انتخاب نشده"}
                  {!toDate && "• تاریخ پایان انتخاب نشده"}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
