export interface OpenDeclarationReport {
  bill_number: string;
  cd_type: string;
  customs_stream: string;
  date_of_declaration: string;
  gw: string;
  import_export: string;
  incurred_cost: number;
  invoice_number: string;
  pk: string;
  report_id: string;
  report_number: string;
  shipping_terms: string;
  transportation_mode: string;
  checker: string;
  fees: ListFee[];
}

export interface ListFee {
  fee_name: string;
  unit?: string;
  quantity: number;
  unit_price: number;
  fee_id: string;
  total?: number;
  fee_type: string;
}

export interface Fee {
  fee_id: string;
  fee_name: string;
  fee_type: string;
  unit: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface OpenDeclarationReportUpdate {
  open_declaration_report_id: string;
  truck_type: string;
  import_truck_number: string;
  plant_number: string;
  sdk_person: string;
  employee_id: string;
  dsk_person: string;
  note: string;
  checker: string;
  fees: ListFee[];
  lu_user_id: string;
}

export interface Fee {
  fee_id: string;
  fee_name: string;
  unit: string;
  fee_type: string;
  active_flag: number;
  created_by_user_id: string;
  created_date_time: Date;
  lu_updated: Date;
  lu_user_id: string;
}
