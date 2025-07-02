"use client";

import { FC, useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Modal } from "@/app/components/modal";
import { useDeleteOrder } from "../hooks";


interface DeleteItemProps {
  id: string;
  name: string;
}

export const DeleteOrder: FC<DeleteItemProps> = ({ id, name }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutate, isPending } = useDeleteOrder();

 
  

  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => {
        toast.success(`سفارش «${name}» با موفقیت حذف شد`);
        setOpen(false);
        router.refresh(); 
      },
      onError: () => {
        toast.error("خطا در حذف سفارش");
      },
    });
  };

  return (
    <>
      <Trash2
        className="hover:text-red-600 hover:cursor-pointer"
        onClick={() => setOpen(true)}
      />

      <Modal
        open={open}
        title="حذف سفارش"
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
        cancelText="لغو"
        confirmText={isPending ? "در حال حذف..." : "حذف"}
        confirmLoading={isPending}
      >
        <p className="text-right">
          آیا مطمئن هستید که می‌خواهید سفارش «{name}» را حذف کنید؟
        </p>
      </Modal>
    </>
  );
};
