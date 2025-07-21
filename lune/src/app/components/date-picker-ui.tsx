"use client"

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon } from "lucide-react";
import { convertToJalali } from "../utils/date-utils";

export const Calendar24 = ({
  value,
  onChange,
  label,
  name,
  required,
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  name?: string;
  required?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // ولیدیشن ساده: فقط اعداد و اسلش مجازند
    if (!/^[\d/]*$/.test(val)) return;

    // ماه و روز نباید بیشتر از 12 و 31 باشند
    const [y, m, d] = val.split("/").map(Number);
    if (m > 12 || d > 31) return;

    setInputValue(val);
    onChange(val);
  };

  const handleTodayClick = () => {
    const today = convertToJalali(new Date());
    setInputValue(today);
    onChange(today);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <Label htmlFor={name} className="px-1">
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between font-normal"
          >
            {inputValue || "تاریخ را انتخاب کنید"}
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-4 flex flex-col gap-2">
          <Input
            name={name}
            required={required}
            placeholder="مثلاً 1404/05/30"
            value={inputValue}
            onChange={handleChange}
            dir="ltr"
          />
          <Button variant="secondary" onClick={handleTodayClick}>
            امروز
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
