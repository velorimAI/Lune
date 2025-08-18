import { addLostItem } from "@/app/apis/lost-orders/lostOrdersService";
import { useMutation } from "@tanstack/react-query";


export const useAddLostItem = () => {
  return useMutation({
    mutationFn: addLostItem,
  });
};
