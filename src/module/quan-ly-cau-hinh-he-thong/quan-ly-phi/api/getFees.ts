import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { Fee } from "../types";

export const getFees = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<Fee>> => {
  const res = await apiClient.post(
    `${API_CO}/fees/search`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getFees;

type UseFeesOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useFees = ({ params, config }: UseFeesOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["fees", params],
    queryFn: () => getFees({ params }),
  });
};
