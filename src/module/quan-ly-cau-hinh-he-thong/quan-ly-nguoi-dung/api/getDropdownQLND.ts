import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import { IEmployeeDropdown } from "../types";

export const getDropdownQLND = async (): Promise<IEmployeeDropdown> => {
  const res = await apiClient.get(`${API_CO}/employees/dropdown`);
  return res.data;
};

type QueryFnType = typeof getDropdownQLND;

type UseDropdownQLNDOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useDropdownQLND = ({ config }: UseDropdownQLNDOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: "qlnd-dropdown",
    queryFn: () => getDropdownQLND(),
  });
};
