import apiClient from "@/app/utils/apiClient";

export const login = async (formData: { code_meli: string; password: string }) => {
  const response = await apiClient.post(
    `auth/login`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
