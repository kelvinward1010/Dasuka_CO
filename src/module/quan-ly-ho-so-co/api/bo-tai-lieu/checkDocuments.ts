import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const checkDocuments = async ({
  co_document_id,
}: {
  co_document_id: string;
}): Promise<any> => {
  return apiClient
    .get(`${API_CO}/co-documents/check-export/${co_document_id}`)
    .then((res) => res.data);
};

type QueryFnType = typeof checkDocuments;

type UseOtherDocumentsOptions = {
  co_document_id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useCheckDocuments = ({
  co_document_id,
  config,
}: UseOtherDocumentsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["document-files", co_document_id],
    queryFn: () => checkDocuments({ co_document_id }),
  });
};
