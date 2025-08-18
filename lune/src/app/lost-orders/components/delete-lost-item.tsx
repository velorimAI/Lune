'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '@/app/components/modal';
import { Trash2 } from 'lucide-react';
import { useDeleteLostItem } from '../hooks';


interface DeleteLostItemProps {
    id: any;
    name: string;
    refetch: () => void;
}

export const DeleteLostItem = ({ id, name, refetch }: DeleteLostItemProps) => {
    const [open, setOpen] = useState(false);
    const { mutate, isPending } = useDeleteLostItem();

    const handleDelete = () => {
        mutate(id, {
            onSuccess: () => {
                refetch?.()
                toast.success(`قطعه «${name}» با موفقیت حذف شد.`);
                setOpen(false);
            },
            onError: () => {
                toast.error('خطا در حذف قطعه.');
            },
        });
    };

    return (
        <>
            <Trash2
                className="text-red-600 hover:text-red-900 hover:cursor-pointer"
                onClick={() => setOpen(true)}
            />
            <Modal
                open={open}
                title="حذف قطعه"
                onCancel={() => setOpen(false)}
                onConfirm={handleDelete}
                confirmText="بله، حذف کن"
                cancelText="خیر، منصرف شدم"
                confirmLoading={isPending}
                confirmDisabled={isPending}
                
            >
                <p className="text-right">
                    آیا از حذف قطعه <span className="font-semibold">«{name}»</span> مطمئن هستید؟
                </p>
            </Modal>
        </>
    );
};
