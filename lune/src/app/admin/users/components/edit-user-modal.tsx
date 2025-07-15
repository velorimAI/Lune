'use client';

import { FC, useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '@/app/components/modal';
import { Select } from '@/app/components/custom-form/select-box';
import { Input } from '@/app/components/custom-form/input';
import { UserPen } from 'lucide-react';
import { Form } from '@/app/components/custom-form/form';
import { useEditUser } from '../../hooks';

interface EditUserModalProps {
  data: any
  refetch: () => void;
}

export const EditUserModal: FC<EditUserModalProps> = ({ data, refetch }) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useEditUser();

  const handleSubmit = async (formData: any) => {
    const updated = {
      ...formData,
      code_meli: `0${formData.code_meli}`.slice(-10),
    };
    mutate(
      {
        id: data?.id,
        updatedData: updated,
      },
      {
        onSuccess: () => {
          refetch();
          toast.success(`اطلاعات کاربر "${updated.name || ""}" با موفقیت ویرایش شد`);
          setOpen(false);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'خطا در بروزرسانی کاربر');
        },
      }
    );
  };

  return (
    <>
      <UserPen
        className="hover:text-green-600 hover:cursor-pointer"
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        title="ویرایش کاربر"
        hideCancel
        hideConfirm
        onCancel={() => setOpen(false)}
      >
        <Form cancelText='لغو' submitText='ویرایش' onSubmit={handleSubmit} onCancel={() => setOpen(false)} isLoading={data?.isLoading || data?.isPending} submitLoading={isPending} >
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="نام"
              name="name"
              value={data?.name}
            />
            <Input
              label="نام خانوادگی"
              name="last_name"
              value={data?.last_name}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <Input
              label="کد ملی"
              name="code_meli"
              type='number'
              isPositiveNumber
              inputClassName="w-full 
              [appearance:textfield] 
              [&::-webkit-inner-spin-button]:appearance-none 
              [&::-webkit-outer-spin-button]:appearance-none"
              value={data?.code_meli}
              idNumber
            />
            <Input
              label="رمز عبور جدید"
              name="password"
              type="password"
              placeholder="****"
            />
            <Select
              label="نقش"
              name='role'
              options={[
                { label: 'مدیریت', value: 'مدیریت' },
                { label: 'انباردار', value: 'انباردار' },
                { label: 'حسابدار', value: 'حسابدار' },
                { label: 'پذیرش', value: 'پذیرش' },
              ]}
              inputStyle='w-full'
              value={data?.role}
            />
          </div>
        </Form>
      </Modal>
    </>
  );
};