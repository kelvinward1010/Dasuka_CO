import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_PDF } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getSuggestMaterialAll = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<any> => {
  const res = await apiClient.post(`${API_PDF}/import/suggest-auto/`, params);

  return res.data;
};

type QueryFnType = typeof getSuggestMaterialAll;

type UseMaterialsCustomerOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useSuggestMaterialAll = ({
  config,
  params,
}: UseMaterialsCustomerOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["materials-customer"],
    queryFn: () => getSuggestMaterialAll({ params }),
  });
};
