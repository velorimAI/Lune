// hooks/useDeletePart.ts
import { deletePart } from "@/app/apis/orders/orderService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeletePart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePart(id),
    onSuccess: (_, id) => {
      toast.success(`قطعه با شناسه "${id}" با موفقیت حذف شد`, {
        action: {
          label: "بستن",
          onClick: () => {},
        },
      });

      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.refetchQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      toast.error("حذف قطعه با خطا مواجه شد");
    },
  });
};
