import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { Unit } from "../types";

export type UpdateUnitDTO = Unit;

export const updateUnit = async (data: UpdateUnitDTO): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/units/update`, data);

  return res.data;
};

type UseUpdateUnitOptions = {
  config?: MutationConfig<typeof updateUnit>;
};

export const useUpdateUnit = ({ config }: UseUpdateUnitOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateUnit,
  });
};
