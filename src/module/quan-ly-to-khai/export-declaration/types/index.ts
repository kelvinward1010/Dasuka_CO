interface IExportDeclarationBase {
  active_flag: number;
  bill_number: string;
  created_by_user_id: string;
  created_date_time: Date;
  customer_id: string;
  date_of_declaration: string;
  export_declaration_id: string;
  export_declaration_number: string;
  importer: string;
  invoice_number: string;
  invoice_value: string;
  status: string;
  lu_updated: Date;
  lu_user_id: string;
  tax_exchange_rate: string;
  usd_exchange_rate: string;
  shipping_terms: string;
  co_used: number;
}

export interface IExportDeclaration extends IExportDeclarationBase {
  export_declaration_detail: IExportDeclarationDetail[];
}

export interface IExportDeclarationCreate extends IExportDeclarationBase {
  list_json_export_declaration_detail: IExportDeclarationDetail[];
}

export interface IExportDeclarationDetail {
  active_flag: number;
  co_available: number;
  co_used: number;
  created_by_user_id: string;
  created_date_time: Date;
  export_declaration_detail_id: number;
  export_declaration_id: string;
  export_declaration_number: string;
  hs_code: string;
  lu_updated: Date;
  lu_user_id: string;
  material_name: string;
  origin_country: string;
  product_code: string;
  invoice_value: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  unit: string;
  co_documents: any[];
  fob_value?: number;
  taxable_price?: number;
  editable: number;
}

export type IExportDeclarationDropdown = {
  label: string | JSX.Element;
  value: string;
  shipping_terms: string;
}[];

export const EXPORT_DECLARATION_STATUS = [
  {
    value: "",
    label: "Tất cả",
  },
  {
    value: "Đang sử dụng",
    label: "Đang sử dụng",
  },
  {
    value: "Đã sử dụng hết",
    label: "Đã sử dụng hết",
  },
  {
    value: "Mới",
    label: "Mới",
  },
];
