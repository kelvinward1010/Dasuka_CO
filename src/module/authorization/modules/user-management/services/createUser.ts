import { useMutation } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IUserDAO } from "../types/user";

export const createUser = async (data: IUserDAO): Promise<any> => {
  const res = await apiClient?.post(`${API_CORE}/users/create`, data);

  return res.data;
};

type UseCreateUserOptions = {
  config?: MutationConfig<typeof createUser>;
};

export const useCreateUser = ({ config }: UseCreateUserOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createUser,
  });
};
