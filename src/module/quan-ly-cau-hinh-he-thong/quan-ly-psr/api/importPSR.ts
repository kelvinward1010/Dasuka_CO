import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export const importPSR = async (params: any): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/psr/importPSR`,
    filterEmptyString(params),
    {
      headers: {
        accept: "application/",
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
};

type UseImportPSROptions = {
  config?: MutationConfig<typeof importPSR>;
};

export const useImportPSR = ({ config }: UseImportPSROptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: importPSR,
  });
};
