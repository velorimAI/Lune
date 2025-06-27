import { FC } from "react";
import { Trash2 } from "lucide-react";

interface ItemsListProp {
  data: any[];
  onDelete?: (index: number) => void;
}

export const ItemList: FC<ItemsListProp> = ({ data , onDelete }) => {
  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 bg-white border border-gray-200 rounded-3xl shadow-xl h-full">
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            قطعه ای ثبت نشده
          </h3>
        </div>
      ) : (
        data?.map((item, index) => {
          return (
            <div key={index} className="space-y-2">
              <div className="grid grid-cols-6 bg-gray-50 shadow-sm px-4 py-3 text-xs w-full border border-gray-300 rounded-lg items-center gap-1 text-center">
                <div className="flex items-center gap-1.5 text-gray-800">
                  <p className="font-bold md:text-[12px]">کد فنی :</p>
                  <span>{item?.part_id}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-800">
                  <p className="font-bold md:text-[12px]">نام قطعه :</p>
                  <span>{item?.piece_name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-800">
                  <p className="font-bold md:text-[12px]">تعداد :</p>
                  <span>{item?.number_of_pieces}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-800">
                  <p className="font-bold md:text-[12px]">کانال سفارش :</p>
                  <span>{item?.order_channel}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-800">
                  <p className="font-bold md:text-[12px]">شماره سفارش :</p>
                  <span>{item?.order_number}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Trash2
                    size={18}
                    className="text-red-500 cursor-pointer hover:text-red-700 transition"
                    onClick={() => onDelete?.(index)}
                  />
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
