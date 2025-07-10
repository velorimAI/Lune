import React from "react";
import { Wrench, PackageOpen, DollarSign, PlusCircle as CirclePlus } from "lucide-react";
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

  const isAccountant = role === "حسابدار";
  const isWarehouse = role === "انباردار";

  // لیست وضعیت‌هایی که باعث غیرفعال شدن AddItem می‌شوند
  const DISABLED_STATUSES = [
    'در انتظار تائید شرکت',
    'در انتظار تائید حسابداری',
    'در انتظار دریافت',
    'در انتظار نوبت دهی',
    'نوبت داده شد',
    'دریافت شد'
  ];

  // بررسی اینکه آیا هیچ سفارشی در وضعیت غیرمجاز وجود دارد
  const isAddItemDisabled = order?.receptions?.some((r: any) =>
    r.orders?.some((o: any) => DISABLED_STATUSES.includes(o.status))
  );

  return (
    <div className="bg-white border border-gray-200 border-t-0 rounded-xl rounded-t-none p-5 pt-0 shadow-md">
      <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold text-lg">
        <Wrench className="w-5 h-5" />
        <span>
          جزئیات قطعات (
          {order?.receptions?.flatMap((r: { orders: any; }) => r.orders || []).length || 0})
        </span>
        <AddItem id={id} disabled={isAddItemDisabled} />
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
                      colSpan={10}
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
                          <CirclePlus className="text-gray-300 w-5 h-5" />
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
                        <td className="px-4 py-3">{part.estimated_arrival_days}</td>
                        <td className="px-4 py-3">
                          {part.delivery_date ? part.delivery_date.split("T")[0] : "-"}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          <div className="flex items-center gap-1.5">
                            {(() => {
                              const { color, icon } = getStatusStyle(part.status);
                              return (
                                <>
                                  {icon}
                                  <span className={color}>{part.status}</span>
                                </>
                              );
                            })()}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center flex gap-3 justify-center items-center">
                          <div className="flex justify-center items-center gap-1">
                            {options[0] && canEdit && (
                              <ConfirmCircle
                                onConfirm={async () => {
                                  const previousStatus = part.status;
                                  const newStatus = options[0].value;
                                  try {
                                    await editOrder(part.order_id, { status: newStatus });
                                    toast.success(
                                      `وضعیت «${part.piece_name}» از «${previousStatus}» به «${newStatus}» تغییر کرد`,
                                      {
                                        duration: 2500,
                                        dismissible: true,
                                      }
                                    );
                                    refetch();
                                  } catch (error) {
                                    toast.error("خطا در تغییر وضعیت قطعه", {
                                      duration: 3000,
                                    });
                                  }
                                }}
                              />
                            )}
                            {options[1] && canEdit && (
                              <CancelCircle
                                onCancel={async () => {
                                  try {
                                    await editOrder(part.order_id, {
                                      status: options[1].value,
                                    });
                                    toast.success(`وضعیت «${part.piece_name}» لغو شد`, {
                                      duration: 2000,
                                      dismissible: true,
                                    });
                                    refetch();
                                  } catch {
                                    toast.error("خطا در لغو وضعیت");
                                  }
                                }}
                              />
                            )}
                          </div>
                          <DeleteItem id={String(part.order_id)} name={part.piece_name} />
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
