import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CHAT } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

export const getNotifies = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<any>> => {
  const res = await apiClient.post(
    `${API_CHAT}/notify/search-notify`,
    filterEmptyString(params),
    {
      baseURL: import.meta.env.VITE_BASE_CHAT,
    },
  );

  return res.data;
};

type QueryFnType = typeof getNotifies;

type UseNotifyOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useNotifies = ({ params, config }: UseNotifyOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["notifies", params],
    queryFn: () => getNotifies({ params }),
  });
};
