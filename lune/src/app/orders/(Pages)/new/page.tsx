"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/card";
import { Form } from "@/app/components/custom-form/form";
import { Input } from "@/app/components/custom-form/input";
import { Select } from "@/app/components/custom-form/select-box";
import { Button } from "@/app/components/button";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";

type Piece = {
  piece_name: string;
  part_id: string;
  number_of_pieces: number;
  order_channel: string;
  market_name: string;
  market_phone: string;
  order_date?: string;
  prediction_delivery_date?: string;
  status?: string;
  settlement_status?: string;
  description?: string;
};

type OrderGroup = {
  order_number: string;
  pieces: Piece[];
};

export default function NewOrderPage() {
  const router = useRouter();

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone_number: "",
    car_status: "متوقف",
  });
  const [receptionInfo, setReceptionInfo] = useState({
    reception_number: "",
    reception_date: "",
  });
  const [orderGroups, setOrderGroups] = useState<OrderGroup[]>([
    { order_number: "", pieces: [emptyPiece()] },
  ]);

  function emptyPiece(): Piece {
    return {
      piece_name: "",
      part_id: "",
      number_of_pieces: 1,
      order_channel: "",
      market_name: "",
      market_phone: "",
      order_date: "",
      prediction_delivery_date: "",
      status: "دریافت نشده",
      settlement_status: "پرداخت نشده",
      description: "",
    };
  }

  const handleAddOrderGroup = () => {
    setOrderGroups([
      ...orderGroups,
      { order_number: "", pieces: [emptyPiece()] },
    ]);
  };

  const handleRemoveOrderGroup = (idx: number) => {
    const groups = orderGroups.filter((_, i) => i !== idx);
    setOrderGroups(
      groups.length
        ? groups
        : [{ order_number: "", pieces: [emptyPiece()] }]
    );
  };

  const handleOrderNumberChange = (idx: number, value?: string) => {
    const groups = [...orderGroups];
    groups[idx].order_number = value || "";
    setOrderGroups(groups);
  };

  const handleAddPiece = (orderIdx: number) => {
    const groups = [...orderGroups];
    groups[orderIdx].pieces.push(emptyPiece());
    setOrderGroups(groups);
  };

  const handleRemovePiece = (orderIdx: number, pieceIdx: number) => {
    const groups = [...orderGroups];
    const pieces = groups[orderIdx].pieces.filter((_, j) => j !== pieceIdx);
    groups[orderIdx].pieces = pieces.length ? pieces : [emptyPiece()];
    setOrderGroups(groups);
  };

  const handlePieceChange = (
    orderIdx: number,
    pieceIdx: number,
    field: keyof Piece,
    value: string | number
  ) => {
    const groups = [...orderGroups];
    if (field === "number_of_pieces") {
      groups[orderIdx].pieces[pieceIdx][field] = Number(value);
    } else {
      // @ts-ignore
      groups[orderIdx].pieces[pieceIdx][field] = value;
    }
    setOrderGroups(groups);
  };

  const handleSubmit = async () => {
    const payload = {
      customer: customerInfo,
      reception: receptionInfo,
      orders: orderGroups.map((grp) => ({
        order_detail: { order_number: grp.order_number },
        orders: grp.pieces.map((p) => ({
          piece_info: {
            piece_name: p.piece_name,
            part_id: p.part_id,
            number_of_pieces: p.number_of_pieces,
          },
          source: {
            order_channel: p.order_channel,
            market_name:
              p.order_channel === "انبار مرکزی" ? p.market_name : null,
            market_phone:
              p.order_channel === "انبار مرکزی" ? p.market_phone : null,
          },
          dates: {
            order_date: p.order_date,
            prediction_delivery_date: p.prediction_delivery_date,
          },
          status: {
            status: p.status,
            settlement_status: p.settlement_status,
          },
          description: p.description,
        })),
      })),
    };

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3001/api/orders/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("سفارش‌ها با موفقیت ثبت شدند");
        setOrderGroups([{ order_number: "", pieces: [emptyPiece()] }]);
      } else {
        toast.error("خطا در ثبت سفارش‌ها");
      }
    } catch {
      toast.error("مشکل در ارتباط با سرور");
    }
  };

  return (
    <Card
      title="ثبت سفارش"
      extra={
        <Button onClick={() => router.push("/orders")}> <ArrowLeft /> </Button>
      }
      className="w-full p-4"
    >
      <Form cancelHide submitText="ثبت" onSubmit={handleSubmit}>
        {/* مشتری و پذیرش */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-1 mb-3">
          <Input
            name="customer.name"
            label="نام و خانوادگی"
            required
            value={customerInfo.name}
            onChange={(v) =>
              setCustomerInfo({ ...customerInfo, name: v || "" })
            }
          />
          <Input
            name="customer.phone_number"
            label="شماره تماس"
            required
            value={customerInfo.phone_number}
            onChange={(v) =>
              setCustomerInfo({ ...customerInfo, phone_number: v || "" })
            }
          />
          <Select
            name="customer.car_status"
            label="وضعیت خودرو"
            className="mt-2"
            inputStyle="w-full"
            required
            value={customerInfo.car_status}
            onChange={(v) =>
              setCustomerInfo({ ...customerInfo, car_status: v || "" })
            }
            options={[
              { value: "متوقف", label: "متوقف" },
              { value: "متوقع", label: "متوقع" },
            ]}
          />
          <Input
            name="reception.reception_number"
            label="شماره پذیرش"
            required
            value={receptionInfo.reception_number}
            onChange={(v) =>
              setReceptionInfo({
                ...receptionInfo,
                reception_number: v || "",
              })
            }
          />
          <Input
            name="reception.reception_date"
            label="تاریخ پذیرش"
            required
            type="date"
            value={receptionInfo.reception_date}
            onChange={(v) =>
              setReceptionInfo({ ...receptionInfo, reception_date: v || "" })
            }
          />
        </div>

        {/* گروه‌های سفارش */}
        {orderGroups.map((grp, i) => (
          <div key={i} className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-lg font-medium text-blue-700">
                📦 سفارش {i + 1}
              </h4>
              <div className="flex gap-1">
                <Button
                  onClick={() => handleRemoveOrderGroup(i)}
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                >
                  <Trash2 size={16} />
                </Button>
                <Button onClick={() => handleAddPiece(i)} size="sm">
                  + قطعه
                </Button>
                <Button
                  onClick={handleAddOrderGroup}
                  size="sm"
                  variant="outline"
                  className="text-black"
                >
                  + سفارش جدید
                </Button>
              </div>
            </div>

            <Input
              name={`orderGroups[${i}].order_number`}
              label="شماره سفارش"
              required
              className="mb-1"
              value={grp.order_number}
              onChange={(v) => handleOrderNumberChange(i, v)}
            />

            <div className="space-y-2">
              {grp.pieces.map((p, j) => (
                <div
                  key={j}
                  className="p-2 bg-gray-50 rounded border border-gray-200"
                >
                  {/* چیدمان حذف جلوی عنوان قطعه */}
                  <div className="flex items-center mb-2">
                    <Trash2
                      onClick={() => handleRemovePiece(i, j)}
                      className="text-red-600 cursor-pointer ml-2"
                      size={16}
                    />
                    <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                      قطعه {j + 1}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                    <Input
                      name={`orderGroups[${i}].pieces[${j}].piece_name`}
                      label="قطعه"
                      required
                      value={p.piece_name}
                      onChange={(v) =>
                        handlePieceChange(i, j, "piece_name", v || "")
                      }
                    />
                    <Input
                      name={`orderGroups[${i}].pieces[${j}].part_id`}
                      label="کد"
                      required
                      value={p.part_id}
                      onChange={(v) =>
                        handlePieceChange(i, j, "part_id", v || "")
                      }
                    />
                    <Input
                      name={`orderGroups[${i}].pieces[${j}].number_of_pieces`}
                      label="تعداد"
                      type="number"
                      required
                      value={String(p.number_of_pieces)}
                      onChange={(v) =>
                        handlePieceChange(i, j, "number_of_pieces", v || "1")
                      }
                    />
                    <Select
                      name={`orderGroups[${i}].pieces[${j}].order_channel`}
                      label="کانال"
                      className="mt-2"
                      inputStyle="w-full"
                      required
                      value={p.order_channel}
                      onChange={(v) =>
                        handlePieceChange(i, j, "order_channel", v || "")
                      }
                      options={[
                        { value: "VOR", label: "VOR" },
                        { value: "VIS", label: "VIS" },
                        { value: "انبار مرکزی", label: "انبار مرکزی" },
                      ]}
                    />
                    {p.order_channel === "انبار مرکزی" && (
                      <>
                        <Input
                          name={`orderGroups[${i}].pieces[${j}].market_name`}
                          label="فروشگاه"
                          required
                          value={p.market_name}
                          onChange={(v) =>
                            handlePieceChange(i, j, "market_name", v || "")
                          }
                          className="md:col-span-2"
                        />
                        <Input
                          name={`orderGroups[${i}].pieces[${j}].market_phone`}
                          label="تلفن فروشگاه"
                          required
                          value={p.market_phone}
                          onChange={(v) =>
                            handlePieceChange(i, j, "market_phone", v || "")
                          }
                          className="md:col-span-2"
                        />
                      </>
                    )}
                    <Input
                      name={`orderGroups[${i}].pieces[${j}].order_date`}
                      label="تاریخ"
                      value={p.order_date}
                      onChange={(v) =>
                        handlePieceChange(i, j, "order_date", v || "")
                      }
                    />
                    <Input
                      name={`orderGroups[${i}].pieces[${j}].prediction_delivery_date`}
                      label="تحویل"
                      value={p.prediction_delivery_date}
                      onChange={(v) =>
                        handlePieceChange(
                          i,
                          j,
                          "prediction_delivery_date",
                          v || ""
                        )
                      }
                    />
                    <Select
                      name={`orderGroups[${i}].pieces[${j}].status`}
                      label="وضعیت"
                      className="mt-2"
                      inputStyle="w-full"
                      value={p.status}
                      onChange={(v) =>
                        handlePieceChange(i, j, "status", v || "دریافت نشده")
                      }
                      options={[
                        { value: "دریافت نشده", label: "دریافت نشده" },
                        { value: "دریافت شده", label: "دریافت شده" },
                      ]}
                    />
                    <Select
                      name={`orderGroups[${i}].pieces[${j}].settlement_status`}
                      label="تسویه"
                      className="mt-2"
                      inputStyle="w-full"
                      value={p.settlement_status}
                      onChange={(v) =>
                        handlePieceChange(
                          i,
                          j,
                          "settlement_status",
                          v || "پرداخت نشده"
                        )
                      }
                      options={[
                        { value: "پرداخت نشده", label: "پرداخت نشده" },
                        { value: "پرداخت شده", label: "پرداخت شده" },
                      ]}
                    />
                    <Input
                      name={`orderGroups[${i}].pieces[${j}].description`}
                      label="توضیحات"
                      type="textarea"
                      value={p.description}
                      onChange={(v) =>
                        handlePieceChange(i, j, "description", v || "")
                      }
                      className="md:col-span-4"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* دکمه‌های فرم */}
        <div className="flex justify-end items-center mt-2 space-x-2 border border-gray-200 p-2 rounded">
          <Button type="submit">ثبت</Button>
          <Button type="button" onClick={handleSubmit}>
            ثبت نهایی
          </Button>
        </div>
      </Form>
    </Card>
  );
}