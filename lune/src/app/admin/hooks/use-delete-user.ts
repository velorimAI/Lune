import { deleteUser } from "@/app/apis/admin/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.refetchQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      toast.error("حذف کاربر با خطا مواجه شد");
    },
  });
};
