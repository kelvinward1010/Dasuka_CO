import { FormRule } from "antd";
import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { ICreateHouseBillDTO, IFormCreateHouseBill } from "../../types";

export const createHouseBill = async (
  data: ICreateHouseBillDTO,
): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/house-bills/alter-house-bill`,
    data,
  );
  return res.data;
};

type UseCreateHouseBillOptions = {
  config?: MutationConfig<typeof createHouseBill>;
};

export const useCreateHouseBill = ({ config }: UseCreateHouseBillOptions) => {
  return useMutation({
    ...config,
    mutationFn: createHouseBill,
  });
};

export const RULES_HOUSE_BILL_CREATE: Record<
  keyof IFormCreateHouseBill,
  FormRule[]
> = {
  house_bill_number: [
    {
      required: true,
      message: "Mã lô hàng không được để trống",
    },
  ],
  transportation_expense: [
    {
      required: true,
      message: "Chi phí vận chuyển không được để trống",
    },
  ],
  insurance_expense: [
    {
      required: true,
      message: "Chi phí bảo hiểm không được để trống",
    },
  ],
  list_json_export_declaration_ids: [
    {
      required: true,
      message: "Danh sách tờ khai xuất không được để trống",
    },
  ],
};
