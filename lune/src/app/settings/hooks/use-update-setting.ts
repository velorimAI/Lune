import { useMutation } from '@tanstack/react-query';
import { updateSettings } from '@/app/apis/setting/settingService';

export const useUpdateSetting = () => {
  return useMutation({
    mutationFn: ({updatedData }: {updatedData: any }) =>
      updateSettings(updatedData),
  });
};
