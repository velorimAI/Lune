// مشخصات هر قطعه سفارش‌شده
export interface OrderItem {
  settlement_status:string;
  payment_status(payment_status: any): { color: any; icon: any; };
  arrive_length_time: string | null; // مدت زمان رسیدن
  description: string;
  market_name: string | null;
  market_phone: string | null;
  number_of_pieces: number; // تعداد
  order_channel: string; // نوع سفارش
  order_id: number;
  part_id: string;
  piece_name: string; // نام قطعه
  status: "دریافت شده" | "دریافت‌ نشده" | "ابطال شده" | "لغو شده"; // وضعیت تحویل
  order_date: string;
  estimated_arrival_days: string | null;
}

// یک پذیرش از مشتری که شامل لیست سفارشات (قطعات) است
export interface Reception {
  reception_id: number;
  reception_customer_id: number;
  reception_number: string;
  reception_order_id: number;
  reception_date: string;
  orders: OrderItem[];
}

// سفارش اصلی برای یک مشتری
export interface Order {
  parts: any;
  earliest_unreceived_estimated_arrival_date: string;
  customer_id: number;
  customer_name: string;
  customer_last_name?: string;
  customer_phone: string;
  car_status?: string;
  settlement_status_overall: "تسویه شده" | "تسویه‌ نشده";
  latest_unreceived_estimated_arrival_date: string | null;
  receptions: Reception[];
}

// پراپز کامپوننت
export interface OrdersListProps {
  refetch : () => void;
  data: Order[];
  currentTab : string;
}
// هر قطعه‌ای که در یک پذیرش وجود داره
export interface OrderItem {
  arrive_length_time: string | null;
  description: string;
  market_name: string | null;
  market_phone: string | null;
  number_of_pieces: number;
  order_channel: string;
  order_id: number;
  part_id: string;
  piece_name: string;
  status: "دریافت شده" | "دریافت‌ نشده" | "ابطال شده" | "لغو شده";
  order_date: string;
  estimated_arrival_days: string | null;
}

// یک پذیرش از مشتری (ممکنه چند تا سفارش داشته باشه)
export interface Reception {
  reception_id: number;
  reception_customer_id: number;
  reception_number: string;
  reception_order_id: number;
  reception_date: string;
  orders: OrderItem[];
}

// سفارش کلی مشتری
export interface Order {
  customer_id: number;
  customer_name: string;
  customer_last_name?: string;
  customer_phone: string;
  car_status?: string;
  settlement_status_overall: "تسویه شده" | "تسویه نشده";
  latest_unreceived_estimated_arrival_date: string | null;
  receptions: Reception[];
}

// پراپ‌های کامپوننت
export interface OrdersListProps {
  data: Order[];
}
