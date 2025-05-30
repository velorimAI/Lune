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
    // اینجا ذخیره‌سازی یا ارسال درخواست API می‌تونی انجام بدی
    alert(`تنظیمات ذخیره شد:\nتعداد روز: ${days}\nنوع سفارش: ${orderType}`);
    router.push("/");
  };

  return (
    <div className="max-w-md mx-auto mt-40 p-6 bg-white shadow rounded">
      <Form onSubmit={handleSubmit} submitText="ذخیره تغییرات" >
        <h1 className="text-xl font-bold mb-6 text-center">تنظیمات سفارش</h1>

        {/* فیلد تعداد روز */}
        <div className="mb-4">
          <Input
            label="تعداد روز"
            type="number"
            value={String(days)}
            name="day-count"
            onChange={(val?: string) => setDays(val ? Number(val) : 0)}
            className="w-full px-3 py-2 border rounded text-right"
          />
        </div>

        {/* فیلد نوع سفارش */}
        <div className="mb-6">
          <Select
            label="نوع سفارش"
            value={orderType}
            onChange={(option: any) => setOrderType(option.value)}
            className="w-full px-3 py-2 border rounded text-right"
            options={[
              { value: "VIS", label: "VIS" },
              { value: "VOR", label: "VOR" },
            ]}
          />
        </div>
      </Form>
    </div>
  );
}
