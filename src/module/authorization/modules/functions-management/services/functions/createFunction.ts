import { useMutation } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IFunction } from "../../types/function";

export const createFunction = async (data: IFunction): Promise<any> => {
  const res = await apiClient?.post(`${API_CORE}/function/create`, data);
  return res.data;
};

type UseCreateFunctionOptions = {
  config?: MutationConfig<typeof createFunction>;
};

export const useCreateFunction = ({ config }: UseCreateFunctionOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createFunction,
  });
};
