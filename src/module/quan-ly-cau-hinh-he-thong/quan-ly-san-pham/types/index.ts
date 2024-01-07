export interface IProduct {
  product_code: string;
  product_id: string;
  hs_code: string;
  customer_name: string;
  product_name: string;
  unit: string;
  active_flag: number;
  created_by_user_id: string;
  created_date_time: Date;
  lu_updated: Date;
  lu_user_id: string;
}
