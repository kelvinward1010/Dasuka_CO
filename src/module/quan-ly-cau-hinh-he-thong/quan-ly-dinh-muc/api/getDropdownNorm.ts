import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { INormDropdown } from "../types";

export type IGetDropdownNormDTO = {
  customer_id: string;
  product_id: string;
};

export const getDropdownNorm = async ({
  customer_id,
  product_id,
}: IGetDropdownNormDTO): Promise<INormDropdown> => {
  const res = await apiClient.get(
    `${API_CO}/norms/dropdown/${customer_id}/${product_id}`,
  );
  return res.data;
};

type UseDropdownNormOptions = {
  config?: MutationConfig<typeof getDropdownNorm>;
};

export const useDropdownNormLazy = ({ config }: UseDropdownNormOptions) => {
  return useMutation({
    ...config,
    mutationFn: getDropdownNorm,
    mutationKey: "norm-dropdown",
  });
};
