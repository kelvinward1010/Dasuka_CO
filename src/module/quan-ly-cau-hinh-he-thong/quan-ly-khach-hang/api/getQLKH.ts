import { useMutation, useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import {
  ExtractFnReturnType,
  MutationConfig,
  QueryConfig,
} from "@/lib/react-query";

import { ICustomer } from "../types";

export const getQLKH = async ({ id }: { id: string }): Promise<ICustomer> => {
  const res = await apiClient.get(`${API_CO}/customers/getbyid/${id}`);
  return res.data;
};

type QueryFnType = typeof getQLKH;

type UseQLKHOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useQLKH = ({ config, id }: UseQLKHOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["qlkh", id],
    queryFn: () => getQLKH({ id }),
  });
};

export const useQLKHLazy = ({
  config,
}: {
  config?: MutationConfig<typeof getQLKH>;
}) => {
  return useMutation({
    ...config,
    mutationFn: getQLKH,
    mutationKey: ["qlnd-lazy"],
  });
};
