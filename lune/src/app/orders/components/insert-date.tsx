"use client";
import { JalaliDatePicker } from "@/app/components/custom-form/date-picker";
import { Form } from "@/app/components/custom-form/form";
import { Modal } from "@/app/components/modal";
import { TimePicker } from "@/app/components/time-picker";
import { toZonedTime } from "date-fns-tz";
import React, { useEffect, useState } from "react";

interface InsertDateProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { Date: string; time: string }) => void;
}

export const InsertDate: React.FC<InsertDateProps> = ({
    open,
    onClose,
    onSubmit,
}) => {
    const [time, setTime] = useState('00:00');
    const [date, setDate] = useState('');

    useEffect(() => {
        if (open) {
            const now = toZonedTime(new Date(), 'Asia/Tehran');
            const hour = now.getHours().toString().padStart(2, '0');
            const minute = now.getMinutes().toString().padStart(2, '0');
            setTime(`${hour}:${minute}`);
            setDate('');
        }
    }, [open]);

    const handleSubmit = () => {
        const finalData = {
            Date: date,
            time,
        };
        onSubmit(finalData);
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title="تاریخ و ساعت نوبت داده شده را وارد کنید"
            hideCancel
            hideConfirm
        >
            <Form
                onSubmit={handleSubmit}
                onCancel={onClose}
                submitText="ثبت تاریخ و ساعت"
                cancelText="انصراف"
                className="w-full"
            >
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="w-full sm:w-2/3">
                        <JalaliDatePicker
                            label="تاریخ"
                            name="Date"
                            value={date}
                            onChange={setDate}
                            required
                        />
                    </div>
                    <div className="w-full sm:w-1/3">
                        <TimePicker
                            value={time}
                            onChange={setTime}
                            required
                            label="ساعت"
                        />
                    </div>
                </div>
            </Form>
        </Modal>
    );
};