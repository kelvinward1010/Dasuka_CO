import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { IRole } from "../../types/role";

export const getRoles = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<IRole>> => {
  const res = await apiClient.post(
    `${API_CORE}/role/search`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getRoles;

type UseRoleOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useRoles = ({ params, config }: UseRoleOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["roles", params],
    queryFn: () => getRoles({ params }),
  });
};
