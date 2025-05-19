interface OrderPart {
  partName: String;
  orderType: "VIS" | "VOR";
  quantity: number;
  deliveryStatus: "رسیده" | "نرسیده";
}

interface Order {
  fullName: string;
  phone: string;
  orderDate: string;
  deliveryDate: string;
  orderNumber: string;
  status: "تسویه نشده" | "تسویه شده";
  items: OrderPart[];
}

interface OrdersListProps {
  data: Order[];
}