import { useQuery } from "react-query";

import { API_CO } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import { VatInvoice } from "../types";

export const getVatInvoice = async ({
  id,
  serial_number,
}: {
  id: string;
  serial_number: string;
}): Promise<VatInvoice> => {
  const res = await apiClient.get(
    `${API_CO}/vat-invoices/getbyid/${id}/${serial_number || "serial-number"}`,
  );
  return res.data;
};

type QueryFnType = typeof getVatInvoice;

type UseVatInvoiceOptions = {
  id: string;
  serial_number: string;
  config?: QueryConfig<QueryFnType>;
};

export const useVatInvoice = ({
  config,
  id,
  serial_number,
}: UseVatInvoiceOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["vat_invoices", id, serial_number],
    queryFn: () => getVatInvoice({ id, serial_number }),
  });
};
