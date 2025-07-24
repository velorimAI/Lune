import { deleteLostItem } from "@/app/apis/lost-orders/lostOrdersService";
import { useMutation } from "@tanstack/react-query";

export const useDeleteLostItem = () => {
  return useMutation({
    mutationFn:  (id: string) => deleteLostItem(id),
  });
};
