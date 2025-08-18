import apiClient from "@/app/utils/apiClient";


export const getSubscription = async () => {
  const res = await apiClient.get("dealers/get-subscription");
  return res.data;
};
