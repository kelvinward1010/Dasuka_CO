import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig, queryClient } from "@/lib/react-query";
import { IBaseDeleteItems } from "@/types";

export const deleteOtherDocument = async (
  data: IBaseDeleteItems<{
    co_document_file_id: string;
  }>,
): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/co-document-files/delete`, data);
  return res.data;
};

type UseDeleteOtherDocumentOptions = {
  config?: MutationConfig<typeof deleteOtherDocument>;
};

export const useDeleteOtherDocument = ({
  config,
}: UseDeleteOtherDocumentOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries(["co-document-files"]);
    },
    ...config,
    mutationFn: deleteOtherDocument,
  });
};
