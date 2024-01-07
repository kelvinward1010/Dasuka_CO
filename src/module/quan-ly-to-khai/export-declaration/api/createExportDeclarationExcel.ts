import { useMutation } from "react-query";

import { API_IMPORT } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IMessage } from "../../import-declaration/types";

export type CreateExportDeclarationDTO = any;

export const createExportDeclarationExcel = async (
  data: CreateExportDeclarationDTO,
): Promise<IMessage[]> => {
  const res = await apiClient.post(
    `${API_IMPORT}/excel/export-declaration`,
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
  config?: MutationConfig<typeof createExportDeclarationExcel>;
};

export const useCreateExportDeclarationExcel = ({
  config,
}: UseCreateExportDeclarationOptions) => {
  return useMutation({
    ...config,
    mutationFn: createExportDeclarationExcel,
  });
};
