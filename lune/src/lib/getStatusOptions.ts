export const getStatusOptions = (status: string, order_channel: string, car_status: string) => {
  if (status === "در انتظار تائید شرکت" && order_channel !== "بازار آزاد") {
    return [
      { label: "تائید شرکت شد", value: "در انتظار تائید حسابداری" },
      { label: "لغو توسط شرکت", value: "لغو توسط شرکت" },
    ];
  } else if (status === "در انتظار تائید شرکت" && order_channel === "بازار آزاد") {
    return [{ label: "تائید بازار آزاد", value: "در انتظار تائید حسابداری" }];
  } else if (status === "در انتظار تائید حسابداری") {
    return [
      { label: "تسویه شد", value: "در انتظار دریافت" },
      { label: "عدم پرداخت حسابداری", value: "عدم پرداخت حسابداری" },
    ];
  } else if (status === "در انتظار دریافت") {
    return [
      {
        label: "دریافت شد",
        value: car_status === "متوقع" ? "در انتظار نوبت دهی" : "دریافت شد",
      },
      { label: "عدم دریافت", value: "عدم دریافت" },
    ];
  } else if (status === "دریافت شد") {
    return [{ label: "تحویل شد", value: "تحویل شد" }];
  } else if (status === "در انتظار نوبت دهی") {
    return [
      { label: "نوبت داده شد", value: "نوبت داده شد" },
      { label: "انصراف مشتری", value: "انصراف مشتری" },
    ];
  } else {
    return [];
  }
};
