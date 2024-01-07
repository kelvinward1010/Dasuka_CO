import axios from "axios";

import { BASE_URL, LOCAL_USER } from "@/constant/config";
import storage, { storageService } from "@/utils/storage";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 1000 * 60 * 30 * 3, // 90 minutes
});

apiClient.interceptors.request.use(
  function (config) {
    config.headers.Authorization = "Bearer " + storage.getToken();
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  function (response) {
    if (response.data?.results === false) {
      throw new Error(response.data.message);
    }

    return response;
  },
  function (error) {
    // Drunk code here. Will fix after has refresh token api 👀
    if (error?.response?.status === 401) {
      storage.clearToken();
      storageService.clearStorage(LOCAL_USER);
      if (error.response?.data?.message !== "Sai mật tài khoản hoặc mật khẩu")
        window.open("/login", "_parent");
    }
    return Promise.reject(error);
  },
);

export const filterEmptyString = (params: Record<string, any>) => {
  const result: Record<string, any> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "") {
      result[key] = value;
    }
  });

  return result;
};
