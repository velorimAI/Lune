import apiClient from "@/app/utils/apiClient";


export const getUsersList = async () => {
  const res = await apiClient.get("admin/usersstats");
  return res.data;
};

export const addUser = async (userData: any) => {
  const response = await apiClient.post("admin/adduser", userData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const editUser = async (id: string, updatedData: any) => {
  const response = await apiClient.patch(`admin/updateuser/${id}`, updatedData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await apiClient.delete(`admin/deleteuser/${id}`);
  return response.data;
};

export const getLogsList = async () => {
  const res = await apiClient.get("admin/getlogs");
  return res.data;
};

export const addItem = async (itemData: any) => {
  const response = await apiClient.post("admin/addpart", itemData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};
