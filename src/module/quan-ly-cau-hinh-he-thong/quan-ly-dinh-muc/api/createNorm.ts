import { FormRule } from "antd";
import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { INormCreate } from "../types";

export type CreateNormDTO = Pick<
  INormCreate,
  | "product_id"
  | "norm_name"
  | "list_json_norm_detail"
  | "created_by_user_id"
  | "customer_id"
>;

export const createNorm = async (
  data: CreateNormDTO,
): Promise<{ norm_id: number }> => {
  const res = await apiClient.post(`${API_CO}/norms/create`, data);

  return res.data;
};

type UseCreateNormOptions = {
  config?: MutationConfig<typeof createNorm>;
};

export const useCreateNorm = ({ config }: UseCreateNormOptions) => {
  return useMutation({
    ...config,
    mutationFn: createNorm,
  });
};

export const RULES_NORM_CREATE: Record<keyof CreateNormDTO, FormRule[]> = {
  product_id: [{ required: true, message: "Vui lòng chọn sản phẩm" }],
  norm_name: [{ required: true, message: "Vui lòng nhập tên định mức" }],
  list_json_norm_detail: [],
  created_by_user_id: [],
  customer_id: [],
};
