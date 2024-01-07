import { useMutation } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { MutationConfig, queryClient } from "@/lib/react-query";
import { IBaseDeleteItems } from "@/types";

export const deleteVatInvoice = async (
  data: IBaseDeleteItems<{
    vat_invoice_id: string;
  }>,
): Promise<any> => {
  const res = await apiClient.post(`${API_CO}/vat-invoices/delete`, data);
  return res.data;
};

type UseDeleteVatInvoiceOptions = {
  config?: MutationConfig<typeof deleteVatInvoice>;
};

export const useDeleteVatInvoice = ({
  config,
}: UseDeleteVatInvoiceOptions = {}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries(["vat-invoices"]);
    },
    ...config,
    mutationFn: deleteVatInvoice,
  });
};
