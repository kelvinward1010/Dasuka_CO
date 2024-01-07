import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getMaterials = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<any[]> => {
  const res = await apiClient.post(
    `${API_CO}/materials/get-materials-by-material-code`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getMaterials;

type UseMaterialsOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useMaterials = ({ params, config }: UseMaterialsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["materials", params],
    queryFn: () => getMaterials({ params }),
  });
};
