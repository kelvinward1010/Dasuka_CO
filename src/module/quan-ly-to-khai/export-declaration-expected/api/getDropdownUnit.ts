import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import { IExportDeclarationDropdown } from "../types";

export const getDropdownUnit =
  async (): Promise<IExportDeclarationDropdown> => {
    const res = await apiClient.get(`${API_CO}/units/dropdown`);

    return res.data;
  };

type QueryFnType = typeof getDropdownUnit;

type UseDropdownExportDeclarationOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useDropdownUnit = ({
  config,
}: UseDropdownExportDeclarationOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["unit-dropdown"],
    queryFn: () => getDropdownUnit(),
  });
};
