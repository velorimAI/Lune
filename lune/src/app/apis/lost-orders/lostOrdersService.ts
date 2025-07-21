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

export const editLostItem = async (id: string, updatedData: any) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(
    `${API_BASE}orders/update-lost-order/${id}`,
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

export const deleteLostItem = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_BASE}orders/delete-lost-order/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const downloadLostOrdersReport = async (
  format: 'excel' | 'csv',
  fromDate: string,
  toDate: string
) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(
    `${API_BASE}reports/lost-orders-report?format=${format}&from_date=${fromDate}&to_date=${toDate}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    }
  );

  const fileExtension = format === 'excel' ? 'xlsx' : 'csv';
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `lost-orders-report.${fileExtension}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
