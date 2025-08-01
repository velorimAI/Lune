'use client';

import {useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '@/app/components/modal';
import { UserX } from 'lucide-react';
import { useDeleteUser } from '../../hooks/use-delete-user';

interface DeleteUserModalProps {
  id: any;
  name: string;
  refetch: () => void;
}

export const DeleteUserModal= ({ id, name , refetch} : DeleteUserModalProps) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteUser();

  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => {
        refetch?.()
        toast.success(`کاربر «${name}» با موفقیت حذف شد.`);
        setOpen(false);
      },
      onError: () => {
        toast.error('خطا در حذف کاربر.');
      },
    });
  };

  return (
    <>
      <UserX
        className="text-red-600 hover:text-red-900 hover:cursor-pointer"
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        title="حذف کاربر"
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
        confirmText="بله، حذف کن"
        cancelText="خیر، منصرف شدم"
        confirmLoading={isPending}
        confirmDisabled={isPending}
      >
        <p className="text-right">
          آیا از حذف کاربر <span className="font-semibold">«{name}»</span> مطمئن هستید؟
        </p>
      </Modal>
    </>
  );
};
