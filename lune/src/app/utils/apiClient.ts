import axios from "axios";
import { API_BASE } from "@/app/utils/baseURL";
import { getToken } from "./tokenService";

const apiClient = axios.create({
  baseURL: API_BASE,
});


apiClient.interceptors.request.use(
  (config) => {
    const token = getToken(); 
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
