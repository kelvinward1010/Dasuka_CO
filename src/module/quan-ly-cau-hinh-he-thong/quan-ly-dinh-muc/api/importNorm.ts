import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export type ImportNormDTO = any;

export const importNorm = async (
  data: ImportNormDTO,
): Promise<{
  added_norms: {
    norm_id: string;
    norm_name: string;
    file: string;
  }[];
  overwritten_norms: {
    norm_id: string;
    norm_name: string;
    file: string;
  }[];
  existing_norms: {
    norm_id: string;
    norm_name: string;
    file: string;
  }[];
  errors: {
    file: string;
    error: string;
  }[];
}> => {
  const res = await apiClient.post(`${API_CO}/norms/import-excel-files`, data, {
    headers: {
      accept: "application/",
      "Content-Type": "multipart/form-data",
    },
  });

  if (res.data?.results === false) {
    throw new Error(res.data.message);
  }

  return res.data;
};

type UseImportNormOptions = {
  config?: MutationConfig<typeof importNorm>;
};

export const useImportNorm = ({ config }: UseImportNormOptions) => {
  return useMutation({
    ...config,
    mutationFn: importNorm,
  });
};
