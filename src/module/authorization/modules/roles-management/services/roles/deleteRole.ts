import { useMutation } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";
import { IBaseDeleteItems } from "@/types";

export const deleteRole = async (
  data: IBaseDeleteItems<{
    role_id: string;
  }>,
): Promise<any> => {
  const res = await apiClient.post(`${API_CORE}/role/delete`, data);

  return res.data;
};

type UseDeleteRoleOptions = {
  config?: MutationConfig<typeof deleteRole>;
};

export const useDeleteRole = ({ config }: UseDeleteRoleOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: deleteRole,
  });
};
