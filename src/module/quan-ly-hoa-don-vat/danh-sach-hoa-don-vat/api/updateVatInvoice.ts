import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";

export const updateVatInvoice = async (data: any): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/vat-invoices/update`, data);
  return res.data;
};

type UseUpdateVatInvoiceOptions = {
  config?: MutationConfig<typeof updateVatInvoice>;
};

export const useUpdateVatInvoice = ({ config }: UseUpdateVatInvoiceOptions) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateVatInvoice,
  });
};
