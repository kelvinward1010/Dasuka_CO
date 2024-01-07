import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getMaterialReports = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/statistics/search-material-int-out-inventory-reports`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getMaterialReports;

type UseMaterialReportsOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useMaterialReports = ({
  params,
  config,
}: UseMaterialReportsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["material-reports", params],
    queryFn: () => getMaterialReports({ params }),
  });
};
