import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import { IExportDeclarationDropdown } from "../types";

export const getDropdownExportDeclarationV2 = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IExportDeclarationDropdown> => {
  const res = await apiClient.post(
    `${API_CO}/export-declarations/dropdown-lazy`,
    params,
  );

  return res.data;
};

export const getDropdownExportDeclarationCODoneV2 = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IExportDeclarationDropdown> => {
  const res = await apiClient.post(
    `${API_CO}/export-declarations/dropdown-lazy-co`,
    params,
  );

  return res.data;
};

type QueryFnType = typeof getDropdownExportDeclarationV2;

type UseDropdownExportDeclarationOptions = {
  isDone?: boolean | null;
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useDropdownExportDeclarationV2 = ({
  isDone,
  params,
  config,
}: UseDropdownExportDeclarationOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["export-declaration-dropdown", params],
    queryFn: () =>
      isDone
        ? getDropdownExportDeclarationCODoneV2({ params })
        : getDropdownExportDeclarationV2({ params }),
  });
};
