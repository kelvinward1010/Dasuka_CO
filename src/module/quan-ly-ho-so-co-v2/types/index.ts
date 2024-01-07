export interface ICoDocument {
  co_document_id: string;
  created_date: any;
  employee_id: string;
  customer_id: string;
  co_form_id: string;
  status_id: number | string;
  co_document_detail: any;
  active_flag: number;
  created_by_user_id: string;
  created_date_time: Date;
  lu_updated: Date;
  lu_user_id: string;
  co_document_number: string | number;
}

export interface CoForm {
  co_form_id: string;
  form_name: string;
  description: string;
  sort_order: number;
  active_flag: number;
  created_by_user_id: string;
  created_date_time: Date;
  lu_updated: Date;
  lu_user_id: string;
  list_json_co_form_criteria: CoFormCriteria[];
}

export interface CoFormCriteria {
  co_form_criteria_id: number;
  co_form_id: string;
  criteria_id: string;
  active_flag: number;
  created_by_user_id: string;
  created_date_time: Date;
  lu_updated: Date;
  lu_user_id: string;
}

export const CO_DOCUMENT_STATUS = [
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
