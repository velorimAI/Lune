import { Trash2 } from "lucide-react";

interface PartItem {
  part_id: string;
  piece_name: string;
  number_of_pieces: number;
  order_channel: string;
  order_number: string;
}

interface ItemsListProp {
  data: PartItem[];
  onDelete?: (index: number) => void;
}

export const ItemList = ({ data, onDelete } : ItemsListProp) => {
  return (
    <div className="space-y-3">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 bg-gray-50 border border-gray-200 rounded-xl">
          <h3 className="text-lg font-medium text-gray-500">
            هیچ قطعه‌ای ثبت نشده است
          </h3>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm h-[400px] overflow-y-auto">
          
          <div className="grid grid-cols-6 bg-gray-100 px-4 py-3 text-xs font-medium text-gray-600 border-b border-gray-200 sticky top-0 z-10">
            <div className="text-center">کد فنی</div>
            <div className="text-center">نام قطعه</div>
            <div className="text-center">تعداد</div>
            <div className="text-center">کانال سفارش</div>
            <div className="text-center">شماره سفارش</div>
            <div className="text-center">عملیات</div>
          </div>
          
         
          <div className="divide-y divide-gray-100">
            {data.map((item, index) => (
              <div 
                key={index} 
                className="grid grid-cols-6 px-4 py-3 text-sm items-center hover:bg-gray-50 transition-colors"
              >
                <div className="text-center text-gray-800 font-medium">
                  {item.part_id}
                </div>
                <div className="text-center text-gray-600">
                  {item.piece_name}
                </div>
                <div className="text-center text-gray-600">
                  {item.number_of_pieces.toLocaleString()}
                </div>
                <div className="text-center text-gray-600">
                  {item.order_channel}
                </div>
                <div className="text-center text-gray-600">
                  {item.order_number}
                </div>
                <div className="flex justify-center">
                  <button 
                    onClick={() => onDelete?.(index)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                    aria-label="حذف قطعه"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};