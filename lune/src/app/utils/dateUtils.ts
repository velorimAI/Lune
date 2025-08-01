import { format } from "date-fns-jalali";

export const convertToJalali = (date: Date): string => {
  return format(date, "yyyy/MM/dd");
};
