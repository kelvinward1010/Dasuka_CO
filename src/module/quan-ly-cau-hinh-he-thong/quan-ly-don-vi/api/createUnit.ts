import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { Unit } from "../types";

export type CreateUnitDTO = Unit;

export const createUnit = async (data: CreateUnitDTO): Promise<any> => {
  const res = await apiClient?.post(`${API_CO}/units/create`, data);

  return res.data;
};

type UseCreateUnitOptions = {
  config?: MutationConfig<typeof createUnit>;
};

export const useCreateUnit = ({ config }: UseCreateUnitOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createUnit,
  });
};
