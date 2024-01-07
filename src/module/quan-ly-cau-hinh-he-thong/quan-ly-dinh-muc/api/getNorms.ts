import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { INorm } from "../types";

export const getNorms = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<INorm>> => {
  const res = await apiClient.post(
    `${API_CO}/norms/search`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getNorms;

type UseNormsOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useNorms = ({ params, config }: UseNormsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["norms", params],
    queryFn: () => getNorms({ params }),
  });
};
