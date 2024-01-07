import { useMutation } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IAction } from "../../types/action";

export const createAction = async (data: IAction): Promise<any> => {
  const res = await apiClient?.post(`${API_CORE}/action/create`, data);

  return res.data;
};

type UseCreateActionOptions = {
  config?: MutationConfig<typeof createAction>;
};

export const useCreateAction = ({ config }: UseCreateActionOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createAction,
  });
};
