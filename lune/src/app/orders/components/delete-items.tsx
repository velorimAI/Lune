"use client";
import { Modal } from "@/app/components/modal";
import { Trash2 } from "lucide-react";
import { FC, useState } from "react";
import { useDeletePart } from "../hooks/use-delete-part";
import { useRouter } from "next/navigation";



interface DeleteItemProps {
  id: string;
  name: string;
}

export const DeleteItem: FC<DeleteItemProps> = ({ id, name }) => {
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
        className="hover:text-red-600 hover:cursor-pointer"
        onClick={() => setOpen(true)}
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
