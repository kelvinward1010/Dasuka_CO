import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";
import { IBaseDeleteItems } from "@/types";

export const deleteExportDeclaration = async (
  data: IBaseDeleteItems<{
    export_declaration_id: string;
  }>,
): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/export-declarations/delete`,
    data,
  );

  return res.data;
};

type UseDeleteExportDeclarationOptions = {
  config?: MutationConfig<typeof deleteExportDeclaration>;
};

export const useDeleteExportDeclaration = ({
  config,
}: UseDeleteExportDeclarationOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: deleteExportDeclaration,
  });
};
