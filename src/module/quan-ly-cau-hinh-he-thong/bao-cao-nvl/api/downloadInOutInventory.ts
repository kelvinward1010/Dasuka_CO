import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";

import { API_REPORT } from "@/constant/config";
import { apiClient } from "@/lib/api";

export const downloadInOutInventory = async (
  params: AxiosRequestConfig["params"],
  customer: string,
  type?: string,
) => {
  let extendedPath = "xlsx";
  const response = await apiClient.post(
    `${API_REPORT}/co-document/download-in-out-inventory-xlsx`,
    params,
    {
      responseType: "blob",
    },
  );

  if (response?.data) {
    const date = dayjs().format("YYYYMMDD_HHmmss");
    const href = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute(
      "download",
      `Bao_cao_ton_NVL_${type}_${customer}_${date}.${extendedPath}`,
    ); //or any other extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }
};
