import React, { useState } from "react";
import { Wrench, PackageOpen, DollarSign, PlusCircle as CirclePlus, InfoIcon, MessageCircleMore } from "lucide-react";
import { DeleteItem } from "./delete-items";
import { getStatusStyle } from "./statusStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faCarCrash } from "@fortawesome/free-solid-svg-icons";
import AddItem from "./add-item";
import { ConfirmCircle } from "./check-confrim";
import { CancelCircle } from "./cancel-circle";
import { editOrder } from "@/app/apis/orders/orderService";
import { getStatusOptions } from "@/lib/getStatusOptions";
import { toast } from "sonner";
import { InsertDate } from "./insert-date";
import ToolTip from "@/app/components/custom-tooltip";

// interface Order {
//   receptions: Reception[];
// }

// interface Reception {
//   reception_number: string;
//   car_status: string;
//   settlement_status: string;
//   orders: OrderItem[];
// }

// interface OrderItem {
//   order_id: string;
//   piece_name: string;
//   number_of_pieces: number;
//   order_channel: string;
//   order_date: string;
//   order_number: string;
//   estimated_arrival_days: number;
//   delivery_date: string | null;
//   status: string;
// }

export const OrderDetails = ({
  id,
  order,
  refetch
}: {
  id: number;
  order: any;
  refetch: () => void;
}) => {
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const [openDateModal, setOpenDateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const isAccountant = role === "حسابدار";
  const isWarehouse = role === "انباردار";

  return (
    <div className="bg-white border border-gray-200 border-t-0 rounded-xl rounded-t-none p-5 pt-0 shadow-md">
      <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold text-lg">
        <Wrench className="w-5 h-5" />
        <span>
          جزئیات قطعات (
          {order?.receptions?.flatMap((r: { orders: any; }) => r.orders || []).length || 0})
        </span>
        <AddItem id={id} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-right text-gray-800 border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">نام قطعه</th>
              <th className="px-4 py-2">کد فنی</th>
              <th className="px-4 py-2">تعداد</th>
              <th className="px-4 py-2">نوع سفارش</th>
              <th className="px-4 py-2">تاریخ سفارش</th>
              <th className="px-4 py-2">شماره سفارش</th>
              <th className="px-4 py-2">رسیدن (روز)</th>
              <th className="px-4 py-2">تاریخ تحویل</th>
              <th className="px-4 py-2">وضعیت</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {order?.receptions?.map(
              (
                reception: {
                  reception_number: string;
                  car_status: string;
                  settlement_status: string;
                  orders: any[];
                },
                i: React.Key | null | undefined
              ) => (
                <React.Fragment key={i}>
                  <tr>
                    <td
                      colSpan={10} // چون جدول شما 10 ستون دارد
                      className="bg-blue-50 text-blue-800 font-bold px-4 py-2 border-y border-blue-300"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-left">
                            <span>شماره پذیرش: {reception.reception_number}</span>
                            <span className="flex items-center gap-1">
                              (<span>{reception.car_status}</span>
                              {reception.car_status === "متوقف" ? (
                                <FontAwesomeIcon
                                  icon={faCarCrash}
                                  className="text-gray-500 text-[17px]"
                                />
                              ) : reception.car_status === "متوقع" ? (
                                <FontAwesomeIcon
                                  icon={faCar}
                                  className="text-gray-500"
                                />
                              ) : null}
                              )
                            </span>
                            <DollarSign className="inline w-4 h-4 align-middle" />
                            <span className="font-normal text-gray-800">
                              {reception.settlement_status || "-"}
                            </span>
                          </div>
                          <CirclePlus className="text-gray-800 cursor-pointer w-5 h-5 transition-all duration-300 hover:text-gray-900 hover:scale-125 hover:rotate-12 hover:drop-shadow-lg" />
                        </div>
                      </div>
                    </td>

                  </tr>

                  {reception.orders.map((part: any, j: any) => {
                    const options = getStatusOptions(
                      part.status,
                      part.order_channel,
                      reception.car_status
                    );

                    const canEdit =
                      (isAccountant && part.status === "در انتظار تائید حسابداری") ||
                      (isWarehouse && part.status !== "در انتظار تائید حسابداری");

                    return (
                      <tr
                        key={j}
                        className={`border-b ${j % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      >
                        <td className="px-4 py-3 flex items-center gap-1.5 font-medium text-gray-800">
                          <PackageOpen className="w-5 h-5 text-gray-600" />
                          {part.piece_name}
                        </td>
                        <td className="px-4 py-3">{part.part_id}</td>

                        <td className="px-4 py-3">{part.number_of_pieces}</td>
                        <td className="px-4 py-3 font-semibold">{part.order_channel}</td>
                        <td className="px-4 py-3">
                          {part.order_date ? part.order_date.split("T")[0] : "-"}
                        </td>
                        <td className="px-4 py-3">{part.order_number}</td>
                        <td className="px-4 py-3">
                          {part.estimated_arrival_days}
                        </td>
                        <td className="px-4 py-3">
                          {part.delivery_date ? part.delivery_date.split("T")[0] : "-"}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          <div className="flex items-center gap-1.5">
                            {(() => {
                              const { color, icon } = getStatusStyle(
                                part.status
                              );
                              return (
                                <>
                                  {icon}
                                  <span className={color}>{part.status}</span>
                                </>
                              );
                            })()}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center flex gap-3 justify-end items-center">
                          <div className="flex justify-center items-center gap-1">
                            {options[0] && canEdit && (
                              <ToolTip hint={`${options[0].value}`}>
                                <div>
                                  <ConfirmCircle
                                    onConfirm={async () => {
                                      const previousStatus = part.status;
                                      const newStatus = options[0].value;

                                      if (newStatus === "نوبت داده شد") {
                                        setSelectedOrder({ id: part.order_id, name: part.piece_name });
                                        setOpenDateModal(true);
                                        return;
                                      }

                                      try {
                                        await editOrder(part.order_id, { status: newStatus });
                                        toast.success(
                                          `وضعیت «${part.piece_name}» از «${previousStatus}» به «${newStatus}» تغییر کرد`,
                                          { duration: 2500 }
                                        );
                                        refetch();
                                      } catch (error) {
                                        toast.error("خطا در تغییر وضعیت قطعه", { duration: 3000 });
                                      }
                                    }}
                                  />
                                </div>
                              </ToolTip>
                            )}

                            {options[1] && canEdit && (
                              <ToolTip hint={`لغو`}>
                                <div>
                                  <CancelCircle
                                    onCancel={async (description: string) => {
                                      try {
                                        await editOrder(part.order_id, {
                                          status: options[1].value,
                                          description: description,
                                        });
                                        toast.success(
                                          `وضعیت «${part.piece_name}» لغو شد با توضیح: «${description || "بدون توضیح"}»`,
                                          {
                                            duration: 2000,
                                            dismissible: true,
                                          }
                                        );
                                        refetch();
                                      } catch {
                                        toast.error("خطا در لغو وضعیت");
                                      }
                                    }}
                                  />
                                </div>
                              </ToolTip>
                            )}

                          </div>
                          <div className="flex gap-1">
                            <DeleteItem
                              id={String(part.order_id)}
                              name={part.piece_name}
                            />
                            {(part.description || part.all_description) && (
                              <ToolTip
                                hintClassName="ml-4"
                                hint={
                                  <div className="space-y-2 text-sm leading-6 text-gray-100 max-w-[400px]">
                                    {part.all_description && (
                                      <div>
                                        <div className="font-semibold text-white  mb-1">توضیحات کلی :</div>
                                        <p className="text-gray-300 ">{part.all_description}</p>
                                      </div>
                                    )}
                                    {part.description && (
                                      <div>
                                        <div className="font-semibold text-red-600 dark:text-red-400 mb-1">علت لغو :</div>
                                        <p className="text-gray-300">{part.description}</p>
                                      </div>
                                    )}
                                  </div>
                                }
                              >
                                <MessageCircleMore className="w-6 h-6 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white cursor-pointer" />
                              </ToolTip>
                            )}
                          </div>


                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
      <InsertDate
        open={openDateModal}
        onClose={() => {
          setOpenDateModal(false);
          setSelectedOrder(null);
        }}
        onSubmit={async (data) => {
          if (!selectedOrder) return;

          try {
            await editOrder(selectedOrder.id, {
              status: "نوبت داده شد",
              appointment_date: data.Date,
              appointment_time: data.time,
            });

            toast.success(`نوبت برای «${selectedOrder.name}» با موفقیت ثبت شد`);
            refetch();
          } catch (error) {
            toast.error("خطا در ثبت نوبت");
          } finally {
            setOpenDateModal(false);
            setSelectedOrder(null);
          }
        }}
      />


    </div>
  );
};
