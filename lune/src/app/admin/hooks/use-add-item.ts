import { useMutation } from "@tanstack/react-query";
import { addItem} from "@/app/apis/admin/adminService";

export const useAddItem = () => {
  return useMutation({
    mutationFn: addItem,
  });
};
