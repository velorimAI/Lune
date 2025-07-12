// app/admin/users/components/AddUserModal.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Modal } from '@/app/components/modal';
import {
  Select as SelectShadcn,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const AddUserModal = ({ isOpen, onClose, onUserAdded }: AddUserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    code_meli: '',
    password: '',
    role: 'پذیرش',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const patterns: Record<string, RegExp> = {
    name: /^[\u0600-\u06FF\s]{2,50}$/,
    last_name: /^[\u0600-\u06FF\s]{2,50}$/,
    code_meli: /^\d{10}$/,
    password: /^\d{5,}$/,  
  };
  const messages: Record<string, string> = {
    name: 'فقط حروف فارسی و فاصله، حداقل ۲ حرف',
    last_name: 'فقط حروف فارسی و فاصله، حداقل ۲ حرف',
    code_meli: 'کد ملی باید ۱۰ رقم باشد',
    password: 'فقط باید شامل رقم و حداقل ۵ رقم باشد',
  };

  const validateField = (field: string, value: string) => {
    const pattern = patterns[field];
    return pattern && !pattern.test(value) ? messages[field] : null;
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) || '' }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // اعتبارسنجی
    const newErrors: Record<string, string> = {};
    let valid = true;
    Object.entries(formData).forEach(([key, val]) => {
      if (key === 'role') return;
      const err = validateField(key, val as string);
      if (err) {
        newErrors[key] = err;
        valid = false;
      }
    });
    if (!valid) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('توکن موجود نیست');

      await axios.post(
        'http://localhost:3001/api/admin/adduser',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('کاربر با موفقیت اضافه شد!');
      onUserAdded();
      onClose();
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error('کاربری با این کد ملی قبلاً ثبت شده است.');
      } else {
        toast.error(err.response?.data?.message || err.message || 'خطا در افزودن کاربر');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      title="افزودن کاربر جدید"
      onCancel={onClose}
      onConfirm={handleSubmit}
      confirmText={isSubmitting ? 'در حال افزودن...' : 'افزودن'}
      confirmLoading={isSubmitting}
      cancelText="لغو"
    >
      <form className="grid grid-cols-2 gap-4">
        {/* ردیف اول */}
        <div>
          <label className="block text-sm mb-1">نام</label>
          <input
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">نام خانوادگی</label>
          <input
            value={formData.last_name}
            onChange={e => handleChange('last_name', e.target.value)}
            className="w-full border p-2 rounded"
          />
          {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
        </div>
        {/* ردیف دوم */}
        <div>
          <label className="block text-sm mb-1">کد ملی</label>
          <input
            value={formData.code_meli}
            onChange={e => handleChange('code_meli', e.target.value)}
            className="w-full border p-2 rounded"
          />
          {errors.code_meli && <p className="text-red-500 text-xs mt-1">{errors.code_meli}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">رمز عبور</label>
          <input
            type="password"
            value={formData.password}
            onChange={e => handleChange('password', e.target.value)}
            className="w-full border p-2 rounded"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <div className="col-span-2">
          <label className="block text-sm mb-1">نقش</label>
          <SelectShadcn value={formData.role} onValueChange={val => handleChange('role', val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="انتخاب نقش" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="پذیرش">پذیرش</SelectItem>
              <SelectItem value="انباردار">انباردار</SelectItem>
              <SelectItem value="حسابدار">حسابدار</SelectItem>
              <SelectItem value="مدیریت">مدیریت</SelectItem>
            </SelectContent>
          </SelectShadcn>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
