import { useQuery } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getRoleByUser = async ({ id }: { id: string }): Promise<any> => {
  const res = await apiClient.get(`${API_CORE}/role/getbyuserid/${id}`);
  return res.data;
};

type QueryFnType = typeof getRoleByUser;

type UseRoleByUserOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useRoleByUser = ({ config, id }: UseRoleByUserOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["users", id],
    queryFn: () => getRoleByUser({ id }),
  });
};
