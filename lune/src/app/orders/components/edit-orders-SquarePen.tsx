"use client";
import { editOrder } from "@/app/apis/orders/orderService";
import { CheckBox } from "@/app/components/custom-form/check-box";
import { Form } from "@/app/components/custom-form/form";
import { Select } from "@/app/components/custom-form/select-box";
import { Modal } from "@/app/components/modal";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface editOrderModalProp {
  data: any;
  refetch: () => void;
}

const EditOrderModal: React.FC<editOrderModalProp> = ({ data, refetch }) => {
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);

  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  const orders = data.receptions?.flatMap((reception: any) => reception.orders) || [];

  const orderOptions = orders.map((order: any) => ({
    label: order.piece_name,
    value: order.order_id.toString(),
  }));

  const selectedOrder = orders.find((o: any) => o.order_id.toString() === selectedOrderId) || null;

  // اصلاح شده: فقط یک useEffect
  useEffect(() => {
    if (selectedOrder?.delivery_date) {
      try {
        // تبدیل تاریخ به فرمت YYYY/MM/DD
        const dateParts = selectedOrder.delivery_date.split('-');
        if (dateParts.length === 3) {
          setDeliveryDate(`${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`);
        } else {
          setDeliveryDate(null);
        }
      } catch {
        setDeliveryDate(null);
      }
    } else {
      setDeliveryDate(null);
    }
  }, [selectedOrder]);

  const handlePartSelect = (value: string) => {
    setSelectedOrderId(value);
  };

  const handleUpdate = async (formData: any) => {
    try {
      if (!selectedOrderId) return;

      setLoading(true);
      
      // تبدیل تاریخ به فرمت YYYY-MM-DD برای ارسال به سرور
      formData.delivery_date = deliveryDate 
        ? deliveryDate.replaceAll("/", "-") 
        : null;

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

            <Select
              label="وضعیت تحویل"
              name="status"
              inputStyle="w-full"
              className="w-[200px]"
              options={[
                { label: "دریافت شده", value: "دریافت شده" },
                { label: "دریافت نشده", value: "دریافت نشده" },
              ]}
              value={selectedOrder?.status}
              disabled={!isWarehouse}
            />
          </div>

          <div className="flex w-full justify-between gap-3">
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-700 mb-1">تاریخ تحویل</label>
              <DatePicker
                value={deliveryDate}
                onChange={(date) => {
                  try {
                    if (date) {
                      const formattedDate = date.format("YYYY/MM/DD");
                      setDeliveryDate(formattedDate);
                    } else {
                      setDeliveryDate(null);
                    }
                  } catch (error) {
                    console.error("خطا در فرمت تاریخ:", error);
                    setDeliveryDate(null);
                  }
                }}
                calendar={persian}
                locale={persian_fa}
                format="YYYY/MM/DD"
                inputClass="border border-gray-300 rounded-md px-3 py-2 w-full text-sm text-right"
                disabled={!isWarehouse}
                containerClassName="w-full"
              />
            </div>

            <Select
              label="وضعیت پرداخت"
              name="settlement_status"
              className="w-[200px]"
              inputStyle="w-full"
              options={[
                { label: "تسویه شده", value: "تسویه شده" },
                { label: "تسویه نشده", value: "تسویه نشده" },
              ]}
              value={selectedOrder?.settlement_status}
              disabled={!isAccountant}
            />
          </div>

          <CheckBox
            label="تایید نمایندگی"
            name="dealer_approved"
            className="py-2"
            checked={selectedOrder?.dealer_approved || false}
            disabled={!isWarehouse}
          />
        </Form>
      </Modal>
    </>
  );
};

export default EditOrderModal;