import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getOtherDocuments = ({
  co_document_id,
}: {
  co_document_id: string;
}): Promise<any> => {
  return apiClient
    .get(`${API_CO}/co-document-files/getbyid/${co_document_id}`)
    .then((res) => res.data);
};

type QueryFnType = typeof getOtherDocuments;

type UseOtherDocumentsOptions = {
  co_document_id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useGetOtherDocuments = ({
  co_document_id,
  config,
}: UseOtherDocumentsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["co-document-files", co_document_id],
    queryFn: () => getOtherDocuments({ co_document_id }),
  });
};
