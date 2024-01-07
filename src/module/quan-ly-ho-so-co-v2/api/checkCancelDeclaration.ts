import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const checkCancelDeclaration = async ({
  co_id,
}: {
  co_id: string;
}): Promise<any> => {
  const res = await apiClient.get(
    `${API_CO}/co-documents/check-canceled-declaration/${co_id}`,
  );
  return res.data;
};

type QueryFnType = typeof checkCancelDeclaration;

type UseCheckCancelDeclarationOptions = {
  co_id: string;
  config?: QueryConfig<QueryFnType>;
};

export const useCheckCancelDeclaration = ({
  config,
  co_id,
}: UseCheckCancelDeclarationOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["check-cancel-declaration", co_id],
    queryFn: () => checkCancelDeclaration({ co_id }),
  });
};
