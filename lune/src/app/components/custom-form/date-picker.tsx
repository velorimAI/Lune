"use client";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Label } from "@/components/ui/label";
import { CalendarDays} from "lucide-react";
import { useRef, useState } from "react";

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
  const datePickerRef = useRef<any>(null);
  const [isOpen, setIsOpen] = useState(false); // <-- مدیریت وضعیت باز/بسته بودن

  const handleInputChange = (inputValue: string) => {
    const cleanValue = inputValue.replace(/[A-Za-z؀-ۿ]/g, '');
    onChange?.(cleanValue);
  };

  const toggleCalendar = () => {
    if (isOpen) {
      datePickerRef.current?.closeCalendar?.();
      setIsOpen(false);
    } else {
      datePickerRef.current?.openCalendar?.();
      setIsOpen(true);
    }
  };

  return (
    <div className="w-full space-y-1">
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="relative">
        <DatePicker
          ref={datePickerRef}
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-right"
          format="YYYY/MM/DD"
          digits={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
          inputClass="w-full h-10 pl-20 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          value={value}
          onOpen={() => setIsOpen(true)} // وقتی باز شد
          onClose={() => setIsOpen(false)} // وقتی بسته شد
          onChange={(date: any) => {
            const formatted = date?.format?.("YYYY/MM/DD", { digits: "en" });
            handleInputChange(formatted || "");
          }}
          onPropsChange={(props: any) => {
            if (props.value && typeof props.value === 'string') {
              handleInputChange(props.value);
            }
          }}
          hideOnScroll
          arrow={false}
          placeholder="1404/4/26"
        />

        <CalendarDays
          className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-black transition-colors"
          size={18}
          onClick={toggleCalendar}
        />
      </div>

      <input type="hidden" name={name} value={value || ""} />
    </div>
  );
};
