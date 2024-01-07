export interface IMessage {
  filename: string;
  notification: string;
}

interface IImportDeclarationBase {
  active_flag: number;
  bill_number: string;
  created_by_user_id: string;
  created_date_time: Date;
  customer_id: string;
  date_of_declaration: string;
  exporter: string;
  import_declaration_id: string;
  import_declaration_number: string;
  usd_exchange_rate: number;
  invoice_number: string;
  status: string;
  list_json_import_declaration_detail: IImportDeclarationDetail[];
  lu_updated: Date;
  lu_user_id: string;
  shipping_fee: number;
  co_used: number;
  form?: string;
  prefer_co_date?: Date;
  prefer_co_document_number?: string;
  x_annex_code?: string;
}

export interface IImportDeclarationDetail {
  active_flag: number;
  co_available: number;
  co_using: number;
  co_used: number;
  created_by_user_id: string;
  created_date_time: Date;
  hs_code: string;
  import_declaration_id: string;
  import_detail_id: number;
  lu_updated: Date;
  lu_user_id: string;
  material_id: string;
  material_name: string;
  material_code: string;
  quantity: number;
  unit_price_transport?: number;
  unit_price?: number;
  unit: string;
  import_declaration_detail_id: string;
  editable: number;
  sort_order?: number;
}

export interface IQuantityDeclaration {
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

export interface IImportDeclaration extends IImportDeclarationBase {
  import_declaration_detail: IImportDeclarationDetail[];
}

export interface IImportDeclarationCreate extends IImportDeclarationBase {
  list_json_import_declaration_detail: IImportDeclarationDetail[];
}

export const IMPORT_DECLARATION_STATUS = [
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
