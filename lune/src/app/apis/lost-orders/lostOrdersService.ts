import { API_BASE } from "@/app/utils/baseURL";
import axios from "axios";

export const getLostItemsList = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE}orders/getlostorders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const addLostItem = async (Data: any) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_BASE}orders/addlostorder`, Data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
