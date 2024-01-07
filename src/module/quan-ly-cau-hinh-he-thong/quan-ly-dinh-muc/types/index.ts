export interface INormBase {
  norm_id: number;
  norm_name: string;
  customer_id: string;
  customer_name: string;
  product_id: string;
  product_name: string;
  product_code: string;
  active_flag: number;
  created_by_user_id: string;
  created_date_time: Date;
  lu_updated: Date;
  lu_user_id: string;
}

export interface INorm extends INormBase {
  norm_detail: INormDetail[];
}

export interface INormCreate extends INormBase {
  list_json_norm_detail: INormDetail[];
}

export interface INormProductNumber {
  norm_id: number;
  norm_name: string;
  customer_id: string;
  product_id: string;
  norm_detail: INormProductNumberDetail[];
}

export interface INormProductNumberDetail {
  norm_detail_id: number;
  norm_id: number;
  material_id: string;
  material_code: string;
  norm_value: number;
  loss_ratio: number;
  norm_value_loss: number;
  product_code: string;
  invoice_value: string;
  source: string;
  norm_material_name: string;
  norm_vat_invoice_import_declaration: any;
  material_status: string;
  unit: string;
  cif?: string;
  dateT?: string;
  number?: string;
}

export interface INormDetail {
  norm_detail_id: number;
  norm_id: number;
  material_id: string;
  material_code: string;
  norm_material_name: string;
  product_code: string;
  material_name: string;
  unit: string;
  norm_value: number;
  loss_ratio: number;
  norm_value_loss: number;
  source: string;
  active_flag: number;
  created_by_user_id: string;
  created_date_time: Date;
  lu_updated: Date;
  lu_user_id: string;
}

export type INormDropdown = {
  label: string;
  value: string;
}[];
