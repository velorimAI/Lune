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


export const getItemsList = async (token: string) => {
  try {
    const res = await axios.get("http://localhost:3001/api/orders/all-pieces", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if response status is not 200
    if (res.status !== 200) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    return res.data;
  } catch (error) {
    // Re-throw error with more context
    throw new Error(`Failed to fetch items:`);
  }
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

export const addOrder = async (formData: any) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `http://localhost:3001/api/orders/add`,
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
