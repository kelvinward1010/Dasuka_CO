import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { IAction } from "../../modules/functions-management/types/action";

export const getActions = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<IAction>> => {
  const res = await apiClient.post(
    `${API_CORE}/action/search`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getActions;

type UseActionOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useActions = ({ params, config }: UseActionOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["actions", params],
    queryFn: () => getActions({ params }),
  });
};
