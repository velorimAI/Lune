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
import { carOptions } from '@/constants/carOptions';


interface EditLostItemProps {
    data: any
    refetch: () => void;
}

export const EditLostItem = ({ data, refetch }: EditLostItemProps) => {
    const [open, setOpen] = useState(false);
    const [, setTime] = useState("");
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
                            options={carOptions}
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