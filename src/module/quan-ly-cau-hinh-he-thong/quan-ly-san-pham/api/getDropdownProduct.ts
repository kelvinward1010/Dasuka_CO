import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseDropdown } from "@/types";

export const getDropdownProduct = async (): Promise<IBaseDropdown> => {
  const res = await apiClient.get(`${API_CO}/products/dropdown`);
  return res.data;
};

type QueryFnType = typeof getDropdownProduct;

type UseDropdownProductOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useDropdownProduct = ({ config }: UseDropdownProductOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: "product-dropdown",
    queryFn: () => getDropdownProduct(),
  });
};
