import { useForm, UseFormReturn } from "react-hook-form";
import { useCustomerInputRefs } from "./useCustomerInputRefs";
import { usePartInputRefs } from "./usePartInputRefs";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAddOrder } from "./use-add-order";

interface ArrivalSettings {
  VIS: string;
  VOR: string;
}

interface OrderItem {
  all_description: string;
  part_id: string;
  piece_name: string;
  number_of_pieces: number;
  order_channel: string;
  market_name?: string | null;
  market_phone?: string | null;
  order_number: string;
  estimated_arrival_days: number;
  status?: string;
  settlement_status?: string;
  description?: string;
  dealer_approved?: boolean;
}

export function useOrderData() {
  const userForm = useForm();
  const { mutate, isPending } = useAddOrder();

  const [userData, setUserData] = useState<any>({});
  const [userInfoSubmitted, setUserInfoSubmitted] = useState(false);
  const { refs, clearAllFields } = useCustomerInputRefs();
  const { refs: partRefs, clearPartFields } = usePartInputRefs();

  const [orderChannel, setOrderChannel] = useState("VOR");
  const [arrivalSettings, setArrivalSettings] = useState<ArrivalSettings>({
    VIS: "10",
    VOR: "7",
  });

  const [orderGroups, setOrderGroups] = useState<OrderItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("orderSettings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.VIS && parsed?.VOR) {
          setArrivalSettings(parsed);
        }
      } catch (e) {
        console.error("تنظیمات سفارش معتبر نیست");
      }
    }
  }, []);

  const estimatedArrivalDays = useMemo(() => {
    return orderChannel === "VOR"
      ? arrivalSettings.VOR
      : orderChannel === "VIS"
        ? arrivalSettings.VIS
        : undefined;
  }, [orderChannel, arrivalSettings]);

  const handleUserData = (data: any) => {
    setUserData(data);
    setUserInfoSubmitted(true);
  };

  const handleSubmitItem = (data: any) => {
    setOrderGroups((prevData) => [...prevData, data]);
    clearPartFields();
  };

  const handleSubmit = () => {
    if (
      !userData.customer_name ||
      !userData.phone_number ||
      !userData.car_status ||
      !userData.reception_number ||
      !userData.reception_date
    ) {
      toast.error("لطفا ابتدا اطلاعات مشتری را کامل وارد کنید.");
      return;
    }

    if (orderGroups.length === 0) {
      toast.error("لطفا حداقل یک قطعه ثبت کنید.");
      return;
    }

    const payload = {
      customer_name: userData.customer_name,
      phone_number: userData.phone_number,
      car_status: userData.car_status,
      reception_number: userData.reception_number,
      reception_date: userData.reception_date,
      orders: orderGroups.map((item) => ({
        piece_name: item.piece_name,
        part_id: item.part_id,
        number_of_pieces: parseInt(item.number_of_pieces.toString(), 10),
        order_channel: item.order_channel,
        market_name:
          item.order_channel === "بازار آزاد" ? item.market_name : null,
        market_phone:
          item.order_channel === "بازار آزاد" ? item.market_phone : null,
        order_number: item.order_number,
        estimated_arrival_days: Number(item.estimated_arrival_days),
        status: item.status,
        settlement_status: item.settlement_status || "تسویه نشده",
        all_description: item.all_description || "",
        dealer_approved: !!item.dealer_approved,
      })),
    };

    mutate(
      { data: payload },
      {
        onSuccess: () => {
          toast.success("سفارش با موفقیت اضافه شد");
          setUserData({});
          setOrderGroups([]);
          setUserInfoSubmitted(false);
          clearAllFields();
        },
        onError: () => {
          toast.error("خطا در ارسال سفارش");
        },
      }
    );
  };

  return {
    userForm,
    userInfoSubmitted,
    userData,
    orderGroups,
    setOrderGroups,
    orderChannel,
    setOrderChannel,
    estimatedArrivalDays,
    handleUserData,
    handleSubmitItem,
    handleSubmit,
    isPending,
    refs,
    partRefs,
  };
}