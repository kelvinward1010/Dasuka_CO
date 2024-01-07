import { useMutation } from "react-query";

import { API_CHAT } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig, queryClient } from "@/lib/react-query";

export const deleteNotifies = async (data: any): Promise<any> => {
  const res = await apiClient.post(`${API_CHAT}/notify/delete-notify`, data, {
    baseURL: import.meta.env.VITE_BASE_CHAT,
  });

  return res.data;
};

type UseDeleteNotifiesOptions = {
  config?: MutationConfig<typeof deleteNotifies>;
};

export const useDeleteNotifies = ({
  config,
}: UseDeleteNotifiesOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries(["notifies"]);
    },
    ...config,
    mutationFn: deleteNotifies,
  });
};
