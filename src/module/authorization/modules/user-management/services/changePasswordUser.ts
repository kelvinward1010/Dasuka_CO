import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

type Props = {
  user_id: string;
  old_password: string;
  new_password: string;
  lu_user_id: string;
};

export const changePasswordUser = async (data: Props): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/employees/change-password`, data);

  return res.data;
};

type UseChangePasswordUserOptions = {
  config?: MutationConfig<typeof changePasswordUser>;
};

export const useChangePasswordUser = ({
  config,
}: UseChangePasswordUserOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: changePasswordUser,
  });
};
