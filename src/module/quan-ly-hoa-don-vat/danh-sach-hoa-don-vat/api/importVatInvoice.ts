import { useMutation } from "react-query";

import { API_PDF } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { VatInvoice } from "../types";
import { mappingVatInvoiceImport } from "../utils/array";

export const importVATInvoice = async (
  data: FormData,
): Promise<VatInvoice[]> => {
  const res = await apiClient.post(`${API_PDF}/import/import-pdf-files`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return mappingVatInvoiceImport(res.data);
};

type UseImportVATInvoiceOptions = {
  config?: MutationConfig<typeof importVATInvoice>;
};

export const useImportVATInvoice = ({ config }: UseImportVATInvoiceOptions) => {
  return useMutation({
    ...config,
    mutationFn: importVATInvoice,
  });
};
