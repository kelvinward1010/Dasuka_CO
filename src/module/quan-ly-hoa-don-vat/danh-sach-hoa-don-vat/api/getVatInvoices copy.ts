import { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

import { API_PDF } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const checkVatExists = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<{ vat_invoice_id: string; is_exists: boolean | number }[]> => {
  const res = await apiClient.post(
    `${API_PDF}/import/check-vat-exists`,
    filterEmptyString(params),
  );

  return res.data;
};

type QueryFnType = typeof checkVatExists;

type UseCheckVatExistsOptions = {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<QueryFnType>;
};

export const useCheckVatExists = ({
  params,
  config,
}: UseCheckVatExistsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["vat_invoices", params],
    queryFn: () => checkVatExists({ params }),
  });
};
