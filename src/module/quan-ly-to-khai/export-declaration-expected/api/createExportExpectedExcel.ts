import { useMutation } from "react-query";

import { API_IMPORT } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IMessage } from "../../import-declaration/types";

export type CreateExportDeclarationDTO = any;

export const createExportExpectedExcel = async (
  data: CreateExportDeclarationDTO,
): Promise<IMessage[]> => {
  const res = await apiClient.post(
    `${API_IMPORT}/excel/export-declaration-expected`,
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

type UseCreateExportExpectedOptions = {
  config?: MutationConfig<typeof createExportExpectedExcel>;
};

export const useCreateExportExpectedExcel = ({
  config,
}: UseCreateExportExpectedOptions) => {
  return useMutation({
    ...config,
    mutationFn: createExportExpectedExcel,
  });
};
