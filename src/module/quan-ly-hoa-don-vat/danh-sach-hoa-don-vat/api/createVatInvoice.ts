import { FormRule } from "antd";
import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { VatInvoiceCreateDTO, VatInvoiceDetail } from "../types";

export type CreateVatInvoiceDTO = VatInvoiceCreateDTO;

export const createVatInvoice = async (data: any): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/vat-invoices/create`, data);

  return res.data;
};

type UseCreateVatInvoiceOptions = {
  config?: MutationConfig<typeof createVatInvoice>;
};

export const useCreateVatInvoice = ({ config }: UseCreateVatInvoiceOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createVatInvoice,
  });
};

export const RULES_VAT_INVOICE_CREATE: Record<
  keyof CreateVatInvoiceDTO,
  FormRule[]
> = {
  created_by_user_id: [],
  customer_id: [],
  customer_name: [],
  file_name: [],
  file_path: [],
  invoice_date: [],
  list_json_vat_invoice_detail: [],
  status: [],
  vat_invoice_id: [
    {
      required: true,
      message: "Số hóa đơn VAT không được để trống",
    },
  ],
};

export const RULES_VAT_INVOICE_DETAIL: Record<
  keyof VatInvoiceDetail,
  FormRule[]
> = {
  co_available: [],
  vat_invoice_detail_id: [],
  vat_material_code: [],
  vat_material_name: [],
  material_code: [],
  vat_invoice_id: [
    {
      required: true,
      message: "Số hóa đơn VAT không được để trống và chỉ được nhập số.",
    },
  ],
  hs_code: [
    {
      required: true,
      message: "Mã HS không được để trống và chỉ được nhập số.",
    },
    {
      pattern: /^[0-9]*$/g,
      message: "Mã HS chỉ chứa số",
    },
  ],
  material_id: [
    {
      required: true,
      message: "Mã NL, VT không được để trống",
    },
  ],
  material_name: [
    {
      required: true,
      message: "Tên NL, VT không được để trống",
    },
  ],
  quantity: [
    {
      required: true,
      message: "Số lượng không được để trống",
    },
  ],
  unit: [
    {
      required: true,
      message: "Đơn vị tính không được để trống",
    },
  ],
  unit_price: [
    {
      required: true,
      message: "Đơn giá không được để trống",
    },
  ],
};
