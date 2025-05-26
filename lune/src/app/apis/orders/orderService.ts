import axios from "axios";


export const getOrdersList = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:3001/api/orders/all", {
    headers: {
      Authorization: `${token}`,
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
        Authorization: `${token}`,
      },
    }
  );
  return response.data;
};
