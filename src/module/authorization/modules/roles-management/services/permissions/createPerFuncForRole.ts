import { useMutation } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export const createPerFuncForRole = async (data: any): Promise<any> => {
  const res = await apiClient.post(`${API_CORE}/role-function/create`, data);

  return res.data;
};

type UseCreatePerFuncForRoleOptions = {
  config?: MutationConfig<typeof createPerFuncForRole>;
};

export const useCreatePerFuncForRole = ({
  config,
}: UseCreatePerFuncForRoleOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createPerFuncForRole,
  });
};
