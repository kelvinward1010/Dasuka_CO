import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { IExportDeclaration } from "../types";

export const getExportDeclarations = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<IExportDeclaration>> => {
  const res = await apiClient.post(
    `${API_CO}/export-declarations/search`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getExportDeclarations;

type UseExportDeclarationsOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useExportDeclarations = ({
  params,
  config,
}: UseExportDeclarationsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["export-declarations", params],
    queryFn: () => getExportDeclarations({ params }),
  });
};
