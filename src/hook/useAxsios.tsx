import axios, { AxiosRequestConfig, Method } from "axios";

interface RequestOptions {
  url: string;
  method?: Method;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export const useAxios = () => {
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "uz",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const response = async ({ url, method = "GET", body, headers, params }: RequestOptions) => {
    try {
      const config: AxiosRequestConfig = {
        url,
        method,
        data: body,
        headers: { ...headers },
        params: { ...params },
      };
      const res = await axiosInstance(config);
      return res.data;
    } catch (err) {
      console.error("Xatolik yuz berdi:", err);
      throw err;
    }
  };

  return response;
};
