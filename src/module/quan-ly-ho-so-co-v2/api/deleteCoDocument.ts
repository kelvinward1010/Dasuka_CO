import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig, queryClient } from "@/lib/react-query";
import { IBaseDeleteItems } from "@/types";

export const deleteCoDocument = async (
  data: IBaseDeleteItems<{
    co_document_id: string;
  }>,
): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/co-documents/delete`, data);
  return res.data;
};

type UseDeleteCoDocumentOptions = {
  config?: MutationConfig<typeof deleteCoDocument>;
};

export const useDeleteCoDocument = ({
  config,
}: UseDeleteCoDocumentOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries(["co-documents"]);
    },
    ...config,
    mutationFn: deleteCoDocument,
  });
};
