import { useMutation } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export const addRoleUser = async (data: any): Promise<any> => {
  const res = await apiClient.post(`${API_CORE}/user-role/create`, data);

  return res.data;
};

type UseAddRoleUserOptions = {
  config?: MutationConfig<typeof addRoleUser>;
};

export const useAddRoleUser = ({ config }: UseAddRoleUserOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: addRoleUser,
  });
};
