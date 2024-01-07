import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

interface Props {
  norm_id: number;
  list_json_material_ids: any[];
}

export const normalizeNorm = async (data: Props): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/norms/normalize-norm`, data);
  return res.data;
};

type UseNormalizeNormOptions = {
  config?: MutationConfig<typeof normalizeNorm>;
};

export const useNormalizeNorm = ({ config }: UseNormalizeNormOptions) => {
  return useMutation({
    ...config,
    mutationFn: normalizeNorm,
  });
};
