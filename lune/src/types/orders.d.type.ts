interface OrderItem {
  arrive_length_time: string | null;
  description: string;
  market_name: string | null;
  market_phone: string | null;
  number_of_pieces: number;
  order_channel: string;
  order_id: number;
  part_id: string;
  piece_name: string;
  status: string;
}

// interface OrderPart {
//   partName: String;
//   orderType: "VIS" | "VOR";
//   quantity: number;
//   deliveryStatus: "رسیده" | "نرسیده";
// }

interface Order {
  [x: string]: string;
  customer_name: string;
  customer_last_name: string;
  customer_phone: string;
  reception_date: string;
  prediction_delivery_date: string;
  reception_number: string;
  settlement_status: any;
  orders: OrderPart[];
}

// interface Order {
//   fullName: string;
//   phone: string;
//   orderDate: string;
//   deliveryDate: string;
//   orderNumber: string;
//   status: "تسویه نشده" | "تسویه شده";
//   items: OrderPart[];
// }

interface OrdersListProps {
  data: Order[];
}
