import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getDashboardDeclaration = async ({
  params,
}: AxiosRequestConfig["params"]): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/statistics/get-dashboard-declaration-by-customer-id`,
    params,
  );
  return res.data;
};

type QueryFnType = typeof getDashboardDeclaration;

type UseGetDashboardDeclarationOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useGetDashboardDeclaration = ({
  params,
  config,
}: UseGetDashboardDeclarationOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["dashboard-declaration", params],
    queryFn: () => getDashboardDeclaration({ params }),
  });
};
