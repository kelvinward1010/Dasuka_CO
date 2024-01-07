import { useQuery } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getUser = async ({ id }: { id: string }): Promise<any> => {
  const res = await apiClient.get(`${API_CORE}/users/getbyid/${id}`);
  return res.data;
};

type QueryFnType = typeof getUser;

type UseUserOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useUser = ({ config, id }: UseUserOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["users", id],
    queryFn: () => getUser({ id }),
  });
};
