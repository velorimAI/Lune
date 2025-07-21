"use client";
import { Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { InsertDate } from "../orders/components/insert-date";

interface DatePickerInsertProps {
    label: string;
    name: string;
    value?: string;
    onChange?: (value: string) => void;
    required?: boolean;
}

export const DatePickerInsert = ({
    label,
    name,
    value,
    onChange,
    required,
}: DatePickerInsertProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleInputChange = (inputValue: string) => {
        const cleanValue = inputValue.replace(/[A-Za-z؀-ۿ]/g, '');
        onChange?.(cleanValue);
    };

    const handleDateSubmit = (data: { Date: string; time: string }) => {
        onChange?.(data.Date);
    };

    return (
        <>
            <div className="w-full space-y-1">
                <Label htmlFor={name} className="text-sm font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>

                <div className="relative">
                    <input
                        type="text"
                        id={name}
                        name={name}
                        value={value || ""}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="مثال: 1404/4/26"
                        className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-left"
                        dir="ltr"
                    />

                    <Calendar
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-black transition-colors"
                        size={18}
                        onClick={() => setModalOpen(true)}
                    />
                </div>

                <input type="hidden" name={name} value={value || ""} />
            </div>

            <InsertDate
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleDateSubmit}
            />
        </>
    );
};