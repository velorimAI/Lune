'use client';

import { FC, useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '@/app/components/modal';
import { Input } from '@/app/components/custom-form/input';
import { PackagePlus } from 'lucide-react';
import { Form } from '@/app/components/custom-form/form';
import { useAddItem } from '../hooks/use-add-item';

interface AddUserModalProps {
    refetch?: () => void;
}


export const AddItemModal: FC<AddUserModalProps> = ({ refetch }) => {
    const [open, setOpen] = useState(false);
    const { mutate, isPending } = useAddItem();

    const handleSubmit = (formData: any) => {
        mutate(formData, {
            onSuccess: () => {
                refetch?.();
                toast.success(`قطعه "${formData.part_name}" با موفقیت اضافه شد`);
                setOpen(false);
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "خطا در افزودن قطعه");
            },
        });
    };


    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-8 cursor-pointer
                     hover:border-purple-500 hover:bg-purple-50 transition-colors duration-300
                     w-48 min-h-[160px]"
            >
                <PackagePlus size={64} className="text-gray-700 hover:text-purple-600" />
                <span className="mt-4 text-gray-700 font-semibold text-center">افزودن قطعه</span>
            </div>
            <Modal
                open={open}
                title="اضافه کردن قطعه جدید"
                hideCancel
                hideConfirm
                contentClassName='pb-2'
                onCancel={() => setOpen(false)}
            >
                <Form cancelText='لغو' submitText='اضافه' onSubmit={handleSubmit} onCancel={() => setOpen(false)} submitLoading={isPending} >
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="نام قطعه"
                            name="part_name"
                            required
                           

                        />
                        <Input
                            label="شماره فنی"
                            name="technical_code"
                            required
                          
                        />
                    </div>
                </Form>
            </Modal>
        </>
    );
};

