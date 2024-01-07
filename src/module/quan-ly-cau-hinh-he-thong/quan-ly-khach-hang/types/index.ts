export interface ICustomer {
  customer_id: string;
  customer_name: string;
  tax_code: string;
  phone_number: string;
  address: string;
  processing_fee: number;
  active_flag: number;
  created_by_user_id: string;
  created_date_time: Date;
  lu_updated: Date;
  lu_user_id: string;
  employee_ids: IEmployeeIds[];
}

export interface IEmployeeIds {
  employee_id: string;
  employee_name: string;
}

export type ICustomerDropdown = {
  label: string;
  value: string;
  tax_code: string;
  processing_fee: number;
}[];
