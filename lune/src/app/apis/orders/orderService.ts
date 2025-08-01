import apiClient from "@/app/utils/apiClient";


export const getOrdersList = async () => {
  const res = await apiClient.get("orders/all");
  return res.data;
};

export const getItemsList = async () => {
  const res = await apiClient.get("orders/all-pieces");

  if (res.status !== 200) {
    throw new Error(`API request failed with status ${res.status}`);
  }
  return res.data;
};

export const deletePart = async (id: string) => {
  const response = await apiClient.delete(`orders/deleteorder/${id}`);
  return response.data;
};

export const deleteOrder = async (id: string) => {
  const response = await apiClient.delete(`orders/deletecustomer/${id}`);
  return response.data;
};

export const editOrder = async (id: string, updatedData: any) => {
  const response = await apiClient.patch(`orders/edit/${id}`, updatedData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const addItem = async (id: number, formData: any) => {
  const response = await apiClient.post(`orders/add-pieces-to-customer/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const addOrder = async (formData: any) => {
  const response = await apiClient.post(`orders/add`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const addItemToReception = async (receptionId: number, formData: any) => {
  const response = await apiClient.post(
    `orders/add-pieces-to-reception/${receptionId}`,
    { orders: formData.orders },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
