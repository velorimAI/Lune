import { editOrder } from "@/app/apis/orders/orderService";
import { useMutation } from "@tanstack/react-query";

export const useUpdatePart = () => {
  return useMutation({
    mutationFn: ({ id, updatedData }: { id: string; updatedData: any }) =>
      editOrder(id, updatedData),
  });
};
