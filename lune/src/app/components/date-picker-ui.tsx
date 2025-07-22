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
import { useRef } from "react";
import clsx from "clsx";

type JalaliDatePickerProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  rulesExtra?: RegisterOptions<T, Path<T>>; 
  placeholder?: string;
  className?: string;
  showHiddenInput?: boolean;
};


const faDigits = "۰۱۲۳۴۵۶۷۸۹";
const toEnDigits = (s: string) => s.replace(/[۰-۹]/g, (d) => faDigits.indexOf(d).toString());
const sanitizeInput = (s: string) => toEnDigits(s).replace(/[^\d/]/g, "");
const JALALI_REGEX = /^\d{4}\/\d{2}\/\d{2}$/;

const isValidJalaliString = (val: string) => {
  if (!JALALI_REGEX.test(val)) return false;
  const [y, m, d] = val.split("/").map(Number);
  return jalaali.isValidJalaaliDate(y, m, d);
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
}: JalaliDatePickerProps<T>) {
  const dpRef = useRef<any>(null); 

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        ...(required ? { required: "تاریخ الزامی است" } : {}),
        validate: (v: string) => {
          if (!v) return required ? "تاریخ وارد شده معتبر نیست" : true;
          return isValidJalaliString(v) || "تاریخ وارد شده معتبر نیست";
        },
        ...(rulesExtra ?? {}),
      }}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
        const handleTyping = (raw: string) => {
          onChange(sanitizeInput(raw));
        };

        const handlePickerChange = (
          val: DateObject | DateObject[] | string | null
        ) => {
          let out = "";
          if (Array.isArray(val)) out = val[0]?.format?.("YYYY/MM/DD") ?? "";
          else if (typeof val === "string") out = sanitizeInput(val);
          else out = val?.format?.("YYYY/MM/DD") ?? "";
          onChange(out);
        };

        const handleBlur = () => {
          if (!value) return onBlur();
          const [y, m, d] = value.split("/").map(Number);
          if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            const padded = `${y.toString().padStart(4, "0")}/${m
              .toString()
              .padStart(2, "0")}/${d.toString().padStart(2, "0")}`;
            onChange(padded);
          }
          onBlur();
        };

        return (
          <div className={clsx("w-full space-y-1", className)}>
            {label && (
              <label htmlFor={name} className="text-sm font-medium ml-auto">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
            )}

            <div className="relative">
              <DatePicker
                ref={dpRef}
                calendar={persian}
                locale={persian_fa}
                digits={["0","1","2","3","4","5","6","7","8","9"]}
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
                  <>
                    <input
                      id={name}
                      dir="ltr"
                      placeholder={placeholder}
                      value={value || ""}
                      onChange={(e) => handleTyping(e.target.value)}
                      onBlur={handleBlur}
                      className={clsx(
                        "w-full h-10 pl-10 pr-3 rounded-md border text-sm text-right focus:outline-none focus:ring-2",
                        error
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      )}
                    />

                    <button
                      type="button"
                      aria-label="باز کردن تقویم"
                      onClick={openCalendar}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                    >
                      <CalendarDays size={18} />
                    </button>
                  </>
                )}
              />

              {showHiddenInput && (
                <input type="hidden" name={name} value={value || ""} />
              )}
            </div>

            {error && (
              <p className="text-red-600 text-xs mt-1">{error.message as string}</p>
            )}
          </div>
        );
      }}
    />
  );
}
