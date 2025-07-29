"use client";

import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import jalaali from "jalaali-js";
import { CalendarDays } from "lucide-react";
import { useRef, useState } from "react";
import clsx from "clsx";
import { FormLabel } from "./custom-form/form-label";
import { Input } from "./custom-form/input";
import { Button } from "./button";

type JalaliDatePickerProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  rulesExtra?: RegisterOptions<T, Path<T>>;
  placeholder?: string;
  className?: string;
  showHiddenInput?: boolean;
  disabled?: boolean;
};

const faDigits = "۰۱۲۳۴۵۶۷۸۹";
const toEnDigits = (s: string) => s.replace(/[۰-۹]/g, (d) => faDigits.indexOf(d).toString());

// Enhanced sanitization with auto-formatting
const sanitizeAndFormat = (s: string) => {
  // Convert Persian digits to English and remove non-numeric/slash characters
  let cleaned = toEnDigits(s).replace(/[^\d]/g, "");

  // Auto-format as user types: YYYY/MM/DD
  if (cleaned.length >= 5) {
    cleaned = cleaned.slice(0, 4) + "/" + cleaned.slice(4);
  }
  if (cleaned.length >= 8) {
    cleaned = cleaned.slice(0, 7) + "/" + cleaned.slice(7, 9);
  }

  return cleaned.slice(0, 10); // Limit to YYYY/MM/DD format
};

const JALALI_REGEX = /^\d{4}\/\d{2}\/\d{2}$/;

const isValidJalaliString = (val: string) => {
  if (!JALALI_REGEX.test(val)) return false;
  const [y, m, d] = val.split("/").map(Number);
  return jalaali.isValidJalaaliDate(y, m, d);
};

// Enhanced validation with better error messages
const getValidationError = (value: string, required: boolean) => {
  if (!value) {
    return required ? "تاریخ الزامی است" : true;
  }

  const parts = value.split("/");

  // Check basic format
  if (parts.length !== 3) {
    return "فرمت تاریخ باید YYYY/MM/DD باشد";
  }

  const [yearStr, monthStr, dayStr] = parts;
  const year = parseInt(yearStr);
  const month = parseInt(monthStr);
  const day = parseInt(dayStr);

  // Check if parts are numbers
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return "تاریخ وارد شده معتبر نیست";
  }

  // Check year range (reasonable range for Persian calendar)
  if (year < 1300 || year > 1500) {
    return "سال باید بین 1300 تا 1500 باشد";
  }

  // Check month range
  if (month < 1 || month > 12) {
    return "ماه باید بین 1 تا 12 باشد";
  }

  // Check day range
  if (day < 1 || day > 31) {
    return "روز باید بین 1 تا 31 باشد";
  }

  // Final validation using jalaali library
  if (!jalaali.isValidJalaaliDate(year, month, day)) {
    return "تاریخ وارد شده در تقویم جلالی معتبر نیست";
  }

  return true;
};

export function JalaliDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  required,
  rulesExtra,
  placeholder = "YYYY/MM/DD",
  className = "",
  showHiddenInput = false,
  disabled
}: JalaliDatePickerProps<T>) {
  const dpRef = useRef<any>(null);
  const [isTyping, setIsTyping] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        ...(required ? { required: "تاریخ الزامی است" } : {}),
        validate: (v: string) => getValidationError(v, required || false),
        ...(rulesExtra ?? {}),
      }}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
        const handleTyping = (raw: string) => {
          setIsTyping(true);
          const formatted = sanitizeAndFormat(raw);
          onChange(formatted);
        };

        const handlePickerChange = (
          val: DateObject | DateObject[] | string | null
        ) => {
          setIsTyping(false);
          let out = "";
          if (Array.isArray(val)) out = val[0]?.format?.("YYYY/MM/DD") ?? "";
          else if (typeof val === "string") out = sanitizeAndFormat(val);
          else out = val?.format?.("YYYY/MM/DD") ?? "";
          onChange(out);
        };

        const handleBlur = () => {
          setIsTyping(false);
          if (!value) return onBlur();

          // Auto-complete partial dates
          const parts = value.split("/");
          if (parts.length === 3) {
            const [y, m, d] = parts.map(Number);
            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
              const padded = `${y.toString().padStart(4, "0")}/${m
                .toString()
                .padStart(2, "0")}/${d.toString().padStart(2, "0")}`;
              onChange(padded);
            }
          }
          onBlur();
        };

        const handleFocus = () => {
          setIsTyping(true);
        };

        const toggleCalendar = () => {
          if (dpRef.current?.isOpen) {
            dpRef.current.closeCalendar();
          } else {
            dpRef.current.openCalendar();
            setIsTyping(false);
          }
        };

        return (
          <div className={clsx("w-full", className)}>
            {label && (
              <FormLabel
                label={label}
                required={required}
                disabled={disabled}
                className="mb-2"
              />
            )}

            <div className="relative">
              <DatePicker
                disabled={disabled}
                ref={dpRef}
                calendar={persian}
                locale={persian_fa}
                digits={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
                weekDays={["ش", "ی", "د", "س", "چ", "پ", "ج"]}
                format="YYYY/MM/DD"
                value={value || ""}
                onChange={handlePickerChange}
                editable={false}
                arrow={false}
                hideOnScroll
                calendarPosition="bottom-right"
                containerStyle={{ direction: "rtl" }}
                className="text-right"
                render={(_val, openCalendar) => (
                  <div className="relative w-full">
                    <input
                      id={name}
                      dir="ltr"
                      placeholder={placeholder}
                      value={value || ""}
                      onChange={(e) => handleTyping(e.target.value)}
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                      disabled={disabled}
                      className={clsx(
                        "w-full h-10 pl-10 pr-3 rounded-md border text-sm text-right focus:outline-none focus:ring-2 h-[36px]  ",
                        error
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      )}

                      aria-describedby={error ? `${name}-error` : undefined}
                      aria-invalid={!!error}
                    />

                    <Button
                      disabled={disabled}
                      variant={"outline"}
                      aria-label="باز کردن تقویم"
                      onClick={toggleCalendar}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 bg-white text-black hover:cursor-pointer border-none w-4 h-4"
                    >
                      <CalendarDays size={18} />
                    </Button>
                  </div>
                )}
              />

              {showHiddenInput && (
                <input type="hidden" name={name} value={value || ""} />
              )}
            </div>

            {error && (
              <p
                id={`${name}-error`}
                className="text-red-600 text-xs mt-1"
                role="alert"
              >
                {error.message as string}
              </p>
            )}

            {!error && isTyping && value && value.length > 0 && value.length < 10 && (
              <p className="text-gray-500 text-xs mt-1">
                {value.length < 4 && "سال را وارد کنید (مثال: 1402)"}
                {value.length >= 4 && value.length < 7 && "ماه را وارد کنید (01-12)"}
                {value.length >= 7 && value.length < 10 && "روز را وارد کنید (01-31)"}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}

