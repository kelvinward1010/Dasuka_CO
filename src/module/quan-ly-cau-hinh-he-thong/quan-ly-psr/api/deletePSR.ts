import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig, queryClient } from "@/lib/react-query";

export const deletePSR = async (params: any): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/psr/deletePSR`, params);

  return res.data;
};

type UseDeletePSROptions = {
  config?: MutationConfig<typeof deletePSR>;
};

export const useDeletePSR = ({ config }: UseDeletePSROptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries(["PSRs"]);
    },
    ...config,
    mutationFn: deletePSR,
  });
};
