import { useMutation } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IUserDAO } from "../types/user";

export const updateUser = async (data: IUserDAO): Promise<any> => {
  const res = await apiClient.post(`${API_CORE}/users/update`, data);

  return res.data;
};

type UseUpdateUserOptions = {
  config?: MutationConfig<typeof updateUser>;
};

export const useUpdateUser = ({ config }: UseUpdateUserOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateUser,
  });
};
