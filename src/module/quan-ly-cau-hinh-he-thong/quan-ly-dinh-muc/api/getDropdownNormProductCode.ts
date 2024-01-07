import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { INormDropdown } from "../types";

export type IGetDropdownNormDTO = {
  product_code: string;
  customer_id: string;
};

export const getDropdownNormProductCode = async (
  data: IGetDropdownNormDTO,
): Promise<INormDropdown> => {
  const res = await apiClient.post(
    `${API_CO}/norms/dropdownByProductCode/`,
    data,
  );
  return res.data;
};

type UseDropdownNormOptions = {
  config?: MutationConfig<typeof getDropdownNormProductCode>;
};

export const useDropdownNormProductCodeLazy = ({
  config,
}: UseDropdownNormOptions) => {
  return useMutation({
    ...config,
    mutationFn: getDropdownNormProductCode,
    mutationKey: "norm-dropdown",
  });
};
