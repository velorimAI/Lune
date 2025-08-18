import apiClient from "@/app/utils/apiClient";

export const getSettings = async () => {
  const response = await apiClient.get("setting/get-setting");
  return response.data;
};

export const updateSettings = async (settingsData: any) => {
  const response = await apiClient.post("setting/update-setting", settingsData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
