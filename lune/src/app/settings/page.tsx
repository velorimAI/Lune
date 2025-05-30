"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/button";
import { Input } from "../components/custom-form/input";
import { Select } from "../components/custom-form/select-box";
import { Form } from "../components/custom-form/form";

export default function SettingsPage() {
  const [days, setDays] = useState(7);
  const [orderType, setOrderType] = useState("VIS");
  const router = useRouter();

  const handleSubmit = () => {
    alert(`تنظیمات ذخیره شد:\nتعداد روز: ${days}\nنوع سفارش: ${orderType}`);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          تنظیمات سفارش
        </h1>

        <Form
          onSubmit={handleSubmit}
          submitText="ذخیره تغییرات"
          cancelText="لغو"
        >
          <div className="flex justify-center items-center gap-2 mx-6 mb-6 w-full">
            <div className="w-full">
              <Input
                label="تعداد روز"
                type="number"
                value={String(days)}
                name="day-count"
                onChange={(val?: string) => setDays(val ? Number(val) : 0)}
                className="w-full py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="w-1/2">
              <Select
                label=" سفارش"
                value={orderType}
                onChange={(option: any) => setOrderType(option.value)}
                className="w-full py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                options={[
                  { value: "VIS", label: "VIS" },
                  { value: "VOR", label: "VOR" },
                ]}
              />
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
