import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { Unit } from "../types";

export const getUnits = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<Unit>> => {
  const res = await apiClient.post(
    `${API_CO}/units/search`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getUnits;

type UseUnitsOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useUnits = ({ params, config }: UseUnitsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["units", params],
    queryFn: () => getUnits({ params }),
  });
};
