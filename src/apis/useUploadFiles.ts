import { useMutation } from "react-query";

import { API_DOWNLOAD } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export const uploadFiles = async (data: FormData): Promise<any> => {
  return apiClient
    .post(`${API_DOWNLOAD}/upload-multi`, data, {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data;",
      },
    })
    .then((res) => {
      if (res.data.message && res.data.message !== "") {
        throw new Error(res.data.message);
      } else {
        return res.data;
      }
    });
};

type UseUploadFilesOptions = {
  config?: MutationConfig<typeof uploadFiles>;
};

export const useUploadFiles = ({ config }: UseUploadFilesOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: uploadFiles,
  });
};
