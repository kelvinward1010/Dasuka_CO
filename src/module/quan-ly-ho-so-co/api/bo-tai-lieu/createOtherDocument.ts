import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export const createOtherDocument = async (data: any): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/co-document-files/create`, data);
  return res.data;
};

type UseCreateOtherDocumentOptions = {
  config?: MutationConfig<typeof createOtherDocument>;
};

export const useCreateOtherDocument = ({
  config,
}: UseCreateOtherDocumentOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createOtherDocument,
  });
};
