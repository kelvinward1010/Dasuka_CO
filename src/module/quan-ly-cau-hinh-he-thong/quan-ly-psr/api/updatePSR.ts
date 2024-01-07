import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export type UpdatePsrDTO = any;

export const updatePSR = async (data: UpdatePsrDTO): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/psr/updatePSR`, data);

  return res.data;
};

type UseUpdatePSROptions = {
  config?: MutationConfig<typeof updatePSR>;
};

export const useUpdatePSR = ({ config }: UseUpdatePSROptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updatePSR,
  });
};
