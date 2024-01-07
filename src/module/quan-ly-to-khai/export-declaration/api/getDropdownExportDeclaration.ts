import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import { IExportDeclarationDropdown } from "../types";

export const getDropdownExportDeclaration = async ({
  customerId,
}: {
  customerId: string;
}): Promise<IExportDeclarationDropdown> => {
  const res = await apiClient.get(
    `${API_CO}/export-declarations/dropdown/${customerId}`,
  );

  return res.data;
};

export const getDropdownExportDeclarationCO = async ({
  customerId,
}: {
  customerId: string;
}): Promise<IExportDeclarationDropdown> => {
  const res = await apiClient.get(
    `${API_CO}/export-declarations/dropdown-co/${customerId}`,
  );

  return res.data;
};

type QueryFnType = typeof getDropdownExportDeclaration;

type UseDropdownExportDeclarationOptions = {
  isCO?: boolean;
  customerId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useDropdownExportDeclaration = ({
  customerId,
  isCO = false,
  config,
}: UseDropdownExportDeclarationOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["export-declaration-dropdown", customerId, isCO],
    queryFn: () =>
      isCO
        ? getDropdownExportDeclaration({ customerId })
        : getDropdownExportDeclaration({ customerId }),
  });
};
