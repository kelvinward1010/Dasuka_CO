import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";
import { IBaseDeleteItems } from "@/types";

export const deleteImportDeclaration = async (
  data: IBaseDeleteItems<{
    import_declaration_id: string;
  }>,
): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/import-declarations/delete`,
    data,
  );

  return res.data;
};

type UseDeleteImportDeclarationOptions = {
  config?: MutationConfig<typeof deleteImportDeclaration>;
};

export const useDeleteImportDeclaration = ({
  config,
}: UseDeleteImportDeclarationOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: deleteImportDeclaration,
  });
};
