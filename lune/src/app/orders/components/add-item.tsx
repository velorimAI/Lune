"use client";

import { CheckBox } from "@/app/components/custom-form/check-box";
import { Form } from "@/app/components/custom-form/form";
import { Input } from "@/app/components/custom-form/input";
import { Select } from "@/app/components/custom-form/select-box";
import { Modal } from "@/app/components/modal";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";



interface AddItemModalProp {
  data?: any;
  refetch?: () => void;
}

const AddItem: React.FC<AddItemModalProp> = ({ data, refetch }) => {
  const [open, setOpen] = useState(false);
  // const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);
  // const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  // const orders = data.receptions?.flatMap((reception: any) => reception.orders) || [];

  // const orderOptions = orders.map((order: any) => ({
  //     label: order.piece_name,
  //     value: order.order_id.toString(),
  // }));

  // const selectedOrder = orders.find((o: any) => o.order_id.toString() === selectedOrderId) || null;

  // useEffect(() => {
  //     if (!selectedOrderId && orders.length > 0) {
  //         setSelectedOrderId(orders[0].order_id.toString());
  //     }
  // }, [orders, selectedOrderId]);

  // const handlePartSelect = (value: string) => {
  //     setSelectedOrderId(value);
  // };

  const handleUpdate = async (formData: any) => {
    // try {
    //   if (!selectedOrderId) return;

    //   setLoading(true);
    //   await editOrder(selectedOrderId, formData);
    //   refetch();

    //   toast.success(`«${selectedOrder?.piece_name}» با موفقیت ویرایش شد`);
    //   setOpen(false);
    // } catch (error) {
    //   toast.error("خطا در ویرایش سفارش");
    //   console.error(error);
    // } finally {
    //   setLoading(false);
    // }
  };

  // const isAccountant = role === "حسابدار";
  // const isWarehouse = role === "انباردار";

  return (
    <>
      <CirclePlus className="cursor-pointer w-5 h-5 mr-auto" onClick={() => setOpen(true)} />

      <Modal
        open={open}
        title="اضافه کردن قطعه"
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
          <div className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto">

            {/* اطلاعات قطعه */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input label="نام قطعه" name="piece_name" />
              <Input label="کد قطعه" name="part_id" />
              <Input label="تعداد" name="number_of_pieces" type="number" isPositiveNumber />
            </div>


            {/* اطلاعات سفارش */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Input label="شماره سفارش" name="order_number" />
              <Select
                label="کانال"
                name="order_channel"
                value="VOR"
                options={[
                  { label: "VOR", value: "VOR" },
                  { label: "VIS", value: "VIS" },
                  { label: "بازار آزاد", value: "بازار آزاد" },
                ]}
              />
              <Input label="نام بازار" name="market_name" />
              <Input label="تلفن بازار" name="market_phone" />
            </div>

            {/* اطلاعات وضعیت */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Select
                label="تحویل"
                name="status.status"
                options={[
                  { label: "دریافت شده", value: "دریافت شده" },
                  { label: "دریافت نشده", value: "دریافت نشده" },
                ]}
              />
              <Select
                label="پرداخت"
                name="status.settlement_status"
                options={[
                  { label: "تسویه شده", value: "تسویه شده" },
                  { label: "تسویه نشده", value: "تسویه نشده" },
                ]}
              />
              <Input
                label="روزهای تحویل"
                name="dates.estimated_arrival_days"
                type="number"
              />
            </div>
            <Input label="توضیحات (اختیاری)" name="description" />
            <CheckBox label="تأیید نماینده" name="dealer_approved" />


          </div>
        </Form>
      </Modal>


    </>
  );
};

export default AddItem;
