import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IExportDeclaration } from "../types";

export type UpdateExportDeclarationDTO = IExportDeclaration;

export const updateExportDeclaration = async (
  data: UpdateExportDeclarationDTO,
): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/export-declarations/update`,
    data,
  );
  return res.data;
};

type UseUpdateExportDeclarationOptions = {
  config?: MutationConfig<typeof updateExportDeclaration>;
};

export const useUpdateExportDeclaration = ({
  config,
}: UseUpdateExportDeclarationOptions) => {
  return useMutation({
    ...config,
    mutationFn: updateExportDeclaration,
  });
};
