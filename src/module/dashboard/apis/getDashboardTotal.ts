import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import { IDashboardTotal } from "../types";

export const getDashboardTotal = async ({
  params,
}: AxiosRequestConfig["params"]): Promise<{
  data: IDashboardTotal;
  success: boolean;
}> => {
  const res = await apiClient.post(
    `${API_CO}/statistics/get-dashboard-total-by-user-name`,
    params,
  );

  return res.data;
};

type QueryFnType = typeof getDashboardTotal;

type UseGetDashboardTotalOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useGetDashboardTotal = ({
  params,
  config,
}: UseGetDashboardTotalOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["dashboard-total"],
    queryFn: () => getDashboardTotal({ params }),
  });
};
