import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import { IImportDeclaration } from "../types";

export const getImportDeclaration = async ({
  id,
}: {
  id: string;
}): Promise<IImportDeclaration> => {
  const res = await apiClient.get(
    `${API_CO}/import-declarations/getbyid/${id}`,
  );
  return res.data;
};

type QueryFnType = typeof getImportDeclaration;

type UseImportDeclarationOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useImportDeclaration = ({
  config,
  id,
}: UseImportDeclarationOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["import-declaration", id],
    queryFn: () => getImportDeclaration({ id }),
  });
};
