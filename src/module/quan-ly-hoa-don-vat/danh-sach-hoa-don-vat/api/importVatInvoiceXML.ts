import { useMutation } from "react-query";

import { API_PDF } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

import { VatInvoice } from "../types";
import { mappingVatInvoiceImport } from "../utils/array";

export const importVatInvoiceXML = async (
  data: FormData,
): Promise<VatInvoice[]> => {
  const res = await apiClient.post(`${API_PDF}/import/map-xml-files`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return mappingVatInvoiceImport(res.data);
};

type UseImportVATInvoiceOptions = {
  config?: MutationConfig<typeof importVatInvoiceXML>;
};

export const useImportVatInvoiceXML = ({
  config,
}: UseImportVATInvoiceOptions) => {
  return useMutation({
    ...config,
    mutationFn: importVatInvoiceXML,
  });
};
