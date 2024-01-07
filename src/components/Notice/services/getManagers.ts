import { useQuery } from "react-query";

import { API_CHAT } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getManagers = async ({
  user_id,
}: {
  user_id: string;
}): Promise<string[]> => {
  const res = await apiClient.get(`${API_CHAT}/notify/get-manager/` + user_id, {
    baseURL: import.meta.env.VITE_BASE_CHAT,
  });

  return res.data;
};

type QueryFnType = typeof getManagers;

type UseNotifyOptions = {
  user_id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useNotifies = ({ user_id, config }: UseNotifyOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["notifies", user_id],
    queryFn: () => getManagers({ user_id }),
  });
};
