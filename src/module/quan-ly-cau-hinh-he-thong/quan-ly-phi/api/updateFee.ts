import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { Fee } from "../types";

export type UpdateFeeDTO = Fee;

export const updateFee = async (data: UpdateFeeDTO): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/fees/update`, data);

  return res.data;
};

type UseUpdateFeeOptions = {
  config?: MutationConfig<typeof updateFee>;
};

export const useUpdateFee = ({ config }: UseUpdateFeeOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateFee,
  });
};
