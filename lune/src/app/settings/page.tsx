"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/button";
import { Input } from "../components/custom-form/input";
import { Form } from "../components/custom-form/form";
import clsx from "clsx";

export default function SettingsPage() {
  const [orderType, setOrderType] = useState("VIS");
  const [days, setDays] = useState({
    VIS: 7,
    VOR: 3,
  });

  const router = useRouter();

  const handleSubmit = () => {
    alert(`تنظیمات ذخیره شد:\nنوع سفارش: ${orderType}\nتعداد روز`);
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
          <div className="flex flex-col gap-4 mb-6">
            {["VIS", "VOR"].map((type) => (
              <div
                key={type}
                className="flex items-center gap-4 border border-gray-200 p-3 rounded-lg"
              >
                {/* دکمه انتخاب نوع سفارش */}
                <button
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={clsx(
                    "px-4 py-2 rounded-md border text-sm font-semibold transition whitespace-nowrap",
                    
                  )}
                >
                  {type}
                </button>

                {/* فیلد تعداد روز */}
                <Input
                  label="تعداد روز"
                  type="number"
                  value={String(days[type as "VIS" | "VOR"])}
                  name={`${type}-day-count`}
                  onChange={(val?: string) =>
                    setDays((prev) => ({
                      ...prev,
                      [type]: val ? Number(val) : 0,
                    }))
                  }
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </Form>
      </div>
    </div>
  );
}
