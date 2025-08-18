'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '@/app/components/modal';
import { Input } from '@/app/components/custom-form/input';
import { UserPlus } from 'lucide-react';
import { Form } from '@/app/components/custom-form/form';
import { useAddUser } from '../../hooks/use-add-user';
import { SelectPopover } from '@/app/components/custom-form/select-popover';

interface AddUserModalProps {
  refetch: () => void;
}

export const AddUserModal = ({ refetch } : AddUserModalProps) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useAddUser();

  const handleSubmit = (formData: any) => {
    mutate(formData, {
      onSuccess: () => {
        refetch();
        toast.success("کاربر با موفقیت اضافه شد");
        setOpen(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "خطا در افزودن کاربر");
      },
    });
  };

  return (
    <>
      <UserPlus
        size={24}
        className="group-hover:rotate-12 transition-transform hover:cursor-pointer"
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        title="اضافه کاربر"
        hideCancel
        hideConfirm
        onCancel={() => setOpen(false)}
      >
        <Form
          cancelText="لغو"
          submitText="اضافه"
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          submitLoading={isPending}
        >
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="نام"
              name="name"
              required
            />
            <Input
              label="نام خانوادگی"
              name="last_name"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <Input
              label="کد ملی"
              name="code_meli"
              inputClassName="w-full 
                [appearance:textfield] 
                [&::-webkit-inner-spin-button]:appearance-none 
                [&::-webkit-outer-spin-button]:appearance-none"
              idNumber
              required
            />
            <Input
              label="رمز عبور"
              name="password"
              type="password"
              placeholder="****"
              required
            />
            <SelectPopover
              label="نقش"
              name="role"
              value="پذیرش"
              options={[
                { label: 'مدیریت', value: 'مدیریت' },
                { label: 'انباردار', value: 'انباردار' },
                { label: 'حسابدار', value: 'حسابدار' },
                { label: 'پذیرش', value: 'پذیرش' },
              ]}
              required
              hiddenSearch
            />
          </div>
        </Form>
      </Modal>
    </>
  );
};
