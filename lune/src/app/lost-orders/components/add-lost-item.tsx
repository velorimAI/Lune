'use client';

import { FC, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '@/app/components/modal';
import { Input } from '@/app/components/custom-form/input';
import { CirclePlus, PackagePlus } from 'lucide-react';
import { Form } from '@/app/components/custom-form/form';
import { Select } from '@/app/components/custom-form/select-box';
import { TimePicker } from '@/app/components/time-picker';
import { toZonedTime } from 'date-fns-tz';
import { TextArea } from '@/app/components/custom-form/text-area';
import { useAddLostItem } from '../hooks';
import { JalaliDatePicker } from '@/app/components/date-picker-ui';
import { useForm } from 'react-hook-form';


interface AddUserModalProps {
    refetch?: () => void;
}


export const AddLostItem: FC<AddUserModalProps> = ({ refetch }) => {
    const [open, setOpen] = useState(false);
    const { mutate, isPending } = useAddLostItem();

    const [time, setTime] = useState("00:00");

    useEffect(() => {
        if (open) {
            const now = toZonedTime(new Date(), "Asia/Tehran");
            const hour = now.getHours().toString().padStart(2, "0");
            const minute = now.getMinutes().toString().padStart(2, "0");

            setTime(`${hour}:${minute}`);
        }
    }, [open]);

    const handleSubmit = (formData: any) => {
        const finalData = {
            ...formData,
            lost_date: lost_date,
            lost_time: time,
        };

        mutate(finalData, {
            onSuccess: () => {
                refetch?.();
                toast.success(`قطعه "${formData.piece_name}" با موفقیت اضافه شد`);
                setOpen(false);
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "خطا در افزودن قطعه");
            },
        });
        // console.log(formData);

    };

    const { control, watch } = useForm({
        defaultValues: { lost_date: "" },
    });
    const lost_date = watch("lost_date");

    return (
        <>
            <CirclePlus className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform" onClick={() => setOpen(true)} />
            <Modal
                open={open}
                title="اضافه کردن قطعه"
                hideCancel
                hideConfirm
                contentClassName='pb-2'
                onCancel={() => setOpen(false)}
            >
                <Form cancelText='لغو' submitText='اضافه' onSubmit={handleSubmit} onCancel={() => setOpen(false)}   >
                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            label="نام قطعه"
                            name="piece_name"
                            required
                            placeholder="مثلاً: برد تغذیه، صفحه نمایش، موتور"

                        />
                        <Input
                            label="شماره فنی"
                            name="piece_code"
                            required
                            placeholder="مثلاً: P-4582 یا 21DF-XP12"
                        />
                        <Input
                            label="تعداد"
                            type="number"
                            name="count"
                            required
                            isPositiveNumber={true}
                        />
                        <Select
                            label="کاربرد"
                            name="car_name"
                            value=""
                            inputStyle="w-full"
                            placeholder="کاربرد را انتخاب کنید"
                            options={[
                                { value: "MVM X22 Pro MT", label: "MVM X22 Pro MT" },
                                { value: "MVM X22 Pro AT", label: "MVM X22 Pro AT" },
                                { value: "MVM X33 Cross MT", label: "MVM X33 Cross MT" },
                                { value: "MVM X33 Cross CVT", label: "MVM X33 Cross CVT" },
                                { value: "MVM Arrizo5 FL", label: "MVM Arrizo5 FL" },
                                { value: "MVM X55 Pro IE", label: "MVM X55 Pro IE" },
                                { value: "MVM X77", label: "MVM X77" },
                                { value: "MVM X5", label: "MVM X5" },
                                { value: "MVM 110", label: "MVM 110" },
                                { value: "MVM 110S", label: "MVM 110S" },
                                { value: "MVM 315", label: "MVM 315" },
                                { value: "MVM 315 plus", label: "MVM 315 plus" },
                                { value: "MVM 530", label: "MVM 530" },
                                { value: "MVM 550", label: "MVM 550" },
                                { value: "MVM X22", label: "MVM X22" },
                                { value: "MVM X33s", label: "MVM X33s" },
                                { value: "MVM X55", label: "MVM X55" },
                                { value: "Fownix Arrizo 8", label: "Fownix Arrizo 8" },
                                { value: "Fownix Arrizo 6 Pro", label: "Fownix Arrizo 6 Pro" },
                                { value: "Fownix Arrizo 6 GT", label: "Fownix Arrizo 6 GT" },
                                { value: "MVM Tiggo 7", label: "MVM Tiggo 7" },
                                { value: "MVM Tiggo 7 IE", label: "MVM Tiggo 7 IE" },
                                {
                                    value: "Fownix Tiggo 7 Pro Premium",
                                    label: "Fownix Tiggo 7 Pro Premium",
                                },
                                {
                                    value: "Fownix Tiggo 7 Pro Max",
                                    label: "Fownix Tiggo 7 Pro Max",
                                },
                                {
                                    value: "Fownix Tiggo 7 Pro Max AWD",
                                    label: "Fownix Tiggo 7 Pro Max AWD",
                                },
                                { value: "Arrizo 8 e+", label: "Arrizo 8 e+" },
                                {
                                    value: "Fownix Tiggo 8 Pro Max IE",
                                    label: "Fownix Tiggo 8 Pro Max IE",
                                },
                                { value: "Fownix FX", label: "Fownix FX" },
                                { value: "Fownix FX AWD", label: "Fownix FX AWD" },
                                {
                                    value: "Fownix Tiggo 7 Pro e+",
                                    label: "Fownix Tiggo 7 Pro e+",
                                },
                                {
                                    value: "Fownix Tiggo 8 Pro e+",
                                    label: "Fownix Tiggo 8 Pro e+",
                                },
                                { value: "Fownix FX EV", label: "Fownix FX EV" },
                                { value: "XTRIM VX", label: "XTRIM VX" },
                                { value: "XTRIM TXL", label: "XTRIM TXL" },
                                { value: "XTRIM LX", label: "XTRIM LX" },
                                { value: "XTRIM RX", label: "XTRIM RX" },
                            ]}
                            required
                        />
                        {/* <Input label="تاریخ" name="lost_date" required /> */}
                        <JalaliDatePicker
                            control={control}
                            name="lost_date"
                            label="تاریخ"
                            required
                            className="text-right"
                        />
                        <TimePicker
                            value={time}
                            onChange={(val) => setTime(val)}
                            required
                            label="ساعت"
                        />
                        <div className="col-span-1 sm:col-span-2 md:col-span-3">
                            <TextArea
                                label="توضیحات"
                                name="lost_description"
                                placeholder="توضیحاتی درباره سفارش وارد کنید..."
                                className="mb-6 w-full col-span-1 sm:col-span-2 md:col-span-4"
                            />
                        </div>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

