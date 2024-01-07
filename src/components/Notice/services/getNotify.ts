import { useQuery } from "react-query";

import { API_CHAT } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getNotify = async ({ id }: { id: string }): Promise<any> => {
  const res = await apiClient.get(`${API_CHAT}/notify/get-new-history/` + id, {
    baseURL: import.meta.env.VITE_BASE_CHAT,
  });
  return res.data;
};

type QueryFnType = typeof getNotify;

type UseNotifyOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useNotify = ({ config, id }: UseNotifyOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["notifies", id],
    queryFn: () => getNotify({ id }),
  });
};
