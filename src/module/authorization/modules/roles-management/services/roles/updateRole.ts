import { useMutation } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IRole } from "../../types/role";

export const updateRole = async (data: IRole): Promise<any> => {
  const res = await apiClient.post(`${API_CORE}/role/update`, data);

  return res.data;
};

type UseUpdateRoleOptions = {
  config?: MutationConfig<typeof updateRole>;
};

export const useUpdateRole = ({ config }: UseUpdateRoleOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateRole,
  });
};
