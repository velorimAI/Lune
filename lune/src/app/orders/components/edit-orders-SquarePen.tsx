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
  delivery_date: string; // فرمت "YYYY-MM-DD"
  number_of_pieces: number;
  status: "دریافت شده" | "دریافت‌ نشده" | "ابطال شده" | "لغو شده";
  order_date: string; // فرمت "YYYY-MM-DD HH:mm:ss"
  estimated_arrival_days: number;
  part_id: string;
  settlement_status: "تسویه شده" | "تسویه نشده" | "پرداخت ناقص";
}

interface EditOrderModalProps {
  parts: PartData[]; // لیست تمامی قطعات مربوط به یک سفارش
  onSave: (updatedPart: PartData & { dealership_confirmed: boolean }) => Promise<void> | void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ parts, onSave }) => {
  const [open, setOpen] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState<string>("");
  const [localPartData, setLocalPartData] = useState<PartData | null>(null);
  const [dealershipConfirmed, setDealershipConfirmed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && parts.length > 0) {
      const first = parts[0];
      setSelectedPartId(first.part_id);
      setLocalPartData({ ...first });
      setDealershipConfirmed(false);
    }
  }, [open, parts]);

  const handlePartChange = (partId: string) => {
    setSelectedPartId(partId);
    const p = parts.find((pt) => pt.part_id === partId) || null;
    if (p) {
      setLocalPartData({ ...p });
      setDealershipConfirmed(false);
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
      await onSave({ ...localPartData, dealership_confirmed: dealershipConfirmed });
      setOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <SquarePen
        className="cursor-pointer text-gray-500 hover:text-blue-600"
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

          {/* فقط زمانی که localPartData لود شده باشد، فیلدها نمایش داده شوند */}
          {localPartData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* وضعیت تحویل */}
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

              {/* وضعیت پرداخت */}
              <div>
                <label className="block mb-1">وضعیت پرداخت</label>
                <Select
                  value={localPartData.settlement_status}
                  onValueChange={(value) =>
                    handleFieldChange("settlement_status", value as PartData["settlement_status"])
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

              {/* تاریخ تحویل */}
              <div>
                <label className="block mb-1">تاریخ تحویل</label>
                <Input
                  type="date"
                  className="w-full"
                  value={localPartData.delivery_date}
                  onChange={(e) =>
                    handleFieldChange("delivery_date", e.target.value)
                  }
                />
              </div>

              {/* تأیید نمایندگی */}
              <div className="flex items-center mt-6 mr-12">
                <Checkbox
                  id="dealership-confirmed"
                  checked={dealershipConfirmed}
                  onCheckedChange={(checked) =>
                    setDealershipConfirmed(Boolean(checked))
                  }
                />
                <label htmlFor="dealership-confirmed" className="mr-2 text-sm">
                  تأیید نمایندگی
                </label>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default EditOrderModal;
