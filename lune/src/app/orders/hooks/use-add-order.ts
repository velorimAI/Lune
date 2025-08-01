import {  addOrder } from "@/app/apis/orders/orderService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({data }: { data: any }) =>
            addOrder(data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.refetchQueries({ queryKey: ["orders"] });
        },
        onError: () => {
            toast.error("اضافه کردن سفارش  با خطا مواجه شد");
        },
    });
};
