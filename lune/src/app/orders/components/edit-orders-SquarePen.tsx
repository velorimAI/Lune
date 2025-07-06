"use client";

import { editOrder } from "@/app/apis/orders/orderService";
import { CheckBox } from "@/app/components/custom-form/check-box";
import { Form } from "@/app/components/custom-form/form";
import { Input } from "@/app/components/custom-form/input";
import { Select } from "@/app/components/custom-form/select-box";
import { Modal } from "@/app/components/modal";
import { formatDateOnly } from "@/app/utils/formatDateOnly";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface editOrderModalProp {
  data: any;
  refetch: () => void;
}

 export const EditOrderModal: React.FC<editOrderModalProp> = ({ data, refetch }) => {
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  const orders = data.receptions?.flatMap((reception: any) => reception.orders) || [];

  const orderOptions = orders.map((order: any) => ({
    label: order.piece_name,
    value: order.order_id.toString(),
  }));

  const selectedOrder = orders.find((o: any) => o.order_id.toString() === selectedOrderId) || null;

  useEffect(() => {
    if (!selectedOrderId && orders.length > 0) {
      setSelectedOrderId(orders[0].order_id.toString());
    }
  }, [orders, selectedOrderId]);

  const handlePartSelect = (value: string) => {
    setSelectedOrderId(value);
  };

  const handleUpdate = async (formData: any) => {
    try {
      if (!selectedOrderId) return;

      setLoading(true);
      await editOrder(selectedOrderId, formData);
      refetch();

      toast.success(`«${selectedOrder?.piece_name}» با موفقیت ویرایش شد`);
      setOpen(false);
    } catch (error) {
      toast.error("خطا در ویرایش سفارش");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isAccountant = role === "حسابدار";
  const isWarehouse = role === "انباردار";


  const relatedReception = data.receptions?.find((reception: any) =>
    reception.orders?.some((order: any) => order.order_id === selectedOrder?.order_id)
  );

  const carStatus = relatedReception?.car_status;


 const statusOptions =
  selectedOrder?.status === "در انتظار تائید شرکت" &&
  selectedOrder?.order_channel !== "بازار آزاد"
    ? [
        { label: "تائید شرکت شد", value: "در انتظار تائید حسابداری" },
        { label: "لغو توسط شرکت", value: "لغو توسط شرکت"},
      ]
    : selectedOrder?.status === "در انتظار تائید شرکت" &&
      selectedOrder?.order_channel === "بازار آزاد"
    ? [
        { label: "تائید بازار آزاد", value: "در انتظار تائید حسابداری" },
      ]
    : selectedOrder?.status === "در انتظار تائید حسابداری"
    ? [
        { label: "تسویه شد", value: "در انتظار دریافت" },
        { label: "عدم پرداخت حسابداری", value: "عدم پرداخت حسابداری" },
      ]
    : selectedOrder?.status === "در انتظار دریافت"
    ? [
        {
          label: "دریافت شد",
          value:
            carStatus === "متوقع"
              ? "در انتظار نوبت دهی"
              : "دریافت شد",
        },
        { label: "عدم دریافت", value: "عدم دریافت" },
      ]
    : selectedOrder?.status === "دریافت شد"
    ? [{ label: "تحویل شد", value: "تحویل شد" }]
    : selectedOrder?.status === "در انتظار نوبت دهی"
    ? [
        { label: "نوبت داده شد", value: "نوبت داده شد" },
        { label: "انصراف مشتری", value: "انصراف مشتری" },
      ]
    : [];






  const canEditStatus =
    (isWarehouse && selectedOrder?.status !== "در انتظار تائید حسابداری") || // انباردار می‌تونه بجز این حالت تغییر بده
    (isAccountant && selectedOrder?.status === "در انتظار تائید حسابداری");


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
          submitLoading={loading}
          key={selectedOrderId || "empty"}
        >
          <div className="flex w-full justify-between gap-3">
            <Select
              label="قطعه مورد نظر خود را انتخاب کنید"
              className="w-full"
              inputStyle="w-full"
              options={orderOptions}
              onChange={handlePartSelect}
              name=""
              value={selectedOrderId || ""}
            />
          </div>

          <div className="flex w-full justify-between gap-3">
            <Input
              label="تاریخ تحویل"
              name="delivery_date"
              className="w-full"
              value={formatDateOnly(selectedOrder?.delivery_date)}
              disabled={!isWarehouse}
            />

            <Select
              label="وضعیت"
              name="status"
              className="w-[200px]"
              inputStyle="w-full"
              // options={[
              //   { label: "تسویه شده ", value: "تسویه شده" },
              //   { label: "تسویه نشده", value: "تسویه نشده" },
              // ]}
              options={statusOptions}
              placeholder={selectedOrder?.status}
              disabled={!canEditStatus}
            />

          </div>
        </Form>
      </Modal>
    </>
  );
};

;
