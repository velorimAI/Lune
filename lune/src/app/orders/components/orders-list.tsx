import { FC } from "react";
import { Info } from 'lucide-react';


export const OrdersList :FC = ()=>{
    return(
        <div className="flex bg-white shadow-2xl gap-5 px-2 py-1">
            <div>نام و نام خانوادگی : مبین خراسانی</div>
            <div>شماره تلفن : 09960028362</div>
            <div>تاریخ سفارش : 1404/2/5</div>
            <div>تاریخ تحویل : 1404/2/10</div>
            <div>شماره پذیرش : 923243346</div>
            <div>وضعیت : <span  className="text-red-500">تسویه نشده</span></div>
            <Info />
        </div>
    )
}