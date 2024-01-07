import { useMutation, useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import {
  ExtractFnReturnType,
  MutationConfig,
  QueryConfig,
} from "@/lib/react-query";

import { IEmployee } from "../types";

export const getQLND = async ({ id }: { id: string }): Promise<IEmployee> => {
  const res = await apiClient.get(`${API_CO}/employees/getbyid/${id}`);
  return res.data;
};

type QueryFnType = typeof getQLND;

type UseQLNDOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useQLND = ({ config, id }: UseQLNDOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["qlnd", id],
    queryFn: () => getQLND({ id }),
  });
};

export const useQLNDLazy = ({
  config,
}: {
  config?: MutationConfig<typeof getQLND>;
}) => {
  return useMutation({
    ...config,
    mutationFn: getQLND,
    mutationKey: ["qlnd-lazy"],
  });
};
