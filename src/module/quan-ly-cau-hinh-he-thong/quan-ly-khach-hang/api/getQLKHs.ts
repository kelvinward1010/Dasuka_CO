import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { ICustomer } from "../types";

export const getQLKHs = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<ICustomer>> => {
  const res = await apiClient.post(
    `${API_CO}/customers/search`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getQLKHs;

type UseQLKHsOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useQLKHs = ({ params, config }: UseQLKHsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["qlkhs", params],
    queryFn: () => getQLKHs({ params }),
  });
};
