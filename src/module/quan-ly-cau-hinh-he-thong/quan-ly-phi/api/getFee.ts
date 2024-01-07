import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getFee = async ({ id }: { id: string }): Promise<any> => {
  const res = await apiClient.get(`${API_CO}/fees/getbyid/${id}`);
  return res.data;
};

type QueryFnType = typeof getFee;

type UseFeeOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useFee = ({ config, id }: UseFeeOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["fee", id],
    queryFn: () => getFee({ id }),
  });
};
