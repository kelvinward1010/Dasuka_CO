import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { IBaseListItem } from "@/types";

import { VatInvoice } from "../types";

export const getVatInvoices = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<VatInvoice>> => {
  const res = await apiClient.post(
    `${API_CO}/vat-invoices/search`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof getVatInvoices;

type UseVatInvoicesOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useVatInvoices = ({ params, config }: UseVatInvoicesOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["vat_invoices", params],
    queryFn: () => getVatInvoices({ params }),
  });
};
