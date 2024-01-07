import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { INorm } from "../types";

export type UpdateNormDTO = INorm;

export const updateNorm = async (data: UpdateNormDTO): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/norms/update`, data);
  return res.data;
};

type UseUpdateNormOptions = {
  config?: MutationConfig<typeof updateNorm>;
};

export const useUpdateNorm = ({ config }: UseUpdateNormOptions) => {
  return useMutation({
    ...config,
    mutationFn: updateNorm,
  });
};
