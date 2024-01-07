import { useQuery } from "react-query";

import { API_DOWNLOAD } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getExternalFileMerged = async (
  pathFiles: string[],
): Promise<any> => {
  return apiClient
    .post(`${API_DOWNLOAD}/merge-pdf/get-external-merge`, {
      files: pathFiles,
    })
    .then((res) => res.data);
};

type QueryFnType = typeof getExternalFileMerged;

type UseOtherDocumentsOptions = {
  pathFiles: string[];
  config?: QueryConfig<QueryFnType>;
};

export const useGetExternalFileMerged = ({
  pathFiles,
  config,
}: UseOtherDocumentsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["document-files", pathFiles],
    queryFn: () => getExternalFileMerged(pathFiles),
  });
};
