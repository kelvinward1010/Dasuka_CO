import { useMutation } from "react-query";

import { API_PDF } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { VatInvoice } from "../types";
import { mappingVatInvoiceImport } from "../utils/array";

export const importVATInvoiceV2 = async (
  data: FormData,
): Promise<VatInvoice[]> => {
  const res = await apiClient.post(`${API_PDF}/import/map-pdf-files`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return mappingVatInvoiceImport(res.data);
};

type UseImportVATInvoiceOptions = {
  config?: MutationConfig<typeof importVATInvoiceV2>;
};

export const useImportVATInvoiceV2 = ({
  config,
}: UseImportVATInvoiceOptions) => {
  return useMutation({
    ...config,
    mutationFn: importVATInvoiceV2,
  });
};
