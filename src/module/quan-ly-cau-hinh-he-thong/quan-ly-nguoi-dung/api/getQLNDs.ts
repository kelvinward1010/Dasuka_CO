import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { IEmployee } from "../types";

export const getQLNDs = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<IEmployee>> => {
  const res = await apiClient.post(
    `${API_CO}/employees/search`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getQLNDs;

type UseQLNDsOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useQLNDs = ({ params, config }: UseQLNDsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["qlnds", params],
    queryFn: () => getQLNDs({ params }),
  });
};
