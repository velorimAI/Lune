"use client";

import { useState } from "react";
import { MessageCircleMore, CirclePlus } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SearchBox } from "@/app/components/table/search-box";
import { Input } from "@/components/ui/input"; // Input اختصاصی خودت
import { Button } from "../components/button";

export default function MyCustomPage() {
  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState("all");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    count: "",
    usage: "",
    datetime: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 relative">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row gap-4 max-w-md">
          <SearchBox
            searchText={searchText}
            setSearchText={setSearchText}
            searchField={searchField}
            setSearchField={setSearchField}
            className="flex-1"
          />
        </div>

       
        <ScrollArea className="w-full pr-3 max-h-[55vh] overflow-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full bg-white rounded-md overflow-hidden" dir="rtl">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-4 text-right font-medium text-gray-700">نام قطعه</th>
                <th className="p-4 text-right font-medium text-gray-700">کد فنی</th>
                <th className="p-4 text-right font-medium text-gray-700">تعداد</th>
                <th className="p-4 text-right font-medium text-gray-700">کاربرد</th>
                <th className="p-4 text-center font-medium text-gray-700">تاریخ و ساعت</th>
                <th className="p-4 text-center font-medium text-gray-700"></th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4">برد تغذیه</td>
                <td className="p-4 font-mono text-gray-700">PSU-2098</td>
                <td className="p-4">3</td>
                <td className="p-4">تعمیر منبع تغذیه</td>
                <td className="p-4 text-center">1403/04/24 - 15:30</td>
                <td className="p-4 text-center">
                  <MessageCircleMore className="mx-auto text-gray-600 hover:text-gray-800 cursor-pointer" />
                </td>
              </tr>
            </tbody>
          </table>
          <ScrollBar />
        </ScrollArea>
      </div>

   
      <div className="fixed bottom-6 left-6 z-50">
        <CirclePlus
          className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => setShowForm(true)}
        />
      </div>

      
      {showForm && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-md p-6 w-[90%] max-w-md space-y-4" dir="rtl">
            <h2 className="text-lg font-semibold text-gray-800 text-center">افزودن قطعه جدید</h2>

            <Input
              name="name"
              placeholder="نام قطعه"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              name="code"
              placeholder="کد فنی"
              value={formData.code}
              onChange={handleChange}
            />
            <Input
              name="count"
              placeholder="تعداد"
              type="number"
              value={formData.count}
              onChange={handleChange}
            />
            <Input
              name="usage"
              placeholder="کاربرد"
              value={formData.usage}
              onChange={handleChange}
            />
            <Input
              name="datetime"
              placeholder="تاریخ و ساعت"
              value={formData.datetime}
              onChange={handleChange}
            />

            <div className="flex justify-between pt-2">
              <Button
                onClick={() => setShowForm(false)}
                className="text-sm text-gray-500 hover:text-red-600 transition"
              >
                بستن
              </Button>
              <Button
                className="text-sm text-gray-700 font-medium hover:text-green-600 transition"
                onClick={() => {
                
                  console.log("Form submitted:", formData);
                  setShowForm(false);
                }}
              >
                ذخیره
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
