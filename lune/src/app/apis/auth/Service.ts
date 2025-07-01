import axios from "axios";

export const login = async (formData: { code_meli: string; password: string }) => {
  const response = await axios.post(
    "http://localhost:3001/api/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
