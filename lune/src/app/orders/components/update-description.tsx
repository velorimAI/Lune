"use client";

import { Form } from "@/app/components/custom-form/form";
import { Input } from "@/app/components/custom-form/input";
import { Modal } from "@/app/components/modal";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdatePart } from "../hooks/use-update-part";

interface editOrderModalProp {
  data: any;
  refetch?: () => void;
}

export const UpdateDiscription = ({ data, refetch } : editOrderModalProp) => {
  const [open, setOpen] = useState(false);
  const { mutate: UpdatePartMutate } = useUpdatePart();


  const handleUpdate = (formData: any) => {
    UpdatePartMutate(
      { id: data?.order_id, updatedData: formData },
      {
        onSuccess: () => {
          toast.success("تغییرات با موفقیت ذخیره شد.");
          setOpen(false);
          refetch?.();
        },
        onError: () => {
          toast.error("خطا در ذخیره‌سازی تغییرات.");
        },
      }
    );
  };


  return (
    <>
      <SquarePen
        className="cursor-pointer hover:text-blue-600"
        onClick={() => setOpen(true)}
      />

      <Modal
        open={open}
        title="ویرایش اطلاعات قطعه"
        onCancel={() => setOpen(false)}
        hideCancel
        hideConfirm
      >
        <Form
          cancelText="لغو"
          submitText="ذخیره تغییرات"
          onCancel={() => setOpen(false)}
          onSubmit={handleUpdate}
        >
          <Input label="توضیحات" name="all_description" value={data?.all_description} />
        </Form>
      </Modal>
    </>
  );
};

;