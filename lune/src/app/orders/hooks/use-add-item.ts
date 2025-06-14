import { addItem, deleteOrder } from "@/app/apis/orders/orderService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            addItem(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.refetchQueries({ queryKey: ["orders"] });
        },
        onError: () => {
            toast.error("اضافه کردن قطعه با خطا مواجه شد");
        },
    });
};
