// import { Input } from "@/app/components/custom-form/input";
// import { useState } from "react";

// export const OrdersDynamicForm = () => {
//   return (
//     <div className="flex flex-col gap-4">
//       {items.map((item, index) => (
//         <div key={item.id} className="border p-4 rounded-md space-y-2 relative">
//           <h4 className="font-semibold">سفارش {index + 1}</h4>

//           {/* piece_info */}
//           <div className="grid grid-cols-3 gap-4">
//             <Input
//               name={`orders[${index}].piece_name`}
//               label="نام قطعه"
//               required
//             />
//             <Input name={`orders[${index}].part_id`} label="کد قطعه" required />
//             <Input
//               name={`orders[${index}].number_of_pieces`}
//               label="تعداد"
//               required
//               type="number"
//             />
//           </div>

//           {/* source */}
//           <div className="grid grid-cols-3 gap-4">
//             <Input
//               name={`orders[${index}].order_channel`}
//               label="کانال سفارش"
//               required
//             />
//             <Input name={`orders[${index}].market_name`} label="نام بازار" />
//             <Input name={`orders[${index}].market_phone`} label="شماره بازار" />
//           </div>

//           {/* dates */}
//           <div className="grid grid-cols-4 gap-4">
//             <Input
//               name={`orders[${index}].order_date`}
//               label="تاریخ سفارش"
//               required
//             />
//             <Input
//               name={`orders[${index}].prediction_delivery_date`}
//               label="تاریخ تحویل"
//             />
//             <Input
//               name={`orders[${index}].delivery_date`}
//               label="تاریخ تحویل واقعی"
//             />
//             <Input
//               name={`orders[${index}].arrive_length_time`}
//               label="مدت زمان رسیدن"
//             />
//           </div>

//           {/* status */}
//           <div className="grid grid-cols-2 gap-4">
//             <Input
//               name={`orders[${index}].status`}
//               label="وضعیت دریافت"
//               required
//             />
//             <Input
//               name={`orders[${index}].settlement_status`}
//               label="وضعیت تسویه"
//               required
//             />
//           </div>

//           <Input name={`orders[${index}].description`} label="توضیحات" />
//         </div>
//       ))}

//       <button
//         type="button"
//         onClick={handleAddItem}
//         className="w-fit text-primary mt-2 border border-primary px-4 py-1 rounded hover:bg-primary hover:text-white transition"
//       >
//         افزودن سفارش جدید +
//       </button>
//     </div>
//   );
// };
