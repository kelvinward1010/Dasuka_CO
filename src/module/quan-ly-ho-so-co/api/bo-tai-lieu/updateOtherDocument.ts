import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export type UpdateOtherDocumentDTO = {
  co_document_file_id: string;
  note: string;
  lu_user_id: string;
};

export const updateOtherDocument = (
  data: UpdateOtherDocumentDTO,
): Promise<any> => {
  return apiClient
    .post(`${API_CO}/co-document-files/update`, data)
    .then((res) => res.data);
};

type UseUpdateOtherDocumentOptions = {
  config?: MutationConfig<typeof updateOtherDocument>;
};

export const useUpdateOtherDocument = ({
  config,
}: UseUpdateOtherDocumentOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateOtherDocument,
  });
};
