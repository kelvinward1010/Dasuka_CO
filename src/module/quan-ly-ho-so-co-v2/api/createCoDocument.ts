import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export type CreateCoDocumentDTO = any;

export const createCoDocument = async (
  data: CreateCoDocumentDTO,
): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/co-documents/create`, data);

  return res.data;
};

type UseCreateCoDocumentOptions = {
  config?: MutationConfig<typeof createCoDocument>;
};

export const useCreateCoDocument = ({ config }: UseCreateCoDocumentOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createCoDocument,
  });
};
