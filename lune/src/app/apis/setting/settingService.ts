import { API_BASE } from "@/app/utils/baseURL";
import axios from "axios";


export const getSettings = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found");
  }

  const response = await axios.get(`${API_BASE}setting/get-setting`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateSettings = async (settingsData: any) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found");
  }

  const response = await axios.patch(
    `${API_BASE}setting/update-setting`,
    settingsData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};