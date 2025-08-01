import React, { useState } from "react";
import { Modal } from "@/app/components/modal";

interface InsertDescriptionProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (description: string) => void;
}

const InsertDescription= ({
  open,
  onClose,
  onSubmit,
} : InsertDescriptionProps) => {
  const [description, setDescription] = useState("");

  const handleConfirm = () => {
    onSubmit(description.trim());
    setDescription("");
    onClose();
  };

  return (
    <Modal
      open={open}
      title="دلیل عدم تأیید"
      onCancel={onClose}
      onConfirm={handleConfirm}
      confirmText="ثبت توضیح"
      cancelText="انصراف"
      confirmDisabled={!description.trim()}
    >
      <textarea
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="لطفاً دلیل رد سفارش را وارد کنید..."
        className="w-full border border-gray-300 rounded-md p-2 text-sm mt-1"
      />
    </Modal>
  );
};

export default InsertDescription;
