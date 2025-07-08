import React from "react";
import { Wrench, PackageOpen, DollarSign, PlusCircle as CirclePlus } from "lucide-react";
import { DeleteItem } from "./delete-items";
import { getStatusStyle } from "./statusStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faCarCrash } from "@fortawesome/free-solid-svg-icons";
import AddItem from "./add-item";

export const OrderDetails = ({
  id,
  order,
}: {
  id: number;
  order: any;
}) => {
  console.log(order);

  return (
    <div className="bg-white border border-gray-200 border-t-0 rounded-xl rounded-t-none p-5 pt-0 shadow-md">
      <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold text-lg">
        <Wrench className="w-5 h-5" />
        <span>
          جزئیات قطعات (
          {order?.receptions
            ?.flatMap((r: { orders: any[] }) => r.orders || [])
            .length || 0}
          )
        </span>
        <AddItem id={id} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-right text-gray-800 border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">نام قطعه</th>
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
                      colSpan={9}
                      className="bg-blue-50 text-blue-800 font-bold px-4 py-2 border-y border-blue-300"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-left">
                          <span>
                            شماره پذیرش: {reception.reception_number}
                          </span>
                          <span className="flex items-center gap-1">
                            (
                            <span>{reception.car_status}</span>
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
                        <CirclePlus
                          className="text-gray-800 cursor-pointer w-5 h-5 transition-all duration-300 hover:text-gray-900 hover:scale-125 hover:rotate-12 hover:drop-shadow-lg"
                        />
                      </div>
                    </td>
                  </tr>
                  {reception.orders.map((part, j) => (
                    <tr
                      key={j}
                      className={`border-b ${
                        j % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-3 flex items-center gap-1.5 font-medium text-gray-800">
                        <PackageOpen className="w-5 h-5 text-gray-600" />
                        {part.piece_name}
                      </td>
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
                      <td className="px-4 py-3 text-center">
                        <DeleteItem
                          id={String(part.order_id)}
                          name={part.piece_name}
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
};
