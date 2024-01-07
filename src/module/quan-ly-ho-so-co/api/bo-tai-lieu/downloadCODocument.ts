import { nanoid } from "@ant-design/pro-components";
import dayjs from "dayjs";

import { API_REPORT } from "@/constant/config";
import { apiClient } from "@/lib/api";

interface IDownloadProps {
  co_document_id: string;
  expandedNameFile: string;
  user_id: string;
}

export const downloadImportCODocument = async (
  data: IDownloadProps,
): Promise<any> => {
  return apiClient
    .get(
      `${API_REPORT}/co-document/export-codocument-importdeclaration/${data.user_id}/${data.co_document_id}`,
      {
        responseType: "blob",
        // baseURL: import.meta.env.VITE_GATEWAY_URL,
      },
    )
    .then((response) => {
      if (response?.data) {
        const href = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute(
          "download",
          `TKNK-${nanoid()}.${data.expandedNameFile}`,
        ); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      }
    });
};

export const downloadExportCODocument = async (
  data: IDownloadProps,
): Promise<any> => {
  return apiClient
    .get(
      `${API_REPORT}/co-document/export-codocument-exportdeclaration/${data.user_id}/${data.co_document_id}`,
      {
        responseType: "blob",
      },
    )
    .then((response) => {
      if (response?.data) {
        const href = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute(
          "download",
          `TKXK-${nanoid()}.${data.expandedNameFile}`,
        ); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      }
    });
};

export const downloadFormExplanation = async (
  co_document_id: string,
): Promise<any> => {
  return apiClient
    .get(
      `${API_REPORT}/co-document/export-codocument-explanation/${co_document_id}`,
      {
        responseType: "blob",
      },
    )
    .then((response) => {
      if (response?.data) {
        const nameExtended = dayjs().format("YYYYMMDD_HHmmss");
        const href = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", `Form_giai_trinh_${nameExtended}.xlsx`); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      }
    });
};

export const checkApi = async (url: string) => {
  return apiClient.get(url, {
    responseType: "blob",
  });
};
