// "use client";

// import { FC, useState } from "react";
// import { OrdersList } from "./components/orders-list";
// import { mockOrders } from "@/mock/ordersListData";
// import { useStaticSearchDevices } from "./hooks/use-static-search-devices";
// import { SearchBox } from "../components/table/search-box";
// import { Card } from "../components/card";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { CirclePlus, Trash2 } from "lucide-react";
// import { Modal } from "../components/modal";
// import { Form } from "../components/custom-form/form";
// import { Input } from "../components/custom-form/input";
// import { Select } from "../components/custom-form/select-box";

// const sortOptions = [
//   { value: "default", label: "مرتب‌سازی پیش‌فرض" },
//   { value: "name", label: "مرتب‌سازی بر اساس نام" },
//   { value: "receptionDate", label: "مرتب‌سازی بر اساس تاریخ پذیرش" },
// ];

// const Orders: FC = () => {
//   const [searchText, setSearchText] = useState<string>("");
//   const [open, setOpen] = useState(false);
//   const [orders, setOrders] = useState(mockOrders);
//   const [sortBy, setSortBy] = useState<string>("default");

//   const [parts, setParts] = useState([{ name: "", quantity: 1 }]);

//   const filteredDataList = useStaticSearchDevices(orders || [], searchText);

//   const handleSearch = (value?: string) => {
//     setSearchText(value || "");
//   };

//   const sortedOrders = [...filteredDataList].sort((a, b) => {
//     if (sortBy === "name") {
//       return a.name.localeCompare(b.name);
//     } else if (sortBy === "receptionDate") {
//       return (
//         new Date(b.receptionDate).getTime() -
//         new Date(a.receptionDate).getTime()
//       );
//     }
//     return 0;
//   });

//   const handleOpen = (e?: React.MouseEvent) => {
//     e?.stopPropagation?.();
//     setOpen(true);
//   };

//   const handlePartChange = (
//     index: number,
//     field: string,
//     value: string | number
//   ) => {
//     const updated = [...parts];
//     updated[index][field] = value;
//     setParts(updated);
//   };

//   const addPart = () => {
//     setParts([...parts, { name: "", quantity: 1 }]);
//   };

//   const removePart = (index: number) => {
//     const updated = [...parts];
//     updated.splice(index, 1);
//     setParts(updated);
//   };

//   const handleSubmit = (data: any) => {
//     const newOrder = {
//       id: Date.now(), // یا UUID
//       ...data,
//     };
//     setOrders([newOrder, ...orders]);
//     setOpen(false);
//   };

//   return (
//     <>
//       <Card title="سفارش ها">
//         <div className="flex items-center gap-4 w-full max-w-[600px]">
//           <div className="w-[300px]">
//             <SearchBox onSearch={handleSearch} />
//           </div>
//           <Select
//             value={sortBy}
//             onChange={(selected) => setSortBy(selected?.value || "default")}
//             options={sortOptions}
//           />
//           {/* <option value="default">مرتب‌سازی پیش‌فرض</option>
//             <option value="name">مرتب‌سازی بر اساس نام</option>
//             <option value="receptionDate">مرتب‌سازی بر اساس تاریخ پذیرش</option> */}
//         </div>
//         <ScrollArea className="w-full flex flex-col justify-start items-center pr-3 h-[73vh] 4xl:h-[80vh]">
//           <div dir="rtl">
//             <OrdersList data={sortedOrders || []} />
//           </div>
//           <div className="fixed left-10 bottom-[55px]">
//             <CirclePlus
//               className="w-[30px] h-[30px] cursor-pointer"
//               onClick={handleOpen}
//             />
//           </div>
//           <ScrollBar />
//         </ScrollArea>
//       </Card>

//       <Modal
//         open={open}
//         title="افزودن سفارش جدید"
//         onCancel={() => setOpen(false)}
//         onConfirm={undefined}
//         cancelText="لفو"
//         confirmText="اضافه"
//       >
//         <Form
//           onSubmit={handleSubmit}
//           submitText="ثبت"
//           cancelText="انصراف"
//           cancelHide
//           submitHide
//         >
//           <div className="flex gap-6 w-full">
//             <div className="w-full">
//               <Input
//                 label="نام"
//                 name="name"
//                 placeholder="نام را وارد کنید :"
//                 className="w-full"
//                 required
//               />
//               <Input
//                 label="نام خانوادگی"
//                 name="lastname"
//                 placeholder="نام خانوادگی را وارد کنید :"
//                 className="w-full"
//                 required
//               />
//               <Input
//                 label="شماره تماس"
//                 name="phone"
//                 placeholder="******0912"
//                 className="w-full"
//                 required
//               />
//               <Input
//                 label="شماره پذیرش:"
//                 name="receptionNumber"
//                 placeholder="******"
//                 className="w-full"
//                 required
//               />
//               <Input
//                 label="تاریخ پذیرش:"
//                 name="receptionDate"
//                 placeholder="1404/01/01"
//                 className="w-full"
//                 required
//               />
//               <Input
//                 label="تاریخ سفارش"
//                 name="orderDate"
//                 placeholder="مثلاً: 1404/2/5"
//                 className="w-full"
//               />
//               <Input
//                 label="شماره سفارش"
//                 name="orderNumber"
//                 placeholder="********"
//                 className="w-full"
//               />
//             </div>

//             {/* بخش قطعات */}
//             <div>
//               <h4 className="text-sm font-bol mb-2 text-right">قطعات</h4>
//               {parts.map((part, index) => (
//                 <div
//                   key={index}
//                   className="grid grid-cols-12 gap-2 items-end mb-2"
//                 >
//                   <div className="col-span-6">
//                     <Input
//                       label="نام قطعه"
//                       value={part.name}
//                       onChange={(e) =>
//                         handlePartChange(index, "name", e.target.value)
//                       }
//                     />
//                   </div>
//                   <div className="col-span-4">
//                     <Input
//                       label="تعداد"
//                       type="number"
//                       value={String(part.quantity)}
//                       onChange={(e) =>
//                         handlePartChange(
//                           index,
//                           "quantity",
//                           Number(e.target.value)
//                         )
//                       }
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <button
//                       type="button"
//                       onClick={() => removePart(index)}
//                       className="p-2 text-red-500 hover:text-red-700"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={addPart}
//                 className="text-blue-600 text-xs hover:underline"
//               >
//                 + افزودن قطعه جدید
//               </button>
//             </div>
//           </div>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// export default Orders;
