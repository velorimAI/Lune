"use client";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Label } from "@/components/ui/label";


interface JalaliDatePickerProps {
  label: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

export const JalaliDatePicker = ({
  label,
  name,
  value,
  onChange,
  required,
}: JalaliDatePickerProps) => {
  return (
    <div className="w-full space-y-1">
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        format="YYYY/MM/DD"
        inputClass="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none"
        value={value}
        onChange={(date: any) => {
          const formatted = date?.format?.("YYYY/MM/DD", { digits: "en" }); 
          onChange?.(formatted);
        }}
      />
    </div>
  );
};
