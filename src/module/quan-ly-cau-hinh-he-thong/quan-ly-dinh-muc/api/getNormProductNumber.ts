import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export type INormDeclarationDTO = {
  vat_invoice_id: string;
  import_declaration_id: string;
  co_doned: number;
  material_id: string;
  sort_order?: string | number;
  serial_number?: string;
};

type IGetNormLazyDTO = {
  norm_id: string | number;
  product_number: number;
  export_declaration_id: string;
  list_json_material_detail?: INormDeclarationDTO[] | null;
  list_json_nguyen_lieus?: any[] | null;
  form_co?: string;
  co_document_id?: number | null;
  running_style?: string | null;
};

export const getNormProductNumber = async (
  data: IGetNormLazyDTO,
): Promise<any> => {
  const res = await apiClient.post(
    `${API_CO}/norms/getnormproductnumber`,
    data,
  );
  return res.data;
};

type UseNormLazyOptions = {
  config?: MutationConfig<typeof getNormProductNumber>;
};

export const useNormProductNumber = ({ config }: UseNormLazyOptions) => {
  return useMutation({
    ...config,
    mutationFn: getNormProductNumber,
    mutationKey: ["getnormproductnumber"],
  });
};
