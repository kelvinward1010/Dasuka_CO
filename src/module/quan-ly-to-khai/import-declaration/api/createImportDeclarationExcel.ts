import { useMutation } from "react-query";

import { API_IMPORT } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IMessage } from "../types";

export type CreateImportDeclarationDTO = any;

export const createImportDeclarationExcel = async (
  data: CreateImportDeclarationDTO,
): Promise<IMessage[]> => {
  const res = await apiClient.post(
    `${API_IMPORT}/excel/import-declaration`,
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
  config?: MutationConfig<typeof createImportDeclarationExcel>;
};

export const useCreateImportDeclarationExcel = ({
  config,
}: UseCreateImportDeclarationOptions) => {
  return useMutation({
    ...config,
    mutationFn: createImportDeclarationExcel,
  });
};
