import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";
import { IBaseDeleteItems } from "@/types";

export const deleteNorm = async (
  data: IBaseDeleteItems<{
    norm_id: number;
  }>,
): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/norms/delete`, data);

  return res.data;
};

type UseDeleteNormOptions = {
  config?: MutationConfig<typeof deleteNorm>;
};

export const useDeleteNorm = ({ config }: UseDeleteNormOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: deleteNorm,
  });
};
