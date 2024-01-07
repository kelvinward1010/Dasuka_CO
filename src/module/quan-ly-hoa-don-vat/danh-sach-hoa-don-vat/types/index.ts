import { IBaseEntity } from "@/types";

export type VATInvoice = {
  so_hd: string;
  date: string;
  name_dvmh: string;
  status: string;
} & IBaseEntity;

export interface VatInvoiceCreateDTO {
  created_by_user_id: string;
  customer_id: string;
  customer_name: string;
  file_name: string;
  file_path: string;
  invoice_date?: string;
  list_json_vat_invoice_detail: VatInvoiceDetail[];
  status: string;
  vat_invoice_id: string;
}

export interface IQuantityVat {
  co_document_id: number | string;
  status_id: number | string;
  norm_name: string;
  import_declaration_id: string;
  material_id: string;
  sort_order: string | number;
  co_doned: number;
  quantity: number;
  co_available: number;
  sum_co_doned: number;
  availability: number;
}

export interface VatInvoice {
  vat_invoice_id: string;
  serial_number?: string;
  customer_id?: string;
  customer_name: string;
  tax_code: string;
  file_name?: string;
  file_path?: string;
  vendor_name: string;
  vendor_tax_code: string;
  x_annex_code?: string;
  date?: string;
  usd_exchange_rate?: number;
  invoice_date?: string;
  status?: string;
  vat_invoice_detail?: VatInvoiceDetail[];
}

export interface VatInvoiceDetail {
  co_available?: number;
  vat_invoice_detail_id?: number;
  vat_invoice_id?: string;
  hs_code?: string;
  material_id?: string;
  material_code?: string;
  quantity: number;
  material_name: string;
  unit_price: number;
  unit: string;
  vat_material_code: string;
  vat_material_name: string;
}

export interface IVatInvoiceImport {
  date: string;
  serial: string;
  no: string;
  seller: {
    companyName: string;
    taxCode: string;
  };
  buyer: {
    companyName: string;
    taxCode: string;
  };
  exchange_rate?: number;
  table: any[];
  file_name?: string;
  path?: string;
}

export const VAT_INVOICE_STATUS = [
  {
    value: 0,
    label: "Tất cả",
  },
  {
    value: 1,
    label: "Đang sử dụng",
  },
  {
    value: 2,
    label: "Đã sử dụng hết",
  },
  // {
  //   value: "Mới",
  //   label: "Mới",
  // },
];
