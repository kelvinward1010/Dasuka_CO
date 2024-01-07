import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export type CreateExportDeclarationDTO = any;

export const createExportDeclaration = async (
  data: CreateExportDeclarationDTO,
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

type UseCreateExportDeclarationOptions = {
  config?: MutationConfig<typeof createExportDeclaration>;
};

export const useCreateExportDeclaration = ({
  config,
}: UseCreateExportDeclarationOptions) => {
  return useMutation({
    ...config,
    mutationFn: createExportDeclaration,
  });
};
