import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { ICoDocument } from "../types";

export const getCoDocuments = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<ICoDocument>> => {
  const res = await apiClient.post(
    `${API_CO}/co-documents/search`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getCoDocuments;

type UseCoDocumentsOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useCoDocuments = ({ params, config }: UseCoDocumentsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["co-documents", params],
    queryFn: () => getCoDocuments({ params }),
  });
};
