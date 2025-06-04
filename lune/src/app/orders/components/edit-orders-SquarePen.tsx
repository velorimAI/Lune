"use client";

import { useState, useEffect } from "react";
import { SquarePen } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/app/components/modal";

export interface PartData {
  order_id: number;
  piece_name: string;
  order_channel: string;
  number_of_pieces: number;
  status: "دریافت شده" | "دریافت‌ نشده" | "ابطال شده" | "لغو شده";
  order_date: string; // فرمت "YYYY-MM-DD HH:mm:ss"
  estimated_arrival_days: number;
  part_id: string;
  settlement_status: "تسویه شده" | "تسویه نشده" | "پرداخت ناقص";
}

interface EditOrderModalProps {
  parts: PartData[]; // لیست تمامی قطعات مربوط به یک سفارش
  onSave: (updatedPart: PartData) => Promise<void> | void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ parts, onSave }) => {
  const [open, setOpen] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState<string>("");
  const [localPartData, setLocalPartData] = useState<PartData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // وقتی مودال باز می‌شود، اگر لیست قطعات موجود باشد، اولین قطعه را به‌صورت پیش‌فرض انتخاب کن
  useEffect(() => {
    if (open && parts.length > 0) {
      const first = parts[0];
      setSelectedPartId(first.part_id);
      setLocalPartData({ ...first });
    }
  }, [open, parts]);

  // زمانی‌که کاربر قطعه‌ی جدیدی را از دراپ‌داون انتخاب کند، داده‌های آن قطعه لود می‌شود
  const handlePartChange = (partId: string) => {
    setSelectedPartId(partId);
    const p = parts.find((pt) => pt.part_id === partId) || null;
    if (p) {
      setLocalPartData({ ...p });
    }
  };

  const handleFieldChange = <K extends keyof PartData>(field: K, value: PartData[K]) => {
    if (!localPartData) return;
    setLocalPartData({ ...localPartData, [field]: value });
  };

  const handleEdit = async () => {
    if (!localPartData) return;
    setIsSaving(true);
    try {
      await onSave(localPartData);
      setOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <SquarePen
        className="cursor-pointer text-blue-600"
        onClick={() => setOpen(true)}
      />

      <Modal
        open={open}
        title="ویرایش اطلاعات قطعه"
        onCancel={() => setOpen(false)}
        onConfirm={handleEdit}
        cancelText="لغو"
        confirmText={isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        confirmLoading={isSaving}
      >
        <div className="space-y-4 text-right">
          {/* انتخاب قطعه */}
          <div>
            <label className="block mb-1">انتخاب قطعه</label>
            <Select
              value={selectedPartId}
              onValueChange={(value) => handlePartChange(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="قطعه را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                {parts.map((part) => (
                  <SelectItem key={part.part_id} value={part.part_id}>
                    {part.piece_name} ({part.part_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* فقط زمانی که localPartData لود شده باشد، فیلدهای ویرایش نمایش داده شود */}
          {localPartData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* وضعیت تحویل (status) */}
              <div>
                <label className="block mb-1">وضعیت تحویل</label>
                <Select
                  value={localPartData.status}
                  onValueChange={(value) =>
                    handleFieldChange("status", value as PartData["status"])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="انتخاب وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="دریافت شده">دریافت شده</SelectItem>
                    <SelectItem value="دریافت‌ نشده">دریافت‌ نشده</SelectItem>
                    <SelectItem value="ابطال شده">ابطال شده</SelectItem>
                    <SelectItem value="لغو شده">لغو شده</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* وضعیت تسویه (settlement_status) */}
              <div>
                <label className="block mb-1">وضعیت پرداخت</label>
                <Select
                  value={localPartData.settlement_status}
                  onValueChange={(value) =>
                    handleFieldChange(
                      "settlement_status",
                      value as PartData["settlement_status"]
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="انتخاب وضعیت تسویه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="تسویه شده">تسویه شده</SelectItem>
                    <SelectItem value="تسویه نشده">تسویه نشده</SelectItem>
                    <SelectItem value="پرداخت ناقص">پرداخت ناقص</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* تاریخ سفارش (غیرقابل ویرایش، فقط نمایش) */}
              <div>
                <label className="block mb-1">تاریخ سفارش</label>
                <Input
                  type="text"
                  className="w-full bg-gray-100 cursor-not-allowed"
                  value={localPartData.order_date.split(" ")[0]}
                  disabled
                />
              </div>

              {/* تعداد قطعه (غیرقابل ویرایش، فقط نمایش) */}
              <div>
                <label className="block mb-1">تعداد</label>
                <Input
                  type="number"
                  className="w-full bg-gray-100 cursor-not-allowed"
                  value={localPartData.number_of_pieces.toString()}
                  disabled
                />
              </div>

              {/* کانال سفارش (order_channel) - قابل ویرایش */}
              <div>
                <label className="block mb-1">کانال سفارش</label>
                <Input
                  type="text"
                  className="w-full"
                  value={localPartData.order_channel}
                  onChange={(e) =>
                    handleFieldChange("order_channel", e.target.value)
                  }
                />
              </div>

              {/* Estimated Arrival Days */}
              <div>
                <label className="block mb-1">روزهای تخمینی رسیدن</label>
                <Input
                  type="number"
                  className="w-full"
                  value={localPartData.estimated_arrival_days.toString()}
                  onChange={(e) =>
                    handleFieldChange(
                      "estimated_arrival_days",
                      parseInt(e.target.value, 10) || 0
                    )
                  }
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default EditOrderModal;
