import { useMutation } from '@tanstack/react-query';
import { editLostItem } from '@/app/apis/lost-orders/lostOrdersService';

export const useEditLostItem = () => {
  return useMutation({
    mutationFn: ({ id, updatedData }: { id: string; updatedData: any }) =>
      editLostItem(id, updatedData),
  });
};
