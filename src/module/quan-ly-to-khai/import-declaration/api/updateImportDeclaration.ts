import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IImportDeclaration } from "../types";

export type UpdateImportDeclarationDTO = IImportDeclaration;

export const updateImportDeclaration = async (
  data: UpdateImportDeclarationDTO,
): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/import-declarations/update`,
    data,
  );
  return res.data;
};

type UseUpdateImportDeclarationOptions = {
  config?: MutationConfig<typeof updateImportDeclaration>;
};

export const useUpdateImportDeclaration = ({
  config,
}: UseUpdateImportDeclarationOptions) => {
  return useMutation({
    ...config,
    mutationFn: updateImportDeclaration,
  });
};
