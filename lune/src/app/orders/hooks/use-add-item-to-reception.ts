import { addItemToReception } from "@/app/apis/orders/orderService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddItemToReception = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      addItemToReception(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.refetchQueries({ queryKey: ["orders"] });
      toast.success("قطعه با موفقیت اضافه شد");
    },

    onError: () => {
      toast.error("اضافه کردن قطعه به پذیرش با خطا مواجه شد");
    },
  });
};
