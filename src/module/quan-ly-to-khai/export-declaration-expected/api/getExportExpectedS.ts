import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { IExportDeclaration } from "../types";

export const getExportExpectedS = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<IExportDeclaration>> => {
  const res = await apiClient.post(
    `${API_CO}/export-declarations/search-expected`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getExportExpectedS;

type UseExportExpectedSOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useExportExpectedS = ({
  params,
  config,
}: UseExportExpectedSOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["export-expected-s", params],
    queryFn: () => getExportExpectedS({ params }),
  });
};
