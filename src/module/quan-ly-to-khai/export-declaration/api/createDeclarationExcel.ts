import { useMutation } from "react-query";

import { API_IMPORT } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IMessage } from "../../import-declaration/types";

export type CreateDeclarationExcelDTO = any;

export const createDeclarationExcel = async (
  data: CreateDeclarationExcelDTO,
): Promise<IMessage[]> => {
  const res = await apiClient.post(`${API_IMPORT}/excel/declaration`, data, {
    headers: {
      accept: "application/",
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

type UseCreateDeclarationExcelOptions = {
  config?: MutationConfig<typeof createDeclarationExcel>;
};

export const useCreateDeclarationExcel = ({
  config,
}: UseCreateDeclarationExcelOptions) => {
  return useMutation({
    ...config,
    mutationFn: createDeclarationExcel,
  });
};
