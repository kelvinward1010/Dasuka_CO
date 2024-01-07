import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getUnit = async ({ id }: { id: string }): Promise<any> => {
  const res = await apiClient.get(`${API_CO}/units/getbyid/${id}`);
  return res.data;
};

type QueryFnType = typeof getUnit;

type UseUnitOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useUnit = ({ config, id }: UseUnitOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["units", id],
    queryFn: () => getUnit({ id }),
  });
};
