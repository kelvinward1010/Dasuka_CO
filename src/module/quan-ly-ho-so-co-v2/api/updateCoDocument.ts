import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { ICoDocument } from "../types";

export type UpdateCoDocumentDTO = Partial<ICoDocument>;
export const updateCoDocument = async (
  data: UpdateCoDocumentDTO,
): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/co-documents/update/`, data);

  return res.data;
};

type UseUpdateCoDocumentOptions = {
  config?: MutationConfig<typeof updateCoDocument>;
};

export const useUpdateCoDocument = ({ config }: UseUpdateCoDocumentOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateCoDocument,
  });
};
