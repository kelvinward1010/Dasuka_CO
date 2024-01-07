import { useMutation } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IRole } from "../../types/role";

export const createRole = async (data: IRole): Promise<any> => {
  const res = await apiClient?.post(`${API_CORE}/role/create`, data);

  return res.data;
};

type UseCreateRoleOptions = {
  config?: MutationConfig<typeof createRole>;
};

export const useCreateRole = ({ config }: UseCreateRoleOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createRole,
  });
};
