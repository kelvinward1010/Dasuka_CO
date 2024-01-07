import { useMutation } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IAction } from "../../types/action";

export const updateAction = async (data: IAction): Promise<any> => {
  const res = await apiClient.post(`${API_CORE}/action/update`, data);

  return res.data;
};

type UseUpdateActionOptions = {
  config?: MutationConfig<typeof updateAction>;
};

export const useUpdateAction = ({ config }: UseUpdateActionOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateAction,
  });
};
