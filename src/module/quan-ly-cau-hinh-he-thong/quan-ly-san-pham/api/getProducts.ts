import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { IProduct } from "../types";

export const getProducts = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<IProduct>> => {
  const res = await apiClient.post(
    `${API_CO}/products/search`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getProducts;

type UseProductsOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useProducts = ({ params, config }: UseProductsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["products", params],
    queryFn: () => getProducts({ params }),
  });
};
