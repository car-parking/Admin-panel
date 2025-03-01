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

  // Response interceptor qo'shamiz
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // 401 xatolik tekshiruvi
      if (error.response?.status === 401) {
        localStorage.removeItem("token"); // Tokenni o'chiramiz
        window.location.href = "/login"; // Login sahifasiga yo'naltiramiz
      }
      return Promise.reject(error);
    }
  );

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
