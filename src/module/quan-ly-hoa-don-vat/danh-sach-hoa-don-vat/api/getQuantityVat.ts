import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { IQuantityVat } from "../types";

export const getQuantityVat = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<IQuantityVat[]>> => {
  const res = await apiClient.post(
    `${API_CO}/vat-invoices/get-survival-vat`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getQuantityVat;

type UseQuantityVatOptions = {
  enabled: boolean;
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useQuantityVat = ({
  enabled = false,
  params,
  config,
}: UseQuantityVatOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    enabled,
    queryKey: ["quantity-vats", params],
    queryFn: () => getQuantityVat({ params }),
  });
};
