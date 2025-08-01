"use client";
import { Modal } from "@/app/components/modal";
import { Trash2 } from "lucide-react";
import {useState } from "react";
import { useRouter } from "next/navigation";
import { useDeletePart } from "../hooks";



interface DeleteItemProps {
  id: string;
  name: string;
  disabled?: boolean;
}

export const DeleteItem= ({ id, name, disabled } : DeleteItemProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutate, isPending } = useDeletePart();

  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <>
      <Trash2
        className={`
        w-6 h-6 
        ${disabled ? "text-gray-400  cursor-not-allowed" : "hover:text-red-600 hover:cursor-pointer"}
        `}
        onClick={() => {
          if (!disabled) setOpen(true);
        }}
      />

      <Modal
        open={open}
        title="حذف قطعه"
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
        cancelText="لغو"
        confirmText={isPending ? "در حال حذف..." : "حذف"}
        confirmLoading={isPending}
      >
        <p className="text-right">
          آیا مطمئن هستید که می‌خواهید قطعه <strong>{name}</strong> را حذف کنید؟
        </p>
      </Modal>
    </>
  );
};
