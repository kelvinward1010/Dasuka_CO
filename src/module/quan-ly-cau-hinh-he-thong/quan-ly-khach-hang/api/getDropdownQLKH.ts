import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import { ICustomerDropdown } from "../types";

export const getDropdownQLKH = async (): Promise<ICustomerDropdown> => {
  const res = await apiClient.get(`${API_CO}/customers/dropdown`);
  return res.data;
};

type QueryFnType = typeof getDropdownQLKH;

type UseDropdownQLKHOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useDropdownQLKH = ({ config }: UseDropdownQLKHOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: "qlkh-dropdown",
    queryFn: () => getDropdownQLKH(),
  });
};
