export interface OrderItem {
  settlement_status: string;
  payment_status: string; 
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

export interface Reception {
  reception_id: number;
  reception_customer_id: number;
  reception_number: string;
  reception_order_id: number;
  reception_date: string;
  orders: OrderItem[];
}

export interface Order {
  parts: OrderItem[]; 
  earliest_unreceived_estimated_arrival_date: string;
  customer_id: number;
  customer_name: string;
  customer_last_name?: string;
  customer_phone: string;
  car_status?: string;
  settlement_status_overall: "تسویه شده" | "تسویه نشده";
  latest_unreceived_estimated_arrival_date: string | null;
  receptions: Reception[];
}

export interface OrdersListProps {
  refetch: () => void;
  data: Order[];
  currentTab: string;
  role: string | null;
}
