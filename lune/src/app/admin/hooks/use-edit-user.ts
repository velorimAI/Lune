import { useMutation } from '@tanstack/react-query';
import { editUser } from '@/app/apis/admin/adminService';


export const useEditUser = () => {
  return useMutation({
    mutationFn: ({ id, updatedData }: { id: string; updatedData: any }) =>
      editUser(id, updatedData),
  });
};
