import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";
import { IBaseDeleteItems } from "@/types";

export const deleteExportExpected = async (
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

type UseDeleteExportExpectedOptions = {
  config?: MutationConfig<typeof deleteExportExpected>;
};

export const useDeleteExportExpected = ({
  config,
}: UseDeleteExportExpectedOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: deleteExportExpected,
  });
};
