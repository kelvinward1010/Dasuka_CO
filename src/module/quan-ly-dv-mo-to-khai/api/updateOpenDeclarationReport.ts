import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { OpenDeclarationReportUpdate } from "../types";

export type openDeclarationReportUpdate = OpenDeclarationReportUpdate;

export const updateOpenDeclarationReportUpdate = async (
  data: openDeclarationReportUpdate,
): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/open-declaration-reports/update`,
    data,
  );

  return res.data;
};

type UseUpdateOpenDeclarationReportOptions = {
  config?: MutationConfig<typeof updateOpenDeclarationReportUpdate>;
};

export const useUpdateOpenDeclarationReport = ({
  config,
}: UseUpdateOpenDeclarationReportOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateOpenDeclarationReportUpdate,
  });
};
