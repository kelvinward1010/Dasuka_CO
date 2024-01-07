import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import { IExpectedDropdown } from "../types";

export const getDropdownExpected = async ({
  product_code,
}: {
  product_code: string;
}): Promise<IExpectedDropdown | any> => {
  const res = await apiClient.get(
    `${API_CO}/products/getbycode/${product_code}`,
  );

  return res.data;
};

type QueryFnType = typeof getDropdownExpected;

type UseDropdownExpectedOptions = {
  product_code: string;
  config?: QueryConfig<QueryFnType>;
};

export const useDropdownExpected = ({
  product_code,
  config,
}: UseDropdownExpectedOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["expected-dropdown"],
    queryFn: () => getDropdownExpected({ product_code }),
  });
};
