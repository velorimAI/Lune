'use client';

import { FC, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Modal } from '@/app/components/modal';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserDeleted: () => void;
  userId: number | null;
  userName: string;
}

const DeleteUserModal: FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  onUserDeleted,
  userId,
  userName,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!userId) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('توکن موجود نیست');

      await axios.delete(
        `http://localhost:3001/api/admin/deleteuser/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('کاربر با موفقیت حذف شد.');
      onUserDeleted();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'خطا در حذف کاربر');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      title="حذف کاربر"
      onCancel={onClose}
      onConfirm={handleConfirm}
      confirmText={isDeleting ? 'در حال حذف...' : 'حذف'}
      confirmLoading={isDeleting}
      cancelText="لغو"
    >
      <p>
        آیا از حذف کاربر <strong>{userName}</strong> مطمئن هستید؟
      </p>
    </Modal>
  );
};

export default DeleteUserModal;
