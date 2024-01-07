import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getPSR = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/psr/getPSRByCoFormId`,
    filterEmptyString(params),
  );
  return res.data;
};

type QueryFnType = typeof getPSR;

type UsePSROptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
  enabled?: boolean;
};

export const usePSR = ({ config, params, enabled = false }: UsePSROptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    enabled,
    queryKey: ["PSR", params],
    queryFn: () => getPSR({ params }),
  });
};
