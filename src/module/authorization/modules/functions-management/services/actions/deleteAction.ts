import { useMutation } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";
import { IBaseDeleteItems } from "@/types";

export const deleteAction = async (
  data: IBaseDeleteItems<{
    action_code: string;
  }>,
): Promise<any> => {
  const res = await apiClient.post(`${API_CORE}/action/delete`, data);

  return res.data;
};

type UseDeleteActionOptions = {
  config?: MutationConfig<typeof deleteAction>;
};

export const useDeleteAction = ({ config }: UseDeleteActionOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: deleteAction,
  });
};
