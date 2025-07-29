"use client";

import React, { useState } from "react";
import { Wrench, PackageOpen, MessageCircleMore } from "lucide-react";
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
import AddItemToReception from "./add-item-to-reception";
import { CheckBox } from "@/app/components/custom-form/check-box";
import { Button } from "@/app/components/button";
import InsertDescription from "./insert-description";
import { UpdateDiscription } from "./update-description";
import { InsertFinalOrderNumber } from "./insert-final-order-number";

export const OrderDetails = ({
  id,
  order,
  refetch,
  selectable = false,
  currentTab,
  role,
}: {
  id: number;
  order: any;
  refetch: () => void;
  selectable?: boolean;
  currentTab: string;
  role: string | null;
}) => {
  const [openReceptionIndex, setOpenReceptionIndex] = useState<number | null>(
    null
  );
  const [openDateModal, setOpenDateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);
  const [itemsToCancel, setItemsToCancel] = useState<any[]>([]);
  const isAccountant = role === "حسابدار";
  const isWarehouse = role === "انباردار";
  const isSelectableTab = !["تحویل شد", "canceled", "all"].includes(currentTab);
  const [confirmHold, setConfirmHold] = useState(false);
  const [cancelHold, setCancelHold] = useState(false);
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const [openFinalOrderModal, setOpenFinalOrderModal] = useState(false);
  const [selectedFinalOrderItem, setSelectedFinalOrderItem] = useState<any>(null);


  const handleHoldStart = (type: "confirm" | "cancel") => {
    const timer = setTimeout(() => {
      if (type === "confirm") {
        handleMultiConfirm();
        setConfirmHold(false);
      } else {
        handleMultiCancel();
        setCancelHold(false);
      }
    }, 2000); 

    setHoldTimer(timer);
    if (type === "confirm") setConfirmHold(true);
    else setCancelHold(true);
  };

  const handleHoldEnd = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
    setConfirmHold(false);
    setCancelHold(false);
  };

  const canShowSelectUI =
    (isAccountant && currentTab === "در انتظار تائید حسابداری") ||
    (isWarehouse &&
      currentTab !== "در انتظار تائید حسابداری" &&
      currentTab !== "در انتظار نوبت‌دهی" &&
      isSelectableTab) ||
    (role === "پذیرش" && currentTab === "در انتظار نوبت‌دهی");

  const canSelectItem = (part: any) => {
    if (role === "پذیرش" && part.status === "در انتظار نوبت دهی") return true;
    if (role === "حسابدار" && part.status === "در انتظار تائید حسابداری") return true;
    if (
      role === "انباردار" &&
      isSelectableTab &&
      part.status !== "در انتظار نوبت دهی" &&
      part.status !== "در انتظار تائید حسابداری"
    ) {
      return true;
    }
    return false;
  };


  const isSelected = (id: string) => selectedItems.includes(id);

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const allSelectableIds =
      order?.receptions
        ?.flatMap((r: any) => r.orders || [])
        .filter(canSelectItem)
        .map((o: any) => o.order_id) || [];

    if (selectedItems.length === allSelectableIds.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allSelectableIds);
    }
  };

  const handleMultiConfirm = async () => {
    const allOrders = order?.receptions?.flatMap((r: any) => r.orders || []);
    const selectedOrders = allOrders
      .filter((order: any) => selectedItems.includes(order.order_id))
      .filter((order: any) => {
        if (order.status === "در انتظار نوبت دهی") {
          return role === "پذیرش";
        }
        if (order.status === "در انتظار تائید حسابداری") {
          return role === "حسابدار";
        }
        if (
          role === "انباردار" &&
          order.status !== "در انتظار نوبت دهی" &&
          order.status !== "در انتظار تائید حسابداری"
        ) {
          return true;
        }
        return false;
      });

    if (selectedOrders.length === 0) {
      toast.warning("هیچ قطعه‌ای برای تایید موجود نیست یا دسترسی ندارید");
      return;
    }

    const needFinalNumber = selectedOrders.find(
      (part: any) => part.status === "در انتظار تایید شرکت"
    );

    if (needFinalNumber) {
      setSelectedFinalOrderItem({
        id: needFinalNumber.order_id,
        name: needFinalNumber.piece_name,
      });
      setOpenFinalOrderModal(true);
      return;
    }

    const needDateSelection = selectedOrders.find(
      (part: any) =>
        part.status === "در انتظار نوبت دهی" && part.reception_car_status === "متوقع"
    );

    if (needDateSelection) {
      setSelectedOrder({
        id: needDateSelection.order_id,
        name: needDateSelection.piece_name,
      });
      setOpenDateModal(true);
      return;
    }
    let successCount = 0;

    await Promise.all(
      selectedOrders.map(async (part: any) => {
        const options = getStatusOptions(
          part.status,
          part.order_channel,
          part.reception_car_status || ""
        );
        const nextStatus = options[0]?.value;

        if (!nextStatus || nextStatus === "نوبت داده شد") return;

        if (
          part.reception_car_status === "متوقع" &&
          part.status === "در انتظار نوبت دهی"
        ) {
          setSelectedOrder({ id: part.order_id, name: part.piece_name });
          setOpenDateModal(true);
          return;
        }

        if (part.status === "در انتظار تائید شرکت") {
          setSelectedFinalOrderItem({ id: part.order_id, name: part.piece_name });
          setOpenFinalOrderModal(true);
          return;
        }


        try {
          await editOrder(part.order_id, { status: nextStatus });
          successCount++;
        } catch (error) {
          console.error(`خطا در بروزرسانی قطعه ${part.piece_name}`, error);
        }
      })
    );

    toast.success(`${successCount} قطعه تایید شدند`);
    refetch();
    setSelectedItems([]);
  };


  const handleMultiCancel = async () => {
    const allOrders = order?.receptions?.flatMap((r: any) => r.orders || []);
    const cancellableOrders = allOrders
      .filter((order: any) => selectedItems.includes(order.order_id))
      .filter((order: any) => {
        if (order.status === "در انتظار نوبت دهی") {
          return role === "پذیرش";
        }
        if (order.status === "در انتظار تائید حسابداری") {
          return role === "حسابدار";
        }
        if (
          role === "انباردار" &&
          order.status !== "در انتظار نوبت دهی" &&
          order.status !== "در انتظار تائید حسابداری"
        ) {
          return true;
        }
        return false;
      });

    if (cancellableOrders.length === 0) {
      toast.warning("هیچ قطعه‌ای برای لغو وجود ندارد یا دسترسی ندارید");
      return;
    }

    setItemsToCancel(cancellableOrders);
    setOpenDescriptionModal(true);
  };


  const canShowCancelAll =
    (isWarehouse && isSelectableTab) ||
    isAccountant ||
    (role === "پذیرش" && currentTab === "در انتظار نوبت‌دهی");


  const closedStatuses = [
    "تحویل شد",
    "لغو توسط شرکت",
    "انصراف مشتری",
    "عدم دریافت",
    "عدم پرداخت حسابداری",
    "تحویل نشد",
  ];

  const allOrders =
    order?.receptions?.flatMap((r: any) => r.orders || []) || [];
  const allClosed = allOrders.every((o: any) =>
    closedStatuses.includes(o.status)
  );

  return (
    <div className="bg-white border border-gray-200 border-t-0 rounded-xl rounded-t-none p-5 pt-0 shadow-md">
      <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold text-lg">
        <Wrench className="w-5 h-5" />
        <span>
          جزئیات قطعات (
          {order?.receptions?.flatMap((r: { orders: any }) => r.orders || [])
            .length || 0}
          )
        </span>
        {allClosed ? (
          <AddItem id={id} disabled={isAccountant} />
        ) : (
          (() => {
            const openReceptions = order?.receptions?.filter((r: any) =>
              (r.orders || []).some(
                (o: any) => !closedStatuses.includes(o.status)
              )
            );

            const latestOpenReception =
              openReceptions?.[openReceptions.length - 1];

            return latestOpenReception ? (
              <AddItemToReception
                id={latestOpenReception.reception_id}
                data={order.receptions}
                refetch={refetch}
                onClose={() => setOpenReceptionIndex(null)}
                disabled={isAccountant}
              />
            ) : null;
          })()
        )}
      </div>

      {selectedItems.length > 0 && (
        <div className="flex gap-2 mb-4">
          {canShowCancelAll && (
            <>
              {selectedItems.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {canShowCancelAll && (
                    <>
                      <Button
                        onMouseDown={() => handleHoldStart("confirm")}
                        onMouseUp={handleHoldEnd}
                        onMouseLeave={handleHoldEnd}
                        className="relative overflow-hidden bg-white border border-black group  transition-colors duration-200 hover:bg-white hover:text-black hover:cursor-pointer"
                      >
                        <span
                          className={`absolute inset-0 bg-black transition-transform duration-[2000ms] ease-linear origin-left transform ${confirmHold ? "scale-x-100" : "scale-x-0"
                            }`}
                          aria-hidden="true"
                        />

                        <span
                          className={`
                        relative z-10 transition-colors duration-200
                         ${confirmHold ? "text-white" : "text-black"}
                         group-hover:text-black
                                    `}
                        >
                          تایید همه
                        </span>
                      </Button>

                      <Button
                        variant="outline"
                        onMouseDown={() => handleHoldStart("cancel")}
                        onMouseUp={handleHoldEnd}
                        onMouseLeave={handleHoldEnd}
                        className="relative overflow-hidden bg-white border border-red-800  transition-colors duration-200"
                      >
                        <span
                          className={`absolute inset-0 bg-red-600 transition-transform duration-[2000ms] ease-linear origin-left transform ${cancelHold ? "scale-x-100" : "scale-x-0"
                            }`}
                          aria-hidden="true"
                        />
                        <span className="relative z-10 text-black">
                          لغو همه
                        </span>
                      </Button>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-right text-gray-800 border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {canShowSelectUI && (
                <th className="px-4 py-2">
                  <CheckBox
                    checked={
                      selectedItems.length ===
                      order?.receptions
                        ?.flatMap((r: any) => r.orders || [])
                        .filter(canSelectItem).length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
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
                  reception_id: number;
                },
                i: number
              ) => (
                <React.Fragment key={i}>
                  <tr>
                    <td
                      colSpan={11}
                      className="bg-blue-50 text-blue-800 font-bold px-4 py-2 border-y border-blue-300"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-left mr-4">
                            <span>
                              شماره پذیرش: {reception.reception_number}
                            </span>
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
                          </div>
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
                      (role === "پذیرش" && part.status === "در انتظار نوبت دهی") ||
                      (role === "حسابدار" && part.status === "در انتظار تائید حسابداری") ||
                      (role === "انباردار" &&
                        part.status !== "در انتظار نوبت دهی" &&
                        part.status !== "در انتظار تائید حسابداری" &&
                        currentTab !== "در انتظار تائید حسابداری");


                    return (
                      <tr
                        key={j}
                        className={`border-b ${j % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                      >
                        {canShowSelectUI && canSelectItem(part) && (
                          <td className="px-4 py-3 text-center">
                            <CheckBox
                              checked={isSelected(part.order_id)}
                              onChange={() => toggleSelect(part.order_id)}
                            />
                          </td>
                        )}

                        <td className="px-4 py-3 flex items-center gap-1.5 font-medium text-gray-800">
                          <PackageOpen className="w-5 h-5 text-gray-600" />
                          {part.piece_name}
                        </td>
                        <td className="px-4 py-3">{part.part_id}</td>

                        <td className="px-4 py-3">{part.number_of_pieces}</td>
                        <td className="px-4 py-3 font-semibold">
                          {part.order_channel}
                        </td>
                        <td className="px-4 py-3">
                          {part.order_date
                            ? part.order_date.split("T")[0]
                            : "-"}
                        </td>
                        <td className="px-4 py-3">{part.order_number}</td>
                        <td className="px-4 py-3">
                          {part.estimated_arrival_days}
                        </td>
                        <td className="px-4 py-3">
                          {part.delivery_date
                            ? part.delivery_date.split("T")[0]
                            : "-"}
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
                            {options[0] &&
                              (
                                (part.status === "در انتظار نوبت دهی" && role === "پذیرش") ||
                                (part.status === "در انتظار تائید حسابداری" && role === "حسابدار") ||
                                (
                                  role === "انباردار" &&
                                  part.status !== "در انتظار نوبت دهی" &&
                                  part.status !== "در انتظار تائید حسابداری" &&
                                  currentTab !== "در انتظار تائید حسابداری"
                                )
                              ) && (
                                <ToolTip status={part.status} actionType="confirm">
                                  <div>
                                    <ConfirmCircle
                                      onConfirm={async () => {
                                        const previousStatus = part.status;
                                        const newStatus = options[0].value;

                                        if (newStatus === "نوبت داده شد") {
                                          setSelectedOrder({
                                            id: part.order_id,
                                            name: part.piece_name,
                                          });
                                          setOpenDateModal(true);
                                          return;
                                        }

                                        if (part.status === "در انتظار تائید شرکت") {
                                          setSelectedFinalOrderItem({
                                            id: part.order_id,
                                            name: part.piece_name,
                                          });
                                          setOpenFinalOrderModal(true);
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
                                          toast.error("خطا در تغییر وضعیت قطعه", {
                                            duration: 3000,
                                          });
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
                                          `وضعیت «${part.piece_name
                                          }» لغو شد با توضیح: «${description || "بدون توضیح"
                                          }»`,
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
<<<<<<< HEAD
                            <UpdateDiscription data={part} refetch={refetch}  />
=======
                            <UpdateDiscription data={part} />
>>>>>>> fixing-orders-deatail-for-reception-iliya
                            <DeleteItem
                              id={String(part.order_id)}
                              name={part.piece_name}
                              disabled={isAccountant}
                            />
                            <ToolTip
                              hintClassName="ml-4"
                              hint={
                                part.description || part.all_description ? (
                                  <div className="space-y-2 text-sm leading-6 text-gray-100 max-w-[400px]">
                                    {part.all_description && (
                                      <div>
                                        <div className="font-semibold text-white mb-1">
                                          توضیحات کلی :
                                        </div>
                                        <p className="text-gray-300">
                                          {part.all_description}
                                        </p>
                                      </div>
                                    )}
                                    {part.description && (
                                      <div>
                                        <div className="font-semibold text-red-600 dark:text-red-400 mb-1">
                                          علت لغو :
                                        </div>
                                        <p className="text-gray-300">
                                          {part.description}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-300">
                                    توضیحاتی وجود ندارد
                                  </div>
                                )
                              }
                            >
                              <MessageCircleMore
                                className={`
                                    w-6 h-6
                                    ${part.description || part.all_description
                                    ? "text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                                    : "text-gray-400 "
                                  }
                                `}
                              />
                            </ToolTip>
                          </div>
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

      <InsertDescription
        open={openDescriptionModal}
        onClose={() => {
          setOpenDescriptionModal(false);
          setItemsToCancel([]);
        }}
        onSubmit={async (description) => {
          if (itemsToCancel.length === 0) {
            toast.warning("هیچ قطعه‌ای برای لغو انتخاب نشده است");
            return;
          }

          let successCount = 0;
          await Promise.all(
            itemsToCancel.map(async (part) => {
              try {
                const options = getStatusOptions(
                  part.status,
                  part.order_channel,
                  part.car_status || ""
                );
                const cancelStatus = options[1]?.value || "لغو شده";

                await editOrder(part.order_id, {
                  status: cancelStatus,
                  description,
                });
                successCount++;
              } catch (error) {
                console.error(`خطا در لغو قطعه ${part.piece_name}`, error);
              }
            })
          );

          toast.success(`${successCount} قطعه با موفقیت لغو شدند`);
          refetch();
          setSelectedItems([]);
          setItemsToCancel([]);
          setOpenDescriptionModal(false);
        }}
      />
      <InsertFinalOrderNumber
        open={openFinalOrderModal}
        onClose={() => {
          setOpenFinalOrderModal(false);
          setSelectedItems([]);
          setSelectedFinalOrderItem(null);
        }}
        onSubmit={async (final_order_number) => {
          let targets: any[] = [];

          const allOrders =
            order?.receptions?.flatMap((r: any) => r.orders || []) || [];


          if (selectedFinalOrderItem) {
            const item = allOrders.find(
              (o: any) => o.order_id === selectedFinalOrderItem.id
            );
            if (item) targets.push(item);
          } else {
            targets = allOrders.filter((o: any) =>
              selectedItems.includes(o.order_id)
            );
          }

          let successCount = 0;

          await Promise.all(
            targets.map(async (part: any) => {
              try {
                const options = getStatusOptions(
                  part.status,
                  part.order_channel,
                  part.car_status || ""
                );
                const confirmStatus = options[0]?.value || "";

                await editOrder(part.order_id, {
                  status: confirmStatus,
                  final_order_number,
                });
                successCount++;
              } catch (error) {
                console.error(`خطا در تایید قطعه ${part.piece_name}`, error);
              }
            })
          );

          toast.success(`${successCount} قطعه با موفقیت تایید شدند`);
          refetch();
          setSelectedItems([]);
          setSelectedFinalOrderItem(null);
          setOpenFinalOrderModal(false);
        }}
      />

    </div>
  );
};