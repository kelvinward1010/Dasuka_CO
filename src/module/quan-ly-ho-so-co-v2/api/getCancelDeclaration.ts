import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getCancelDeclaration = async (): Promise<any> => {
  const res = await apiClient.get(
    `${API_CO}/co-documents/get-cannceled-declaration-history`,
  );

  return res.data;
};

type QueryFnType = typeof getCancelDeclaration;

type UseGetCancelDeclarationOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useGetCancelDeclaration = ({
  config,
}: UseGetCancelDeclarationOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["cancel-declarations"],
    queryFn: () => getCancelDeclaration(),
  });
};
