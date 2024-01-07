import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const recalculationCoDocument = async ({
  id,
}: {
  id: string;
}): Promise<any> => {
  const res = await apiClient.get(`${API_CO}/co-documents/recalculation/${id}`);
  return res.data;
};

type QueryFnType = typeof recalculationCoDocument;

type UseCoDocumentOptions = {
  id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useRecalculationCoDocument = ({
  config,
  id,
}: UseCoDocumentOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["co-documents", id],
    queryFn: () => recalculationCoDocument({ id }),
  });
};
