import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export type IGetDropdownNormDTO = {
  product_codes: any[];
  customer_id: string;
};

export interface INormDropdown {
  value: string | number;
  label: string;
  product_code: string;
}

export const getDropdownByMultiProductCodes = async (
  data: IGetDropdownNormDTO,
): Promise<INormDropdown[]> => {
  const res = await apiClient.post(
    `${API_CO}/norms/dropdownByMultiProductCodes/`,
    data,
  );
  return res.data;
};

type UseDropdownNormOptions = {
  config?: MutationConfig<typeof getDropdownByMultiProductCodes>;
};

export const useDropdownNormMultiProductCodesLazy = ({
  config,
}: UseDropdownNormOptions) => {
  return useMutation({
    ...config,
    mutationFn: getDropdownByMultiProductCodes,
    mutationKey: "norm-dropdown",
  });
};
