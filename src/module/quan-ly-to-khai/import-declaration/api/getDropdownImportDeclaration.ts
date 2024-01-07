import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseDropdown } from "@/types";

export const getDropdownImportDeclaration =
  async (): Promise<IBaseDropdown> => {
    const res = await apiClient.get(`${API_CO}/import-declarations/dropdown`);
    return res.data;
  };

type QueryFnType = typeof getDropdownImportDeclaration;

type UseDropdownImportDeclarationOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useDropdownImportDeclaration = ({
  config,
}: UseDropdownImportDeclarationOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: "import-declaration-dropdown",
    queryFn: () => getDropdownImportDeclaration(),
  });
};
