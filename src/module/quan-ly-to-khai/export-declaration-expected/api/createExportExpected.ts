import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { IExportDeclaration } from "../types";

export type createExportExpectedDTO = IExportDeclaration;

export const createExportExpected = async (
  data: createExportExpectedDTO,
): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/export-declarations/create-expected`,
    data,
  );
  return res.data;
};

type UseCreateExportExpectedOptions = {
  config?: MutationConfig<typeof createExportExpected>;
};

export const useCreateExportExpected = ({
  config,
}: UseCreateExportExpectedOptions) => {
  return useMutation({
    ...config,
    mutationFn: createExportExpected,
  });
};
