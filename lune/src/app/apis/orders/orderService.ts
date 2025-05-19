import axios from 'axios';

export const getOrdersList = async () => {
  const token = localStorage.getItem("token"); 
  const res = await axios.get('http://localhost:3001/api/orders/all', {
    headers: {
      Authorization: `${token}`,
    },
  });

  return res.data;
};
