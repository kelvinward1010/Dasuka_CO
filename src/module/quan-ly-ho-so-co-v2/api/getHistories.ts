import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getHistories = async ({ id }: { id: string }): Promise<any> => {
  const res = await apiClient.get(
    `${API_CO}/co-document-histories/getbyid/${id}`,
  );
  return res.data;
};

type QueryFnType = typeof getHistories;

type UseHistoriesOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useHistories = ({ config, id }: UseHistoriesOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["co-documents", id],
    queryFn: () => getHistories({ id }),
  });
};
