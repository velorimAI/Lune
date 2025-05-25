import axios from "axios";

const token = localStorage.getItem("token");

export const getOrdersList = async () => {
  const res = await axios.get("http://localhost:3001/api/orders/all", {
    headers: {
      Authorization: `${token}`,
    },
  });

  return res.data;
};

export const deletePart = async (id: string) => {
  const response = await axios.delete(
    `http://localhost:3001/api/orders/delete/${id}`,
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  return response.data;
};
