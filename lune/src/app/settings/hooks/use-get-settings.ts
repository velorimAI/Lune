import { getSettings } from "@/app/apis/setting/settingService";
import { useQuery } from "@tanstack/react-query";

export const useGetSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    staleTime: 1000 * 60 * 5, 
    retry: false,
  });
};