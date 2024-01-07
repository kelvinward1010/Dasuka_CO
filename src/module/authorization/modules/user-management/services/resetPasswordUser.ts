import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

type Props = {
  user_id: string;
  lu_user_id: string;
};

export const resetPasswordUser = async (data: Props): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/employees/reset-password-by-admin`,
    data,
  );

  return res.data;
};

type UseResetPasswordUserOptions = {
  config?: MutationConfig<typeof resetPasswordUser>;
};

export const useResetPasswordUser = ({
  config,
}: UseResetPasswordUserOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: resetPasswordUser,
  });
};
