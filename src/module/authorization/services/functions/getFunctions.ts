import { DataNode } from "antd/es/tree";
import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

export const getFunctions = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<DataNode>> => {
  const res = await apiClient.post(
    `${API_CORE}/function/search`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getFunctions;

type UseFunctionOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useFunctions = ({ params, config }: UseFunctionOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["functions", params],
    queryFn: () => getFunctions({ params }),
  });
};
