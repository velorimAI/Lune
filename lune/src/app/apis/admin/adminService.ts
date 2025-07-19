import { API_BASE } from "@/app/utils/baseURL";
import axios from "axios";

export const getUsersList = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE}admin/usersstats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const addUser = async (userData: any) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_BASE}admin/adduser`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const editUser = async (id: string, updatedData: any) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(
    `${API_BASE}admin/updateuser/${id}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const deleteUser = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_BASE}admin/deleteuser/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getLogsList = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE}admin/getlogs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const addItem = async (itemData: any) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_BASE}admin/addpart`, itemData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
