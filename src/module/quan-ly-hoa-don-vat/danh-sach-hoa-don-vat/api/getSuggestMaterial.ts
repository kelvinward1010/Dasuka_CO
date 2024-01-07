import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_PDF } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getSuggestMaterial = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<any> => {
  const res = await apiClient.post(`${API_PDF}/import/suggest/`, params);

  return res.data;
};

type QueryFnType = typeof getSuggestMaterial;

type UseMaterialsCustomerOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useSuggestMaterial = ({
  config,
  params,
}: UseMaterialsCustomerOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["materials-customer"],
    queryFn: () => getSuggestMaterial({ params }),
  });
};
