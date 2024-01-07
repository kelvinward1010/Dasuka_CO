import { useMutation } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IFunction } from "../../types/function";

export const updateFunction = async (data: IFunction): Promise<any> => {
  const res = await apiClient.post(`${API_CORE}/function/update`, data);

  return res.data;
};

type UseUpdateFunctionOptions = {
  config?: MutationConfig<typeof updateFunction>;
};

export const useUpdateFunction = ({ config }: UseUpdateFunctionOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateFunction,
  });
};
