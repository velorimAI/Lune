"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/card";
import { Form } from "@/app/components/custom-form/form";
import { Input } from "@/app/components/custom-form/input";
import { Select } from "@/app/components/custom-form/select-box";
import { Button } from "@/app/components/button";
import { toast } from "sonner";
import { ArrowLeft, RefreshCcw, Edit2, Trash2} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Piece = {
  piece_name: string;
  part_id: string;
  number_of_pieces: number;
  order_channel: string;
  market_name: string;
  market_phone: string;
  prediction_delivery_date?: string;
  status?: string;
  settlement_status?: string;
  description?: string;
  confirmed?: boolean;
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
  const [registeredPieces, setRegisteredPieces] = useState<Piece[]>([]);

  function emptyPiece(): Piece {
    return {
      piece_name: "",
      part_id: "",
      number_of_pieces: 1,
      order_channel: "",
      market_name: "",
      market_phone: "",
      prediction_delivery_date: "",
      status: "دریافت نشده",
      settlement_status: "پرداخت نشده",
      description: "",
      confirmed: false,
    };
  }

  const handleRemoveOrderGroup = (idx: number) => {
    const groups = orderGroups.filter((_, i) => i !== idx);
    setOrderGroups(
      groups.length
        ? groups
        : [{ order_number: "", pieces: [emptyPiece()] }]
    );
  };

  const handleOrderNumberChange = (idx: number, value?: string) => {
    const groupsCopy = [...orderGroups];
    groupsCopy[idx].order_number = value || "";
    setOrderGroups(groupsCopy);
  };

  const handleAddPiece = (orderIdx: number) => {
    const groupsCopy = [...orderGroups];
    groupsCopy[orderIdx].pieces.push(emptyPiece());
    setOrderGroups(groupsCopy);
  };

  const handleRemovePiece = (orderIdx: number, pieceIdx: number) => {
    const groupsCopy = [...orderGroups];
    const filteredPieces = groupsCopy[orderIdx].pieces.filter(
      (_, j) => j !== pieceIdx
    );
    groupsCopy[orderIdx].pieces = filteredPieces.length
      ? filteredPieces
      : [emptyPiece()];
    setOrderGroups(groupsCopy);
  };

  const handlePieceChange = (
    orderIdx: number,
    pieceIdx: number,
    field: keyof Piece,
    value: string | number | boolean
  ) => {
    const groupsCopy = [...orderGroups];
    if (field === "number_of_pieces") {
      groupsCopy[orderIdx].pieces[pieceIdx][field] = Number(value);
    } else if (field === "confirmed") {
      groupsCopy[orderIdx].pieces[pieceIdx][field] = Boolean(value);
    } else {
      groupsCopy[orderIdx].pieces[pieceIdx][field] = value as string;
    }
    setOrderGroups(groupsCopy);
  };

  const handleRegisterPiece = (orderIdx: number, pieceIdx: number) => {
    const pieceToRegister = orderGroups[orderIdx].pieces[pieceIdx];
    
    let hasEmpty = false;
    if (!pieceToRegister.piece_name.trim()) hasEmpty = true;
    if (!pieceToRegister.part_id.trim()) hasEmpty = true;
    if (!String(pieceToRegister.number_of_pieces).trim()) hasEmpty = true;
    if (!pieceToRegister.order_channel.trim()) hasEmpty = true;
    if (!pieceToRegister.prediction_delivery_date?.trim()) hasEmpty = true;
    if (pieceToRegister.order_channel === "انبار مرکزی") {
      if (!pieceToRegister.market_name.trim()) hasEmpty = true;
      if (!pieceToRegister.market_phone.trim()) hasEmpty = true;
    }

    if (hasEmpty) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
      // Update the piece with error states for empty fields
      const groupsCopy = [...orderGroups];
      groupsCopy[orderIdx].pieces[pieceIdx] = {
        ...pieceToRegister,
        piece_name: pieceToRegister.piece_name.trim() ? pieceToRegister.piece_name : "",
        part_id: pieceToRegister.part_id.trim() ? pieceToRegister.part_id : "",
        number_of_pieces: pieceToRegister.number_of_pieces || 1,
        order_channel: pieceToRegister.order_channel.trim() ? pieceToRegister.order_channel : "",
        market_name: pieceToRegister.order_channel === "انبار مرکزی" && pieceToRegister.market_name.trim() ? pieceToRegister.market_name : "",
        market_phone: pieceToRegister.order_channel === "انبار مرکزی" && pieceToRegister.market_phone.trim() ? pieceToRegister.market_phone : "",
        prediction_delivery_date: pieceToRegister.prediction_delivery_date?.trim() ? pieceToRegister.prediction_delivery_date : "",
      };
      setOrderGroups(groupsCopy);
      return;
    }

    setRegisteredPieces((prev) => [...prev, pieceToRegister]);
    handleRemovePiece(orderIdx, pieceIdx);
  };


  const handleResetForm = () => {
    setCustomerInfo({ name: "", phone_number: "", car_status: "متوقف" });
    setReceptionInfo({ reception_number: "", reception_date: "" });
    setOrderGroups([{ order_number: "", pieces: [emptyPiece()] }]);
  };

  const handleRemoveRegisteredPiece = (idx: number) => {
    const updated = registeredPieces.filter((_, i) => i !== idx);
    setRegisteredPieces(updated);
  };

  const handleEditRegisteredPiece = (idx: number) => {
    const pieceToEdit = registeredPieces[idx];
    setOrderGroups((prev) => {
      const newGroups = [...prev];
      newGroups[0].pieces[0] = pieceToEdit; 
      return newGroups;
    });
    handleRemoveRegisteredPiece(idx);
  };

  // --- Final submit: gather all data and POST to backend ---
  const handleSubmit = async () => {
    // Basic client‐side check: highlight any empty required fields
    let hasEmpty = false;

    if (!customerInfo.name.trim() || !customerInfo.phone_number.trim()) {
      hasEmpty = true;
    }
    if (!receptionInfo.reception_number.trim() || !receptionInfo.reception_date) {
      hasEmpty = true;
    }
    orderGroups.forEach((grp) => {
      if (!grp.order_number.trim()) {
        hasEmpty = true;
      }
      grp.pieces.forEach((p) => {
        if (
          !p.piece_name.trim() ||
          !p.part_id.trim() ||
          !String(p.number_of_pieces).trim() ||
          !p.order_channel.trim() ||
          !String(p.prediction_delivery_date).trim()
        ) {
          hasEmpty = true;
        }
        if (p.order_channel === "انبار مرکزی") {
          if (!p.market_name.trim() || !p.market_phone.trim()) {
            hasEmpty = true;
          }
        }
      });
    });

    if (hasEmpty) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
      return;
    }

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
            prediction_delivery_date: p.prediction_delivery_date,
          },
          status: {
            status: p.status,
            settlement_status: p.settlement_status,
          },
          description: p.description,
          confirmed: p.confirmed,
        })),
      })),
    };

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3001/api/orders/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("سفارش‌ها با موفقیت ثبت شدند");
        setOrderGroups([{ order_number: "", pieces: [emptyPiece()] }]);
        setRegisteredPieces([]);
      } else {
        toast.error("خطا در ثبت سفارش‌ها");
      }
    } catch {
      toast.error("مشکل در ارتباط با سرور");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card
        title="ثبت سفارش"
        extra={
          <Button
            onClick={() => router.push("/orders")}
            variant="outline"
            size="sm"
            className="ml-2"
          >
            <ArrowLeft size={16} className="text-black" />
          </Button>
        }
        className="w-full p-4"
      >
        <div className="flex justify-start mb-4">
          <Button onClick={handleResetForm} size="sm" variant="outline" className="text-black">
            <RefreshCcw size={16} />
          </Button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-blue-700">📦 ثبت سفارش</h4>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          <div>
            <Form cancelHide submitHide onSubmit={handleSubmit} >
              {/*  Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-2">
                <Input
                  name="customer.name"
                  label="نام و خانوادگی"
                  required={false}
                  value={customerInfo.name}
                  onChange={(v) =>
                    setCustomerInfo({ ...customerInfo, name: v || "" })
                  }
                  className={`${
                    !customerInfo.name.trim() ? "border-red-500" : ""
                  }`}
                />
                <Input
                  name="customer.phone_number"
                  label="شماره تماس"
                  required={false}
                  value={customerInfo.phone_number}
                  onChange={(v) =>
                    setCustomerInfo({
                      ...customerInfo,
                      phone_number: v || "",
                    })
                  }
                  className={`${
                    !customerInfo.phone_number.trim() ? "border-red-500" : ""
                  }`}
                />
                <Select
                  name="customer.car_status"
                  label="وضعیت خودرو"
                  inputStyle="w-full"
                  labelClassName="mt-2"
                  required={false}
                  value={customerInfo.car_status}
                  onChange={(v) =>
                    setCustomerInfo({ ...customerInfo, car_status: v || "" })
                  }
                  options={[
                    { value: "متوقف", label: "متوقف" },
                    { value: "متوقع", label: "متوقع" },
                  ]}
                  className={`${
                    !customerInfo.car_status.trim() ? "border-red-500" : ""
                  }`}
                />
              </div>

              {/*  Reception Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-2">
                <Input
                  name="reception.reception_number"
                  label="شماره پذیرش"
                  required={false}
                  value={receptionInfo.reception_number}
                  onChange={(v) =>
                    setReceptionInfo({
                      ...receptionInfo,
                      reception_number: v || "",
                    })
                  }
                  className={`${
                    !receptionInfo.reception_number.trim()
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <Input
                  name="reception.reception_date"
                  label="تاریخ پذیرش"
                  type="date"
                  required={false}
                  value={receptionInfo.reception_date}
                  onChange={(v) =>
                    setReceptionInfo({
                      ...receptionInfo,
                      reception_date: v || "",
                    })
                  }
                  className={`${
                    !receptionInfo.reception_date ? "border-red-500" : ""
                  }`}
                />
              </div>

              {/*  Loop through each Order Group */}
              {orderGroups.map((grp, i) => (
                <div key={i} className="mb4 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-md font-semibold text-blue-700">
                      📦 سفارش {i + 1}
                    </h4>
                    {/* Removed Trash button from order group */}
                  </div>

                  {/*  Order Number Input */}
                  <Input
                    name={`orderGroups[${i}].order_number`}
                    label="شماره سفارش"
                    required={false}
                    value={grp.order_number}
                    onChange={(v) => handleOrderNumberChange(i, v)}
                    className={`mb-2 ${
                      !grp.order_number.trim() ? "border-red-500" : ""
                    }`}
                  />

                  {/*  Pieces inside this Order Group */}
                  <div className="space-y-3">
                    {grp.pieces.map((p, j) => (
                      <div
                        key={j}
                        className="p-3 bg-gray-50 rounded border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                            قطعه {j + 1}
                          </div>
                          <Button
                            onClick={() => handleRegisterPiece(i, j)}
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                          >
                            ثبت قطعه
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          <Input
                            name={`orderGroups[${i}].pieces[${j}].piece_name`}
                            label="قطعه"
                            required={false}
                            value={p.piece_name}
                            onChange={(v) =>
                              handlePieceChange(i, j, "piece_name", v || "")
                            }
                            className={`${
                              !p.piece_name.trim() ? "border-red-500" : ""
                            }`}
                          />
                          <Input
                            name={`orderGroups[${i}].pieces[${j}].part_id`}
                            label="کد"
                            required={false}
                            value={p.part_id}
                            onChange={(v) =>
                              handlePieceChange(i, j, "part_id", v || "")
                            }
                            className={`${
                              !p.part_id.trim() ? "border-red-500" : ""
                            }`}
                          />
                          <Input
                            name={`orderGroups[${i}].pieces[${j}].number_of_pieces`}
                            label="تعداد"
                            type="number"
                            required={false}
                            value={String(p.number_of_pieces)}
                            onChange={(v) =>
                              handlePieceChange(
                                i,
                                j,
                                "number_of_pieces",
                                v || "1"
                              )
                            }
                            className={`${
                              !String(p.number_of_pieces).trim()
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                          <Select
                            name={`orderGroups[${i}].pieces[${j}].order_channel`}
                            label="کانال"
                            inputStyle="w-full"
                            labelClassName="mt-2"
                            required={false}
                            value={p.order_channel}
                            onChange={(v) =>
                              handlePieceChange(i, j, "order_channel", v || "")
                            }
                            options={[
                              { value: "VOR", label: "VOR" },
                              { value: "VIS", label: "VIS" },
                              { value: "انبار مرکزی", label: "انبار مرکزی" },
                            ]}
                            className={`${
                              !p.order_channel.trim() ? "border-red-500" : ""
                            }`}
                          />
                          {p.order_channel === "انبار مرکزی" && (
                            <>
                              <Input
                                name={`orderGroups[${i}].pieces[${j}].market_name`}
                                label="فروشگاه"
                                required={false}
                                value={p.market_name}
                                onChange={(v) =>
                                  handlePieceChange(
                                    i,
                                    j,
                                    "market_name",
                                    v || ""
                                  )
                                }
                                className={`md:col-span-2 ${
                                  !p.market_name.trim()
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              <Input
                                name={`orderGroups[${i}].pieces[${j}].market_phone`}
                                label="تلفن فروشگاه"
                                required={false}
                                value={p.market_phone}
                                onChange={(v) =>
                                  handlePieceChange(
                                    i,
                                    j,
                                    "market_phone",
                                    v || ""
                                  )
                                }
                                className={`md:col-span-2 ${
                                  !p.market_phone.trim()
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                            </>
                          )}
                        </div>
                        {/* Modified: Delivery, Status, and Settlement in a 3-column grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                          <Input
                            name={`orderGroups[${i}].pieces[${j}].prediction_delivery_date`}
                            label="تحویل"
                            type="number"
                            required={false}
                            value={p.prediction_delivery_date}
                            onChange={(v) =>
                              handlePieceChange(
                                i,
                                j,
                                "prediction_delivery_date",
                                v || ""
                              )
                            }
                            className={`${
                              !p.prediction_delivery_date?.trim() ? "border-red-500" : ""
                            }`}
                          />
                          <Select
                            name={`orderGroups[${i}].pieces[${j}].status`}
                            label="وضعیت"
                            inputStyle="w-full"
                            labelClassName="mt-2"
                            required={false}
                            value={p.status}
                            onChange={(v) =>
                              handlePieceChange(i, j, "status", v || "")
                            }
                            options={[
                              { value: "دریافت نشده", label: "دریافت نشده" },
                              { value: "دریافت شده", label: "دریافت شده" },
                            ]}
                          />
                          <Select
                            name={`orderGroups[${i}].pieces[${j}].settlement_status`}
                            label="تسویه"
                            inputStyle="w-full"
                            labelClassName="mt-2"
                            required={false}
                            value={p.settlement_status}
                            onChange={(v) =>
                              handlePieceChange(
                                i,
                                j,
                                "settlement_status",
                                v || ""
                              )
                            }
                            options={[
                              { value: "پرداخت نشده", label: "پرداخت نشده" },
                              { value: "پرداخت شده", label: "پرداخت شده" },
                            ]}
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            name={`orderGroups[${i}].pieces[${j}].description`}
                            label="توضیحات"
                            type="textarea"
                            required={false}
                            value={p.description}
                            onChange={(v) =>
                              handlePieceChange(i, j, "description", v || "")
                            }
                          />
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={p.confirmed}
                              onChange={(e) =>
                                handlePieceChange(i, j, "confirmed", e.target.checked)
                              }
                              className="mr-2"
                            />
                            <label>تایید نمایندگی</label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Form>
          </div>

          {/* ---------------- Right Column: Registered Pieces List ---------------- */}
          <div className="bg-gray-100 p-4 rounded-lg flex flex-col">
            <h4 className="text-lg font-medium text-blue-700 mb-3">
              📋 لیست قطعات ثبت‌شده
            </h4>
            {/* Scrollable list area with fixed max-height */}
            <ScrollArea className="overflow-y-auto space-y-2 h-96">
              {registeredPieces.length === 0 ? (
                <p className="text-gray-500 text-right">هیچ قطعه‌ای ثبت نشده است</p>
              ) : (
                registeredPieces.map((piece, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-white rounded border border-gray-200 flex justify-between items-center mb-2"
                  >
                    {/* Modified: Horizontal layout for piece info */}
                    <div className="flex space-x-4">
                      <p className="font-semibold">{piece.piece_name}</p>
                      <p className="text-sm text-gray-600">کد: {piece.part_id}</p>
                      <p className="text-sm text-gray-600">تعداد: {piece.number_of_pieces}</p>
                      <p
                        className={`text-sm ${
                          piece.order_channel === "VOR"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        کانال: {piece.order_channel}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditRegisteredPiece(idx)}
                        size="sm"
                        variant="outline"
                        className="text-blue-600"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        onClick={() => handleRemoveRegisteredPiece(idx)}
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                      >
                        <Trash2  size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
            {/* Final Submit Button (fixed below scrollable list) */}
            <div className="mt-4 sticky bottom-0 bg-gray-100 p-2">
              <Button onClick={handleSubmit} className="w-full font-bold">
                ثبت نهایی
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}