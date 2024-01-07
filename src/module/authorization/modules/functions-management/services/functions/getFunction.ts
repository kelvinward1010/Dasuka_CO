import { useQuery } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getFunction = async ({ id }: { id: string }): Promise<any> => {
  const res = await apiClient.get(`${API_CORE}/function/getbyid/${id}`);
  return res.data;
};

type QueryFnType = typeof getFunction;

type UseFunctionOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useFunction = ({ config, id }: UseFunctionOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["functions", id],
    queryFn: () => getFunction({ id }),
  });
};
