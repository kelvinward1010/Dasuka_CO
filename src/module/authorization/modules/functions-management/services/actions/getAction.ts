import { useQuery } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getAction = async ({ id }: { id: string }): Promise<any> => {
  const res = await apiClient.get(`${API_CORE}/action/getbyid/${id}`);
  return res.data;
};

type QueryFnType = typeof getAction;

type UseActionOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useAction = ({ config, id }: UseActionOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["actions", id],
    queryFn: () => getAction({ id }),
  });
};
