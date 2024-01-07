import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { IQuantityDeclaration } from "../types";

export const getQuantityDeclarations = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<IQuantityDeclaration[]>> => {
  const res = await apiClient.post(
    `${API_CO}/import-declarations/get-survival-declaration`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getQuantityDeclarations;

type UseQuantityDeclarationsOptions = {
  enabled: boolean;
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useQuantityDeclarations = ({
  enabled = false,
  params,
  config,
}: UseQuantityDeclarationsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    enabled,
    queryKey: ["quantity-declarations", params],
    queryFn: () => getQuantityDeclarations({ params }),
  });
};
