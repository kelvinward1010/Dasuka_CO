import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getProduct = async ({ id }: { id: string }): Promise<any> => {
  const res = await apiClient.get(`${API_CO}/products/getbyid/${id}`);
  return res.data;
};

type QueryFnType = typeof getProduct;

type UseProductOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useProduct = ({ config, id }: UseProductOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["product", id],
    queryFn: () => getProduct({ id }),
  });
};
