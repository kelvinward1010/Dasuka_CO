import { useQuery } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getPermissions = async ({
  token,
}: {
  token: string;
}): Promise<any> => {
  const res = await apiClient.get(`${API_CORE}/users/authorize/${token}`);
  return res.data;
};

type QueryFnType = typeof getPermissions;

type UsePermissionsOptions = {
  token: string;
  config?: QueryConfig<QueryFnType>;
};

export const usePermissions = ({ config, token }: UsePermissionsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["permissions", token],
    queryFn: () => getPermissions({ token }),
  });
};
