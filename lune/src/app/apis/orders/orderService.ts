import axios from "axios";


export const getOrdersList = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:3001/api/orders/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deletePart = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(
    `http://localhost:3001/api/orders/deleteorder/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteOrder = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(
    `http://localhost:3001/api/orders/deletecustomer/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const editOrder = async (id: string, updatedData: any) => {
  const token = localStorage.getItem("token");

  const response = await axios.patch(
    `http://localhost:3001/api/orders/edit/${id}`,
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

export const addItem = async (id: number, formData: any) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `http://localhost:3001/api/orders/add-pieces-to-customer/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

