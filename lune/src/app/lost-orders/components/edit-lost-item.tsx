'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '@/app/components/modal';
import { Select } from '@/app/components/custom-form/select-box';
import { Input } from '@/app/components/custom-form/input';
import { Form } from '@/app/components/custom-form/form';
import { useEditLostItem } from '../hooks';
import { SquarePen } from 'lucide-react';
import { TimePicker } from '@/app/components/time-picker';


interface EditLostItemProps {
    data: any
    refetch: () => void;
}

export const EditLostItem = ({ data, refetch }: EditLostItemProps) => {
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState("");
    const { mutate, isPending } = useEditLostItem();

    const handleSubmit = async (formData: any) => {
        mutate(
            {
                id: data?.id,
                updatedData: formData,
            },
            {
                onSuccess: () => {
                    refetch();
                    toast.success(`اطلاعات قطعه "${formData.name || ""}" با موفقیت ویرایش شد`);
                    setOpen(false);
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || 'خطا در بروزرسانی قطعه');
                },
            }
        );
    };

    return (
        <>
            <SquarePen
                className="hover:text-green-600 hover:cursor-pointer"
                onClick={() => setOpen(true)}
            />
            <Modal
                open={open}
                title="ویرایش قطعه"
                hideCancel
                hideConfirm
                onCancel={() => setOpen(false)}
            >
                <Form cancelText='لغو' submitText='ویرایش' onSubmit={handleSubmit} onCancel={() => setOpen(false)} isLoading={data?.isLoading || data?.isPending} submitLoading={isPending} >
                    <div className="grid grid-cols-1">
                        <Select
                            label="کاربرد"
                            name="car_name"
                            value={data?.car_name}
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
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            label="نام"
                            name="piece_name"
                            value={data?.piece_name}
                        />
                        <Input
                            label="کد فنی"
                            name="part_id"
                            value={data?.part_id}
                        />
                        <Input
                            label="تعداد"
                            name="count"
                            value={data?.count}
                            type='number'
                            isPositiveNumber
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="تاریخ" name="lost_date" value={data?.lost_date} />
                        <TimePicker
                            value={data?.lost_time}
                            onChange={(val) => setTime(val)}
                            label="ساعت"
                        />
                    </div>
                    <div className="grid grid-cols-1">
                        <Input label="توضیحات" name="lost_description" value={data?.lost_description} />
                    </div>
                </Form>
            </Modal>
        </>
    );
};