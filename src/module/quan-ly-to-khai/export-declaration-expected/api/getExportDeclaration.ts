import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import { IExportDeclaration } from "../types";

export const getExportDeclaration = async ({
  id,
}: {
  id: string;
}): Promise<IExportDeclaration> => {
  const res = await apiClient.get(
    `${API_CO}/export-declarations/getbyid/${id}`,
  );

  return res.data;
};

export const getExportDeclarationCO = async ({
  id,
}: {
  id: string;
}): Promise<IExportDeclaration> => {
  const res = await apiClient.get(
    `${API_CO}/export-declarations/getbyid-co/${id}`,
  );

  return res.data;
};

type QueryFnType = typeof getExportDeclaration;

type UseExportDeclarationOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useExportDeclaration = ({
  config,
  id,
}: UseExportDeclarationOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["export-declaration", id],
    queryFn: () => getExportDeclarationCO({ id }),
  });
};
