import { useMutation } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export const createPermissionForFunction = async (data: any): Promise<any> => {
  const res = await apiClient.post(`${API_CORE}/permission/create`, data);

  return res.data;
};

type UseCreatePermissionForFunctionOptions = {
  config?: MutationConfig<typeof createPermissionForFunction>;
};

export const useCreatePermissionForFunction = ({
  config,
}: UseCreatePermissionForFunctionOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createPermissionForFunction,
  });
};
