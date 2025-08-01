import axios from "axios";
import { API_BASE } from "@/app/utils/baseURL";

export const login = async (formData: { code_meli: string; password: string }) => {
  const response = await axios.post(
    `${API_BASE}auth/login`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
