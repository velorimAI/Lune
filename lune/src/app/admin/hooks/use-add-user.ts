import { useMutation } from "@tanstack/react-query";
import { addUser } from "@/app/apis/admin/adminService";

export const useAddUser = () => {
  return useMutation({
    mutationFn: addUser,
  });
};
