export const getConfirmMessage = (status: string): string => {
  switch (status) {
    case "در انتظار تائید شرکت":
      return "تایید شرکت شد.";
    case "در انتظار تائید حسابداری":
      return " توسط حسابدار پرداخت شد.";
    case "در انتظار دریافت":
      return " دریافت شد.";
    case "دریافت شد":
      return "دریافت شد.";
    case "در انتظار نوبت دهی":
      return "نوبت‌دهی شد.";
    case "نوبت داده شد":
      return "نوبت‌دهی شد .";
    default:
      return "تأیید مرحلهٔ فعلی انجام شد.";
  }
};


export const getCancelMessage = (status: string): string => {
  switch (status) {
    case "در انتظار تائید شرکت":
    case "در انتظار تائید حسابداری":
    case "در انتظار دریافت":
    case "دریافت شد":
    case "در انتظار نوبت دهی":
    case "نوبت داده شد":
      return "با کلیک، این سفارش لغو خواهد شد.";
    default:
      return "سفارش لغو شد.";
  }
};
