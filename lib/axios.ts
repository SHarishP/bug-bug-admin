import axios from "axios";
import { useOrigin } from "@/hooks/use-origin";
import { getCookie } from "cookies-next";

const origin = useOrigin();
const axiosInstance = axios.create({
  baseURL: origin,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getCookie("access_token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
