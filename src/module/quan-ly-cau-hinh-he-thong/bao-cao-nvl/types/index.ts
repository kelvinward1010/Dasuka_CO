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
}

export interface IImportDeclaration extends IImportDeclarationBase {
  import_declaration_detail: IImportDeclarationDetail[];
}

export interface IImportDeclarationCreate extends IImportDeclarationBase {
  list_json_import_declaration_detail: IImportDeclarationDetail[];
}

export const IMPORT_DECLARATION_STATUS = [
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
