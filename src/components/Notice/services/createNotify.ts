import { useMutation } from "react-query";

import { API_CHAT } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

interface Props {}

// All of notify apis are drunk, need fix.

export const createNotify = async (data: Props): Promise<any> => {
  const res = await apiClient?.post(
    `${API_CHAT}/notify/send-document-request`,
    data,
    {
      baseURL: import.meta.env.VITE_BASE_CHAT,
    },
  );
  // const res = await apiClient?.post(`/api-chat/notify/send-notify`, data, {
  //   baseURL: import.meta.env.VITE_BASE_CHAT,
  // });

  return res.data;
};

type UseCreateNotifyOptions = {
  config?: MutationConfig<typeof createNotify>;
};

export const useCreateNotify = ({ config }: UseCreateNotifyOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createNotify,
  });
};
