import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

export const getPSRs = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<any>> => {
  const res = await apiClient.post(
    `${API_CO}/psr/searchPSR`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getPSRs;

type UsePSRsOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const usePSRs = ({ params, config }: UsePSRsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["PSRs", params],
    queryFn: () => getPSRs({ params }),
  });
};
