import { useMutation } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

interface Props {
  user_name: string;
  password: string;
}

export const loginService = async (data: Props): Promise<any> => {
  const res = await apiClient?.post(`${API_CORE}/users/login`, data);

  return res.data;
};

type UseLoginOptions = {
  config?: MutationConfig<typeof loginService>;
};

export const useLogin = ({ config }: UseLoginOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: loginService,
  });
};
