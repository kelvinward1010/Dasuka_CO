import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { IImportDeclaration } from "../types";

export const getImportDeclarations = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<IImportDeclaration>> => {
  const res = await apiClient.post(
    `${API_CO}/import-declarations/search`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getImportDeclarations;

type UseImportDeclarationsOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useImportDeclarations = ({
  params,
  config,
}: UseImportDeclarationsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["import-declarations", params],
    queryFn: () => getImportDeclarations({ params }),
  });
};
