import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IExportDeclaration } from "../types";

export type UpdateExportExpectedDTO = IExportDeclaration;

export const updateExportExpected = async (
  data: UpdateExportExpectedDTO,
): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/export-declarations/update-expected`,
    data,
  );
  return res.data;
};

type UseUpdateExportExpectedOptions = {
  config?: MutationConfig<typeof updateExportExpected>;
};

export const useUpdateExportExpected = ({
  config,
}: UseUpdateExportExpectedOptions) => {
  return useMutation({
    ...config,
    mutationFn: updateExportExpected,
  });
};
