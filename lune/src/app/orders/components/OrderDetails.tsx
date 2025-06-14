import React from "react";
import { Wrench, PackageOpen, CirclePlus } from "lucide-react";
import { DeleteItem } from "./delete-items";
import { getStatusStyle, getPaymentStatusStyle } from "./statusStyles";
import AddItem from "./add-item";

export const OrderDetails = ({ id, order }: { id: number; order: any }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md mt-2">
    <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold text-lg">
      <Wrench className="w-5 h-5" />
      <span>
        جزئیات قطعات (
        {order?.receptions?.flatMap((r: { orders: any }) => r.orders || [])
          .length || 0}
        )
      </span>
      {/* <CirclePlus className="w-5 h-5 mr-auto" /> */}
      <AddItem id={id}/>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-right text-gray-800">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">نام قطعه</th>

            <th className="px-4 py-2">تعداد</th>
            <th className="px-4 py-2">نوع سفارش</th>
            <th className="px-4 py-2">تاریخ سفارش</th>
            <th className="px-4 py-2">شماره سفارش</th>
            <th className="px-4 py-2">رسیدن (روز)</th>
            <th className="px-4 py-2">وضعیت تحویل</th>
            <th className="px-4 py-2">وضعیت پرداخت</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {order?.receptions?.map(
            (
              reception: {
                reception_number:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<
                      unknown,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactPortal
                      | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined;
                orders: any[];
              },
              i: React.Key | null | undefined
            ) => (
              <React.Fragment key={i}>
                <tr>
                  <td
                    colSpan={9}
                    className="bg-blue-50 text-blue-800 font-bold text-right px-4 py-2 border-y border-blue-200"
                  >
                    شماره پذیرش: {reception.reception_number}
                  </td>
                </tr>
                {reception?.orders?.map((part, j) => (
                  <tr
                    key={j}
                    className={`border-b ${
                      j % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 flex items-center gap-1.5 font-medium text-gray-800">
                      <PackageOpen className="w-5 h-5 text-gray-600" />
                      {part?.piece_name}
                    </td>
                    <td className="px-4 py-3">{part?.number_of_pieces}</td>
                    <td className="px-4 py-3 font-semibold">
                      {part?.order_channel}
                    </td>
                    <td className="px-4 py-3">
                      {part?.order_date?.split(" ")[0]}
                    </td>
                    <td className="px-4 py-3">{part?.order_number}</td>
                    <td className="px-4 py-3">
                      {part?.estimated_arrival_days}
                    </td>
                    <td className="px-4 py-3 font-bold">
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
                    <td className="px-4 py-3 font-bold">
                      <div className="flex items-center gap-1.5">
                        {(() => {
                          const { color, icon } = getPaymentStatusStyle(
                            part.settlement_status
                          );
                          return (
                            <>
                              {icon}
                              <span className={color}>
                                {part.settlement_status}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <DeleteItem
                        id={String(part?.order_id)}
                        name={part?.piece_name}
                      />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            )
          )}
        </tbody>
      </table>
    </div>
  </div>
);
