<<<<<<< HEAD
import { useForm } from "react-hook-form";
=======
import { useForm} from "react-hook-form";
>>>>>>> making-folder-for-lost-orders
import { useCustomerInputRefs } from "./useCustomerInputRefs";
import { usePartInputRefs } from "./usePartInputRefs";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAddOrder } from "./use-add-order";

<<<<<<< HEAD
import { useGetSettings } from "@/app/settings/hooks/use-get-settings";
=======
>>>>>>> making-folder-for-lost-orders

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
  // const [formKey, setFormKey] = useState(0);
  const [customerFormKey, setCustomerFormKey] = useState(0);
  const { data: settings } = useGetSettings();



  // const resetPartForm = () => {
  //   setFormKey((prev) => prev + 1);
  //   setOrderChannel("VOR");
  // };
  const resetCustomerForm = () => {
    setCustomerFormKey((prev) => prev + 1);
  };

  const [userData, setUserData] = useState<any>({});
  const [userInfoSubmitted, setUserInfoSubmitted] = useState(false);
  const { refs, clearAllFields } = useCustomerInputRefs();
  const { refs: partRefs, clearPartFields } = usePartInputRefs();
  const [orderChannel, setOrderChannel] = useState("VOR");
  const [orderGroups, setOrderGroups] = useState<OrderItem[]>([]);

  const estimatedArrivalDays = useMemo(() => {
    switch (orderChannel) {
      case "VOR":
        return settings?.vor ?? "1";
      case "VIS":
        return settings?.vis ?? "1";
      case "شارژ انبار":
        return settings?.warhouse_charge ?? "1";
      case "بازار آزاد":
        return settings?.market ?? "1";
      default:
        return "1";
    }
  }, [orderChannel, settings]);


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
      car_name: userData.car_name,
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
          clearAllFields();
          setUserInfoSubmitted(false);

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