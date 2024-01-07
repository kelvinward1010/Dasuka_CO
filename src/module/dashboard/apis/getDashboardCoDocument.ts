import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import { IDashboardCO } from "../types";

export const getDashboardCoDocument = async ({
  params,
}: AxiosRequestConfig["params"]): Promise<{
  data: IDashboardCO;
  success: boolean;
}> => {
  const res = await apiClient.post(
    `${API_CO}/statistics/get-dashboard-co`,
    params,
  );

  return res.data;
};

type QueryFnType = typeof getDashboardCoDocument;

type UseGetDashboardCoDocumentOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useGetDashboardCoDocument = ({
  params,
  config,
}: UseGetDashboardCoDocumentOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["dashboard-co-document", params],
    queryFn: () => getDashboardCoDocument({ params }),
  });
};
