'use client';

import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Modal } from '@/app/components/modal';
import { Select } from '@/app/components/custom-form/select-box';
import { Input } from '@/app/components/custom-form/input';

interface User {
  id: number;
  name: string;
  last_name: string;
  code_meli: number;
  role: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserEdited: () => void;
}

const API_BASE = 'http://localhost:3001/api/admin';

const EditUserModal: FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserEdited,
}) => {
  const [form, setForm] = useState({
    name: '',
    last_name: '',
    code_meli: '',
    password: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        last_name: user.last_name,
        code_meli: user.code_meli.toString(),
        password: '',
        role: user.role,
      });
    }
  }, [user]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleConfirm = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token')!;
      await axios.put(`${API_BASE}/updateuser/${user.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('لیست کاربران به‌روز شد.');
      onUserEdited();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در بروزرسانی کاربر.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      title="ویرایش کاربر"
      onCancel={onClose}
      onConfirm={handleConfirm}
      confirmText="ویرایش"
      cancelText="لغو"
      confirmLoading={loading}
      confirmDisabled={loading}
    >
      {/* ردیف اول: سه فیلد */}
      <div className="grid grid-cols-3 gap-4">
        <Input
          label="نام"
          name="name"
          value={form.name}
          onChange={val => handleChange('name', val || '')}
        />
        <Input
          label="نام خانوادگی"
          name="last_name"
          value={form.last_name}
          onChange={val => handleChange('last_name', val || '')}
        />
        <Input
          label="کد ملی"
          name="code_meli"
          value={form.code_meli}
          onChange={val => handleChange('code_meli', val || '')}
        />
      </div>

      {/* ردیف دوم: دو فیلد */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Input
          label="رمز عبور جدید"
          name="password"
          type="password"
          value={form.password}
          onChange={val => handleChange('password', val || '')}
          placeholder="حداقل ۵ رقم"
        />
        <Select
          label="نقش"
          value={form.role}
          onChange={val => handleChange('role', val)}
          options={[
            { label: 'مدیریت', value: 'مدیریت' },
            { label: 'انباردار', value: 'انباردار' },
            { label: 'حسابدار', value: 'حسابدار' },
            { label: 'پذبرش', value: 'پذبرش' },
          ]}
        />
      </div>
    </Modal>
  );
};

export default EditUserModal;
