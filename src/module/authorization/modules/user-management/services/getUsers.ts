import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CORE } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { IListUser } from "../types/user";

export const getUsers = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<IListUser>> => {
  const res = await apiClient.post(
    `${API_CORE}/users/search`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getUsers;

type UseUserOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useUsers = ({ params, config }: UseUserOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["users", params],
    queryFn: () => getUsers({ params }),
  });
};
