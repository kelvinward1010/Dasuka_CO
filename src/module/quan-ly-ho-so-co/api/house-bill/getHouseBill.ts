import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getHouseBill = ({ params }: { params: any }): Promise<any> => {
  return apiClient
    .post(`${API_CO}/house-bills/get-by-export-declaration-number`, params)
    .then((res) => res.data);
};

type QueryFnType = typeof getHouseBill;

type UseHouseBillOptions = {
  params: any;
  config?: QueryConfig<QueryFnType>;
};

export const useHouseBill = ({ params, config }: UseHouseBillOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["house_bills", params],
    queryFn: () => getHouseBill({ params }),
  });
};
