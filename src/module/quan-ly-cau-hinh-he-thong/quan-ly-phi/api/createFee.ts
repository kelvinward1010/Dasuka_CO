import { FormRule } from "antd";
import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { Fee } from "../types";

export type CreateFeeDTO = Fee;

export const createFee = async (data: CreateFeeDTO): Promise<any> => {
  const res = await apiClient?.post(`${API_CO}/fees/create`, data);

  return res.data;
};

type UseCreateFeeOptions = {
  config?: MutationConfig<typeof createFee>;
};

export const useCreateFee = ({ config }: UseCreateFeeOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createFee,
  });
};

export const RULES_FEE_CREATE: Record<keyof CreateFeeDTO, FormRule[]> = {
  fee_id: [
    {
      required: true,
      message: "Không được để trống",
    },
  ],
  fee_name: [
    {
      required: true,
      message: "Không được để trống",
    },
  ],
  unit: [
    {
      required: true,
      message: "Không được để trống",
    },
  ],
  fee_type: [
    {
      required: true,
      message: "Không được để trống",
    },
  ],
  active_flag: [],
  created_by_user_id: [],
  created_date_time: [],
  lu_updated: [],
  lu_user_id: [],
};
