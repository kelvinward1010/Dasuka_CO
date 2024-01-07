import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export type CreateImportDeclarationDTO = any;

export const createImportDeclaration = async (
  data: CreateImportDeclarationDTO,
): Promise<{
  messages: {
    message: string;
    is_successful: boolean;
  }[];
  total_count: number;
}> => {
  const res = await apiClient.post(
    `${API_CO}/import-xml/import-xml-files`,
    data,
    {
      headers: {
        accept: "application/",
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data;
};

type UseCreateImportDeclarationOptions = {
  config?: MutationConfig<typeof createImportDeclaration>;
};

export const useCreateImportDeclaration = ({
  config,
}: UseCreateImportDeclarationOptions) => {
  return useMutation({
    ...config,
    mutationFn: createImportDeclaration,
  });
};
