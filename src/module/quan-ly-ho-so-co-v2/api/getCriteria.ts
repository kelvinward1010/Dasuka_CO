import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getCriteria = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/products/getGetProductSpecificRules`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getCriteria;

type UseCriteriaOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useCriteria = ({ params, config }: UseCriteriaOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["list-criteria", params],
    queryFn: () => getCriteria({ params }),
  });
};
