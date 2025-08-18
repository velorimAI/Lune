"use client";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CalendarDays } from "lucide-react";
import { useRef } from "react";
import { Input } from "./custom-form/input";

interface PersianDatePickerProps {
  label?: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  label,
  name,
  value,
  onChange,
  className = "",
}) => {
  const datePickerRef = useRef<any>(null);

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={name} className="mb-1 text-sm font-medium ml-auto text-gray-700">
          {label}
        </label>
      )}

      <div className="relative w-full">
        <DatePicker
          ref={datePickerRef}
          calendar={persian}
          locale={persian_fa}
          className="w-full"
          inputClass="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          format="YYYY/MM/DD"
          value={value}
          onChange={(date) => {
            const formatted = date?.format?.("YYYY/MM/DD");
            onChange?.(formatted || "");
          }}
        />

        <CalendarDays
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-600"
          onClick={() => datePickerRef.current?.openCalendar?.()}
          size={18}
        />
      </div>

      <Input type="hidden" name={name} value={value || ""} />
    </div>
  );
};
