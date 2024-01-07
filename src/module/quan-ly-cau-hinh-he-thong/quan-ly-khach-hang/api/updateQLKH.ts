import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { ICustomer } from "../types";

export type UpdateQLKHDTO = Pick<
  ICustomer,
  "customer_id" | "tax_code" | "customer_name" | "phone_number" | "address"
>;

export const updateQLKH = async (data: UpdateQLKHDTO): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/customers/update`, data);

  return res.data;
};

type UseUpdateQLKHOptions = {
  config?: MutationConfig<typeof updateQLKH>;
};

export const useUpdateQLKH = ({ config }: UseUpdateQLKHOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateQLKH,
  });
};
