import { useQuery } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getRole = async ({ id }: { id: string }): Promise<any> => {
  const res = await apiClient.get(`${API_CORE}/role/getbyid/${id}`);
  return res.data;
};

type QueryFnType = typeof getRole;

type UseRoleOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useRole = ({ config, id }: UseRoleOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["roles", id],
    queryFn: () => getRole({ id }),
  });
};
