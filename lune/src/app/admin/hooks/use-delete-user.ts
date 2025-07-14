import { deleteUser } from "@/app/apis/admin/adminService";
import { useMutation } from "@tanstack/react-query";

export const useDeleteUser = () => {
  return useMutation({
    mutationFn:  (id: string) => deleteUser(id),
  });
};
