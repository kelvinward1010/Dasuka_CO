import { nanoid } from "@ant-design/pro-components";
import dayjs from "dayjs";

import { API_DOWNLOAD } from "@/constant/config";
import { apiClient } from "@/lib/api";

export const BASE_HTTP_URL_DOWNLOAD =
  import.meta.env.VITE_GATEWAY_URL + "/api-report/co-document";

export const downloadFile = async (filePath: string, fileName: string) => {
  let extendedPath = "pdf";
  if (fileName)
    extendedPath = fileName.split(".")[fileName.split(".").length - 1];
  const response = await apiClient.post(
    `${API_DOWNLOAD}/download`,
    {
      filePath,
    },
    {
      responseType: "blob",
    },
  );

  if (response?.data) {
    const href = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute(
      "download",
      `file-recently-download-${nanoid()}.${extendedPath}`,
    ); //or any other extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }
};

export const mergePdfAndDownload = async ({
  files,
  external = "pdf",
}: {
  files: string[];
  external: string;
}) => {
  const response = await apiClient.post(
    `${API_DOWNLOAD}/merge-pdf`,
    {
      files,
    },
    {
      responseType: "blob",
    },
  );

  if (response?.data) {
    const href = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", `VAT-merged-${nanoid()}.${external}`); //or any other extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }
};

export const downloadArchiveFiles = (data: any): Promise<any> => {
  return apiClient
    .post(`${API_DOWNLOAD}/archiver`, data, {
      responseType: "blob",
    })
    .then((response) => {
      if (response?.data) {
        const date = dayjs().format("YYYYMMDD_HHmmss");
        const href = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", `BoTaiLieuCO_${date}.zip`); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      }
    });
};

export const deleteFile = (path: string) => {
  return apiClient
    .post(`${API_DOWNLOAD}/delete-file`, {
      filePath: path,
    })
    .then((response) => {
      return response.data;
    });
};
