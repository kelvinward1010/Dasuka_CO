import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export type CreatePsrDTO = any;

export const createPSR = async (data: CreatePsrDTO): Promise<any> => {
  const res = await apiClient?.post(`${API_CO}/psr/createPSR`, data);

  return res.data;
};

type UseCreatePSROptions = {
  config?: MutationConfig<typeof createPSR>;
};

export const useCreatePSR = ({ config }: UseCreatePSROptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createPSR,
  });
};
