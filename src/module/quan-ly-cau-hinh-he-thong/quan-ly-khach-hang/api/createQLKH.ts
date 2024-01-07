import { FormRule } from "antd";
import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { ICustomer } from "../types";

export type CreateQLKHDTO = Pick<
  ICustomer,
  "customer_id" | "tax_code" | "customer_name" | "phone_number" | "address"
>;

export const createQLKH = async (data: CreateQLKHDTO): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/customers/create`, data);

  return res.data;
};

type UseCreateQLKHOptions = {
  config?: MutationConfig<typeof createQLKH>;
};

export const useCreateQLKH = ({ config }: UseCreateQLKHOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createQLKH,
  });
};

export const RULES_CUSTOMER_CREATE: Record<keyof CreateQLKHDTO, FormRule[]> = {
  customer_id: [
    {
      required: true,
      message: "Mã khách hàng không được để trống",
    },
  ],
  tax_code: [
    {
      required: true,
      message: "Mã số thuế không được để trống",
    },
  ],
  customer_name: [
    {
      required: true,
      message: "Tên khách hàng không được để trống",
    },
  ],
  phone_number: [
    {
      required: true,
      message: "Số điện thoại không được để trống",
    },
  ],
  address: [
    {
      required: true,
      message: "Địa chỉ không được để trống",
    },
  ],
};
