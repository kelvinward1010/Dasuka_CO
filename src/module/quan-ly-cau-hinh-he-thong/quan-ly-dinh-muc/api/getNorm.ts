import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import { INorm } from "../types";

export const getNorm = async ({ id }: { id: number }): Promise<INorm> => {
  const res = await apiClient.get(`${API_CO}/norms/getbyid/${id}`);
  return res.data;
};

type QueryFnType = typeof getNorm;

type UseNormOptions = {
  id: number;
  config?: QueryConfig<QueryFnType>;
};

export const useNorm = ({ config, id }: UseNormOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["norm", id],
    queryFn: () => getNorm({ id }),
  });
};
