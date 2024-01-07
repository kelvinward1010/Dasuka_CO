import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getMaterialsCustomer = async ({
  tax_code,
}: {
  tax_code: string;
}): Promise<
  {
    material_id: string;
    material_code: string;
    material_name: string;
    hs_code: string;
  }[]
> => {
  const res = await apiClient.get(
    `${API_CO}/vat-invoices/get-material-dropdown/` + tax_code,
  );

  return res.data;
};

type QueryFnType = typeof getMaterialsCustomer;

type UseMaterialsCustomerOptions = {
  tax_code: string;
  config?: QueryConfig<QueryFnType>;
};

export const useMaterialsCustomer = ({
  tax_code,
  config,
}: UseMaterialsCustomerOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["materials-customer", tax_code],
    queryFn: () => getMaterialsCustomer({ tax_code }),
  });
};
