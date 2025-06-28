"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/button";
import { Input } from "../components/custom-form/input";
import { Form } from "../components/custom-form/form";
import { toast } from "sonner";

const ORDER_TYPES = [
  { value: "VOR", label: "سفارش VOR (فوری)" },
  { value: "VIS", label: "سفارش VIS (عادی)" },
] as const;

type OrderType = (typeof ORDER_TYPES)[number]["value"];

export default function SettingsPage() {
  const [days, setDays] = useState<Record<OrderType, number>>({
    VIS: 10,
    VOR: 7,
  });

  useEffect(() => {
    const saved = localStorage.getItem("orderSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.VIS && parsed?.VOR) setDays(parsed);
      } catch (error) {
        console.error("تنظیمات ذخیره‌شده نامعتبر است");
      }
    }
  }, []);

  const handleSubmit = () => {
    localStorage.setItem("orderSettings", JSON.stringify(days));
    toast.success("تنظیمات با موفقیت ذخیره شد.");
  };

  return (
    <div className="max-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md bg-white p-6 rounded-xl border border-gray-200 mt-16">
        <h1 className="text-xl font-semibold text-center text-gray-800 mb-5">
          تنظیمات روز دریافت قطعه
        </h1>

        <Form
          onSubmit={handleSubmit}
          submitText="ذخیره تغییرات"
          cancelText="لغو"
          className="space-y-5"
        >
          {ORDER_TYPES.map((type) => (
            <div
              key={type.value}
              className="flex flex-col gap-2 border border-gray-100 p-4 rounded-lg"
            >
              <p className="text-sm text-gray-700 font-medium">{type.label}</p>
              <Input
                name={`${type.value}-day-count`}
                label="تعداد روز"
                type="number"
                value={String(days[type.value])}
                onChange={(val?: string) =>
                  setDays((prev) => ({
                    ...prev,
                    [type.value]: val ? Number(val) : 0,
                  }))
                }
              />
            </div>
          ))}
        </Form>
      </div>
    </div>

  );
}
