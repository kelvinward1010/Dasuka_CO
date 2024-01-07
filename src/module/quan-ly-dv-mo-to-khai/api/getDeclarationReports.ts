import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { OpenDeclarationReport } from "../types";

export const getDeclarationReports = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<OpenDeclarationReport>> => {
  const res = await apiClient.post(
    `${API_CO}/open-declaration-reports/search`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getDeclarationReports;

type UseDeclarationServiceOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useDeclarationReports = ({
  params,
  config,
}: UseDeclarationServiceOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["open-declaration-reports", params],
    queryFn: () => getDeclarationReports({ params }),
  });
};
