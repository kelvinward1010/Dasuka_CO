import { useMutation } from "react-query";

import { API_CHAT } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

interface Props {}

export const updateNotify = async (data: Props): Promise<any> => {
  const res = await apiClient?.post(`${API_CHAT}/notify/update-notify`, data, {
    baseURL: import.meta.env.VITE_BASE_CHAT,
  });

  return res.data;
};

type UseUpdateNotifyOptions = {
  config?: MutationConfig<typeof updateNotify>;
};

export const useUpdateNotify = ({ config }: UseUpdateNotifyOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateNotify,
  });
};
