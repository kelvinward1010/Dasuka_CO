import { useQuery } from "react-query";

import { API_REPORT } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getVatDocuments = async ({ id }: { id: string }): Promise<any> => {
  const res = await apiClient.get(
    `${API_REPORT}/co-document/export-codocument-vatpdf/${id}`,
  );
  return res.data;
};

type QueryFnType = typeof getVatDocuments;

type UseCoDocumentOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useVatDocument = ({ config, id }: UseCoDocumentOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["co-documents", id],
    queryFn: () => getVatDocuments({ id }),
  });
};
